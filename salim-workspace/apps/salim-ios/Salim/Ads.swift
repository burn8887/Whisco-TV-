import Combine
import Foundation
import GoogleMobileAds
import SwiftUI
import UIKit
import UserMessagingPlatform

/// Requests consent at launch and never starts the ad SDK until UMP permits ad requests.
@MainActor
final class SalimAdConsent: ObservableObject {
    static let shared = SalimAdConsent()
    static var isEnabled: Bool {
        let configured = Bundle.main.object(forInfoDictionaryKey: "SalimAdsEnabled")
        return (configured as? Bool) == true || (configured as? String)?.uppercased() == "YES"
    }
    @Published private(set) var canRequestAds = false
    @Published private(set) var privacyOptionsRequired = false
    private var requestInFlight = false
    private var adsStarted = false

    func refresh() {
        guard Self.isEnabled, !requestInFlight else { return }
        requestInFlight = true
        let information = ConsentInformation.shared
        information.requestConsentInfoUpdate(with: RequestParameters()) { [weak self] requestError in
            Task { @MainActor in
                guard let self else { return }
                if requestError == nil, let presenter = Self.rootViewController() {
                    do {
                        try await ConsentForm.loadAndPresentIfRequired(from: presenter)
                    } catch {
                        // Fail closed for new ad requests; UMP retains previously valid consent.
                    }
                }
                self.requestInFlight = false
                self.refreshStatus(information)
            }
        }
    }

    func showPrivacyOptions() {
        Task { @MainActor in
            guard let presenter = Self.rootViewController() else { return }
            do {
                try await ConsentForm.presentPrivacyOptionsForm(from: presenter)
            } catch {
                // The setting remains available; a transient UMP display error must not crash Settings.
            }
            refreshStatus(ConsentInformation.shared)
        }
    }

    private func refreshStatus(_ information: ConsentInformation) {
        canRequestAds = information.canRequestAds
        privacyOptionsRequired = information.privacyOptionsRequirementStatus == .required
        guard canRequestAds, !adsStarted else { return }
        adsStarted = true
        MobileAds.shared.start()
    }

    private static func rootViewController() -> UIViewController? {
        UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap(\.windows)
            .first(where: \.isKeyWindow)?.rootViewController
    }
}

struct SalimAdBanner: UIViewRepresentable {
    private var adUnitID: String {
        Bundle.main.object(forInfoDictionaryKey: "SalimAdMobBannerID") as? String ?? ""
    }

    func makeUIView(context: Context) -> BannerView {
        let banner = BannerView(adSize: AdSizeBanner)
        guard SalimAdConsent.isEnabled else { return banner }
        banner.adUnitID = adUnitID
        banner.rootViewController = Self.rootViewController()
        if !adUnitID.isEmpty { banner.load(Request()) }
        return banner
    }

    func updateUIView(_ banner: BannerView, context: Context) {
        banner.rootViewController = Self.rootViewController()
    }

    private static func rootViewController() -> UIViewController? {
        UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap(\.windows)
            .first(where: \.isKeyWindow)?.rootViewController
    }
}
