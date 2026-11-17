import UIKit
import WebKit
import Capacitor
import StoreKit
import AuthenticationServices
import CryptoKit
#if MIRU_ADS
import UserMessagingPlatform
#endif

final class MIRUBridgeViewController: CAPBridgeViewController {
    // Capacitor creates its asset handler inside a final loadView(); upgrade that instance in place so
    // story media missing from the bundle is fetched on demand (see MIRUAssetHandler below).
    override func webView(with frame: CGRect, configuration: WKWebViewConfiguration) -> WKWebView {
        if let handler = configuration.urlSchemeHandler(forURLScheme: "capacitor") as AnyObject?,
           type(of: handler) == WebViewAssetHandler.self {
            object_setClass(handler, MIRUAssetHandler.self)
        }
        return super.webView(with: frame, configuration: configuration)
    }
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(MIRUNative())
        #if DEBUG
        if ProcessInfo.processInfo.arguments.contains("--miru-smoke") {
            DispatchQueue.main.asyncAfter(deadline: .now() + 6) { [weak self] in
                let script = """
                const config = await window.MIRU_NATIVE.configuration();
                const man = await (await fetch('/ios-remote.json')).json(), keys = Object.keys(man.files);
                const enc = p => '/' + p.split('/').map(encodeURIComponent).join('/');
                const pick = re => keys.find(k => re.test(k) && man.files[k][0] < 300000);
                const get = async (p, h) => { const r = await fetch(enc(p), {headers: h || {}}); return [r.status, (await r.arrayBuffer()).byteLength, man.files[p][0]]; };
                const img = pick(/[.](png|jpg|webp)$/), mp3 = pick(/[.]mp3$/), mp4 = keys.find(k => /[.]mp4$/.test(k)), uni = pick(/[^ -~].*[.](png|jpg)$/);
                const el = await new Promise(r => { const i = new Image(); i.onload = () => r(i.naturalWidth); i.onerror = () => r(-1); i.src = enc(uni); });
                const remote = {count: keys.length, img: await get(img), mp3: await get(mp3), range: await get(mp4, {Range: 'bytes=0-99'}), unicodeImgWidth: el, cachedAgain: await get(img), missing: (await fetch('/art/official/__nope__.png').catch(() => ({status: 'err'}))).status, game: (await fetch('/scripts/north-light-v1/games.html')).status};
                return JSON.stringify({config, remote, app:!!window.__miruIOS, consent:!!window.MIRU_AI, body:document.body.innerText.includes('MIRU'), state:document.readyState});
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

// MARK: - On-demand story media
// The bundle ships the app shell, data and covers. Chapter art, voice and video are listed in
// public/ios-remote.json (path -> [size, sha256]) and live on https://miru.plus/ios-assets/<version>/.
// Only listed media paths are fetched; no script or HTML is ever loaded remotely. Downloads are
// verified (size + SHA-256) and kept in Caches so they work offline afterwards.
final class MIRURemoteAssets {
    static let shared = MIRURemoteAssets()
    let version: String
    let base: URL?
    let files: [String: (size: Int, sha: String)]
    let cacheDir: URL
    let session: URLSession
    private var waiting: [String: [(Result<URL, Error>) -> Void]] = [:] // main thread only

    private init() {
        var version = "none", base: URL?, files: [String: (Int, String)] = [:]
        if let url = Bundle.main.url(forResource: "ios-remote", withExtension: "json", subdirectory: "public"),
           let data = try? Data(contentsOf: url),
           let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
            version = json["version"] as? String ?? version
            if let s = json["base"] as? String, let u = URL(string: s), u.scheme == "https" { base = u }
            for (k, v) in json["files"] as? [String: [Any]] ?? [:] {
                if v.count == 2, let size = v[0] as? Int, let sha = v[1] as? String { files[k] = (size, sha) }
            }
        }
        self.version = version
        self.base = base
        self.files = files
        let caches = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
        cacheDir = caches.appendingPathComponent("miru-remote", isDirectory: true).appendingPathComponent(version, isDirectory: true)
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.timeoutIntervalForResource = 300
        config.httpMaximumConnectionsPerHost = 6
        config.urlCache = nil
        session = URLSession(configuration: config)
    }

    /// Removes caches that belong to earlier builds.
    static func purgeOldVersions() {
        DispatchQueue.global(qos: .utility).async {
            let me = MIRURemoteAssets.shared
            let root = me.cacheDir.deletingLastPathComponent()
            for item in (try? FileManager.default.contentsOfDirectory(at: root, includingPropertiesForKeys: nil)) ?? [] where item.lastPathComponent != me.version {
                try? FileManager.default.removeItem(at: item)
            }
        }
    }

    func remoteURL(_ path: String) -> URL? { base.map { $0.appendingPathComponent(path) } }
    func localURL(_ path: String) -> URL { cacheDir.appendingPathComponent(path) }

    func cached(_ path: String) -> URL? {
        guard let entry = files[path] else { return nil }
        let url = localURL(path)
        let size = (try? url.resourceValues(forKeys: [.fileSizeKey]))?.fileSize
        return size == entry.size ? url : nil
    }

    /// Downloads the whole file once (concurrent requests share one download). Completion runs on main.
    func fetch(_ path: String, _ done: @escaping (Result<URL, Error>) -> Void) {
        dispatchPrecondition(condition: .onQueue(.main))
        if let url = cached(path) { done(.success(url)); return }
        guard let entry = files[path], let remote = remoteURL(path) else { done(.failure(URLError(.fileDoesNotExist))); return }
        if waiting[path] != nil { waiting[path]!.append(done); return }
        waiting[path] = [done]
        let target = localURL(path)
        session.downloadTask(with: remote) { [weak self] tmp, response, error in
            var result: Result<URL, Error>
            do {
                guard let tmp = tmp, error == nil, (response as? HTTPURLResponse)?.statusCode == 200 else { throw error ?? URLError(.badServerResponse) }
                let data = try Data(contentsOf: tmp, options: .mappedIfSafe)
                let digest = SHA256.hash(data: data).map { String(format: "%02x", $0) }.joined()
                guard data.count == entry.size, digest == entry.sha else { throw URLError(.cannotDecodeContentData) }
                try FileManager.default.createDirectory(at: target.deletingLastPathComponent(), withIntermediateDirectories: true)
                try? FileManager.default.removeItem(at: target)
                try FileManager.default.moveItem(at: tmp, to: target)
                result = .success(target)
            } catch { result = .failure(error) }
            DispatchQueue.main.async {
                let list = self?.waiting.removeValue(forKey: path) ?? []
                list.forEach { $0(result) }
            }
        }.resume()
    }
}

final class MIRUAssetHandler: WebViewAssetHandler {
    // Tasks WebKit has not cancelled yet. Never respond to a stopped task (WebKit raises an exception).
    private static var live = Set<ObjectIdentifier>()

    override func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        let assets = MIRURemoteAssets.shared
        guard let url = urlSchemeTask.request.url, url.path.count > 1 else { super.webView(webView, start: urlSchemeTask); return }
        let path = String(url.path.dropFirst())
        let bundled = Bundle.main.resourceURL?.appendingPathComponent("public").appendingPathComponent(path)
        guard let entry = assets.files[path], !(bundled.map { FileManager.default.fileExists(atPath: $0.path) } ?? false) else {
            super.webView(webView, start: urlSchemeTask); return
        }
        let id = ObjectIdentifier(urlSchemeTask)
        Self.live.insert(id)
        if let file = assets.cached(path) { serve(file, urlSchemeTask, url); return }
        let range = urlSchemeTask.request.value(forHTTPHeaderField: "Range")
        if range != nil, isMediaExtension(pathExtension: url.pathExtension), let remote = assets.remoteURL(path) {
            // Stream: forward the byte range now and cache the full file in the background.
            assets.fetch(path) { _ in }
            var request = URLRequest(url: remote)
            request.setValue(range, forHTTPHeaderField: "Range")
            assets.session.dataTask(with: request) { data, response, error in
                DispatchQueue.main.async {
                    guard Self.live.contains(id) else { return }
                    guard let data = data, error == nil, let http = response as? HTTPURLResponse, http.statusCode == 206 || http.statusCode == 200 else {
                        self.fail(urlSchemeTask, error ?? URLError(.badServerResponse)); return
                    }
                    var headers = ["Content-Type": self.mimeTypeForExtension(pathExtension: url.pathExtension), "Accept-Ranges": "bytes", "Content-Length": String(data.count)]
                    if http.statusCode == 206 {
                        guard let cr = http.value(forHTTPHeaderField: "Content-Range"), cr.hasSuffix("/\(entry.size)") else { self.fail(urlSchemeTask, URLError(.cannotDecodeContentData)); return }
                        headers["Content-Range"] = cr
                    } else if data.count != entry.size { self.fail(urlSchemeTask, URLError(.cannotDecodeContentData)); return }
                    self.respond(urlSchemeTask, url, http.statusCode, headers, data)
                }
            }.resume()
            return
        }
        assets.fetch(path) { result in
            guard Self.live.contains(id) else { return }
            switch result {
            case .success(let file): self.serve(file, urlSchemeTask, url)
            case .failure(let error): self.fail(urlSchemeTask, error)
            }
        }
    }

    override func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {
        Self.live.remove(ObjectIdentifier(urlSchemeTask))
        super.webView(webView, stop: urlSchemeTask)
    }

    private func serve(_ file: URL, _ task: WKURLSchemeTask, _ url: URL) {
        do {
            let mime = mimeTypeForExtension(pathExtension: url.pathExtension)
            let total = try file.resourceValues(forKeys: [.fileSizeKey]).fileSize ?? 0
            if let range = task.request.value(forHTTPHeaderField: "Range"), total > 0,
               let spec = range.components(separatedBy: "=").last?.components(separatedBy: "-") {
                let from = min(Int(spec[0]) ?? 0, total - 1)
                var to = total - 1
                if spec.count > 1, let end = Int(spec[1]) { to = min(end, total - 1) }
                let handle = try FileHandle(forReadingFrom: file)
                defer { try? handle.close() }
                try handle.seek(toOffset: UInt64(from))
                let data = handle.readData(ofLength: max(0, to - from + 1))
                respond(task, url, 206, ["Content-Type": mime, "Accept-Ranges": "bytes", "Content-Length": String(data.count), "Content-Range": "bytes \(from)-\(to)/\(total)"], data)
            } else {
                let data = try Data(contentsOf: file, options: .mappedIfSafe)
                respond(task, url, 200, ["Content-Type": mime, "Accept-Ranges": "bytes", "Content-Length": String(data.count), "Cache-Control": "no-cache"], data)
            }
        } catch { fail(task, error) }
    }

    private func respond(_ task: WKURLSchemeTask, _ url: URL, _ status: Int, _ headers: [String: String], _ data: Data) {
        let id = ObjectIdentifier(task)
        guard Self.live.remove(id) != nil, let response = HTTPURLResponse(url: url, statusCode: status, httpVersion: "HTTP/1.1", headerFields: headers) else { return }
        task.didReceive(response)
        task.didReceive(data)
        task.didFinish()
    }

    private func fail(_ task: WKURLSchemeTask, _ error: Error) {
        guard Self.live.remove(ObjectIdentifier(task)) != nil else { return }
        NSLog("MIRU_REMOTE_FAIL %@ %@", task.request.url?.path ?? "", String(describing: error))
        task.didFailWithError(error)
    }
}
