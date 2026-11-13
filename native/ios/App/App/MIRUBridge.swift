import UIKit
import WebKit
import Capacitor
import StoreKit
import AuthenticationServices
#if MIRU_ADS
import UserMessagingPlatform
#endif

final class MIRUBridgeViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(MIRUNative())
        #if DEBUG
        if ProcessInfo.processInfo.arguments.contains("--miru-smoke") {
            DispatchQueue.main.asyncAfter(deadline: .now() + 6) { [weak self] in
                let script = """
                const config = await window.MIRU_NATIVE.configuration();
                return JSON.stringify({config, app:!!window.__miruIOS, consent:!!window.MIRU_AI, body:document.body.innerText.includes('MIRU'), state:document.readyState});
                """
                Task { @MainActor in
                    do {
                        let result = try await self?.webView?.callAsyncJavaScript(script, arguments: [:], in: nil, contentWorld: .page)
                        let text = result as? String ?? "{}"
                        if let dir = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first { try? text.write(to: dir.appendingPathComponent("miru-smoke.json"), atomically: true, encoding: .utf8) }
                        NSLog("MIRU_SMOKE: %@", text)
                    }
                    catch { NSLog("MIRU_SMOKE_ERROR: %@", String(describing: error)) }
                }
            }
        }
        #endif
    }
}
@objc(MIRUNative)
public final class MIRUNative: CAPPlugin, CAPBridgedPlugin, ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding {
    public let identifier = "MIRUNative"
    public let jsName = "MIRUNative"
    public let pluginMethods: [CAPPluginMethod] = ["configuration", "products", "purchase", "pendingTransactions", "finish", "signInWithApple", "signInWithGoogle", "showRewardedAd", "privacyOptions"].map { CAPPluginMethod(name: $0, returnType: CAPPluginReturnPromise) }
    var appleCall: CAPPluginCall?
    var appleController: ASAuthorizationController?
    var updatesTask: Task<Void, Never>?
    #if MIRU_ADS
    var adCoordinator: MIRUAdCoordinator?
    #endif
    override public func load() {
        #if MIRU_ADS
        DispatchQueue.main.async { MIRUAdCoordinator.updateConsent() }
        #endif
        updatesTask = Task { [weak self] in
            for await result in Transaction.updates {
                guard case .verified = result else { continue }
                self?.notifyListeners("transactionUpdated", data: [:])
            }
        }
    }
    deinit { updatesTask?.cancel() }
    @objc func configuration(_ call: CAPPluginCall) {
        let id = Bundle.main.object(forInfoDictionaryKey: "GIDClientID") as? String ?? ""
        #if MIRU_ADS
        let adsEnabled = true
        let privacyRequired = ConsentInformation.shared.privacyOptionsRequirementStatus == .required
        #else
        let adsEnabled = false
        let privacyRequired = false
        #endif
        call.resolve(["platform": "ios", "googleConfigured": !id.isEmpty && !id.contains("$("), "adsEnabled": adsEnabled, "privacyOptionsRequired": privacyRequired])
    }
    @objc func products(_ call: CAPPluginCall) {
        guard let ids = call.getArray("ids", String.self), !ids.isEmpty else { call.reject("Missing product IDs"); return }
        Task { do {
            let values = try await Product.products(for: ids)
            call.resolve(["products": values.map { ["productId": $0.id, "displayPrice": $0.displayPrice] }])
        } catch { call.reject("Could not load products", nil, error) } }
    }
    @objc func purchase(_ call: CAPPluginCall) {
        guard let id = call.getString("productId"), !id.isEmpty, let s = call.getString("appAccountToken"), let uuid = UUID(uuidString: s) else { call.reject("Missing product or account token"); return }
        Task { do {
            guard let product = try await Product.products(for: [id]).first else { call.reject("Product unavailable"); return }
            switch try await product.purchase(options: [.appAccountToken(uuid)]) {
            case .success(let result):
                guard case .verified(let tx) = result else { call.reject("Unverified transaction"); return }
                call.resolve(["status": "purchased", "transactionId": String(tx.id), "jws": result.jwsRepresentation])
            case .pending: call.resolve(["status": "pending"])
            case .userCancelled: call.resolve(["status": "cancelled"])
            @unknown default: call.reject("Unknown purchase result")
            }
        } catch { call.reject("Purchase failed", nil, error) } }
    }
    @objc func pendingTransactions(_ call: CAPPluginCall) {
        Task {
            var values: [[String: String]] = []
            for await result in Transaction.unfinished {
                if case .verified(let tx) = result { values.append(["transactionId": String(tx.id), "productId": tx.productID, "jws": result.jwsRepresentation]) }
            }
            call.resolve(["transactions": values])
        }
    }
    @objc func finish(_ call: CAPPluginCall) {
        guard let id = call.getString("transactionId"), !id.isEmpty else { call.reject("Missing transaction ID"); return }
        Task {
            for await result in Transaction.unfinished {
                if case .verified(let tx) = result, String(tx.id) == id { await tx.finish(); call.resolve(); return }
            }
            call.resolve()
        }
    }
    @objc func signInWithApple(_ call: CAPPluginCall) {
        guard let nonce = call.getString("nonce"), !nonce.isEmpty else { call.reject("Missing nonce"); return }
        DispatchQueue.main.async {
            guard self.appleCall == nil else { call.reject("Apple sign-in already in progress"); return }
            self.appleCall = call
            let request = ASAuthorizationAppleIDProvider().createRequest()
            request.requestedScopes = [.fullName, .email]
            request.nonce = nonce
            let controller = ASAuthorizationController(authorizationRequests: [request])
            controller.delegate = self
            controller.presentationContextProvider = self
            self.appleController = controller
            controller.performRequests()
        }
    }
    public func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        bridge?.viewController?.view.window ?? ASPresentationAnchor()
    }
    public func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        defer { appleCall = nil; appleController = nil }
        guard let call = appleCall else { return }
        guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential,
              let token = credential.identityToken.flatMap({ String(data: $0, encoding: .utf8) }),
              let code = credential.authorizationCode.flatMap({ String(data: $0, encoding: .utf8) }) else { call.reject("Missing Apple credentials"); return }
        let name = credential.fullName.map { PersonNameComponentsFormatter.localizedString(from: $0, style: .default) } ?? ""
        call.resolve(["idToken": token, "authorizationCode": code, "name": name])
    }
    public func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        appleCall?.reject("Apple sign-in failed", nil, error)
        appleCall = nil
        appleController = nil
    }
}
