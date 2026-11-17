import UIKit
import Capacitor
import GoogleSignIn
#if MIRU_ADS
import GoogleMobileAds
import UserMessagingPlatform
#endif

extension MIRUNative {
    @objc func signInWithGoogle(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let vc = self.bridge?.viewController,
                  let id = Bundle.main.object(forInfoDictionaryKey: "GIDClientID") as? String, !id.isEmpty, !id.contains("$(") else { call.reject("Google sign-in is not configured"); return }
            GIDSignIn.sharedInstance.signIn(withPresenting: vc) { result, error in
                guard let user = result?.user, let token = user.idToken?.tokenString else { call.reject("Google sign-in failed", nil, error); return }
                call.resolve(["idToken": token])
            }
        }
    }
    #if MIRU_ADS
    @objc func showRewardedAd(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard self.adCoordinator == nil, let vc = self.bridge?.viewController else { call.reject("An ad is already in progress or no view is available"); return }
            let coordinator = MIRUAdCoordinator(call: call, vc: vc) { [weak self] in self?.adCoordinator = nil }
            self.adCoordinator = coordinator
            coordinator.start()
        }
    }
    @objc func privacyOptions(_ call: CAPPluginCall) {
        Task { @MainActor in
            do { try await ConsentForm.presentPrivacyOptionsForm(from: self.bridge?.viewController); call.resolve() }
            catch { call.reject("Privacy options unavailable", nil, error) }
        }
    }
    #else
    @objc func showRewardedAd(_ call: CAPPluginCall) { call.resolve(["rewarded": false]) }
    @objc func privacyOptions(_ call: CAPPluginCall) { call.resolve() }
    #endif
}
#if MIRU_ADS
final class MIRUAdCoordinator: NSObject, FullScreenContentDelegate {
    private let call: CAPPluginCall
    private weak var vc: UIViewController?
    private var ad: RewardedAd?
    private var earned = false
    private let done: () -> Void
    private var completed = false
    init(call: CAPPluginCall, vc: UIViewController, done: @escaping () -> Void) { self.call = call; self.vc = vc; self.done = done }
    static func updateConsent() { ConsentInformation.shared.requestConsentInfoUpdate(with: RequestParameters()) { _ in } }
    func start() {
        Task { @MainActor in
            do {
                try await ConsentInformation.shared.requestConsentInfoUpdate(with: RequestParameters())
                try await ConsentForm.loadAndPresentIfRequired(from: vc)
                guard ConsentInformation.shared.canRequestAds else { fail("Ad consent unavailable"); return }
                guard let vc = vc else { fail("View unavailable"); return }
                #if DEBUG
                let unit = "ca-app-pub-3940256099942544/1712485313"
                #else
                guard let unit = Bundle.main.object(forInfoDictionaryKey: "MIRURewardedAdUnitID") as? String, unit.hasPrefix("ca-app-pub-"), !unit.contains("3940256099942544"), !unit.contains("$(") else { fail("Rewarded ads are not configured"); return }
                #endif
                await MobileAds.shared.start()
                let loaded = try await RewardedAd.load(with: unit, request: Request())
                ad = loaded
                loaded.fullScreenContentDelegate = self
                loaded.present(from: vc) { [weak self] in self?.earned = true }
            } catch { fail("Could not show rewarded ad", error) }
        }
    }
    private func finish(_ rewarded: Bool) { guard !completed else { return }; completed = true; call.resolve(["rewarded": rewarded]); ad = nil; done() }
    private func fail(_ message: String, _ error: Error? = nil) { guard !completed else { return }; completed = true; call.reject(message, nil, error); ad = nil; done() }
    func adDidDismissFullScreenContent(_ ad: FullScreenPresentingAd) { finish(earned) }
    func ad(_ ad: FullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) { fail("Ad presentation failed", error) }
}
#endif
