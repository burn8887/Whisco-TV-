import Combine
import Foundation
import StoreKit

/// Everything Salim knows about the paid tier.
///
/// StoreKit 2 keeps entitlement on the device: no account, no server, and nothing about the
/// driver leaves the phone. A purchase is verified by the system, finished, and then the app
/// asks the device what it currently owns rather than trusting the value it just handled — so
/// a refund, a family change or a reinstall resolves to the truth on next launch.
@MainActor
final class Store: ObservableObject {
    static let monthly = "salim_premium_monthly"
    static let yearly = "salim_premium_yearly"
    static let productIDs: Set<String> = [monthly, yearly]

    /// Apple's standard EULA and the policy we publish. Both are required beside an
    /// auto-renewing subscription, and both are linked from the paywall.
    static let termsURL = URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!
    static let privacyURL = URL(string: "https://docs.google.com/document/d/1gv7tD1tYx3aMiLptPBw4nXSRWDwqexy_Tk_e6WcaSHY/view")!

    /// Benefits currently implemented in this build; every safety warning remains free.
    static let benefits = [
        "Trip history kept without limit. The free tier keeps the last 20 runs.",
        "No Overview or Settings ads. Ads never appear on the drive screen.",
        "Every camera and hazard warning, free, forever — nothing here is behind this paywall.",
    ]

    @Published private(set) var products: [Product] = []
    @Published private(set) var premium = false
    @Published private(set) var entitlementsLoaded = false
    @Published private(set) var loading = false
    @Published private(set) var message: String?

    init() {
        // Listens for purchases that complete outside this screen: Ask to Buy approvals,
        // renewals, refunds. The task lives as long as the app, which is the point.
        Task { [weak self] in
            for await result in Transaction.updates {
                await self?.apply(result)
            }
        }
        Task { await start() }
    }

    private func start() async {
        await load()
        await refreshEntitlement()
    }

    // MARK: - Catalogue

    func load() async {
        loading = true
        defer { loading = false }
        do {
            let fetched = try await Product.products(for: Self.productIDs)
            // Cheapest first, so the shorter commitment is never hidden below the longer one.
            products = fetched.sorted { $0.price < $1.price }
            if fetched.isEmpty {
                message = "Subscriptions are not available in this build yet."
            }
        } catch {
            products = []
            message = "The App Store could not be reached. Check your connection."
        }
    }

    /// The period Apple reports for this product, in words a driver reads in one glance.
    static func period(for product: Product) -> String {
        guard let span = product.subscription?.subscriptionPeriod else { return "" }
        return period(span)
    }

    private static func period(_ span: Product.SubscriptionPeriod) -> String {
        let unit: String
        switch span.unit {
        case .day: unit = "day"
        case .week: unit = "week"
        case .month: unit = "month"
        case .year: unit = "year"
        @unknown default: return ""
        }
        return span.value == 1 ? unit : "\(span.value) \(unit)s"
    }

    private static func period(_ span: Product.SubscriptionPeriod, count: Int) -> String {
        let amount = span.value * count
        let noun: String
        switch span.unit {
        case .day: noun = "day"
        case .week: noun = "week"
        case .month: noun = "month"
        case .year: noun = "year"
        @unknown default: return "trial period"
        }
        return amount == 1 ? "1 \(noun)" : "\(amount) \(noun)s"
    }

    static func offerSummary(for product: Product) -> String {
        guard let offer = product.subscription?.introductoryOffer,
              offer.paymentMode == .freeTrial else {
            return "\(product.displayPrice) per \(period(for: product))"
        }
        let freePeriod = period(offer.period, count: offer.periodCount)
        return "\(freePeriod) free, then \(product.displayPrice) per \(period(for: product))"
    }

    // MARK: - Entitlement

    func refreshEntitlement() async {
        var active = false
        for await result in Transaction.currentEntitlements {
            guard case .verified(let transaction) = result else { continue }
            if Self.productIDs.contains(transaction.productID), transaction.revocationDate == nil {
                active = true
            }
        }
        premium = active
        entitlementsLoaded = true
    }

    private func apply(_ result: VerificationResult<Transaction>) async {
        guard case .verified(let transaction) = result else { return }
        await transaction.finish()
        await refreshEntitlement()
    }

    // MARK: - Buying

    func purchase(_ product: Product) async {
        loading = true
        defer { loading = false }
        do {
            switch try await product.purchase() {
            case .success(let verification):
                await apply(verification)
                message = premium ? "Salim Premium is active." : "The store could not verify that purchase."
            case .pending:
                message = "Waiting for approval. Premium unlocks as soon as the store confirms it."
            case .userCancelled:
                message = nil
            @unknown default:
                message = nil
            }
        } catch {
            message = "The purchase did not complete. Nothing was charged."
        }
    }

    func restore() async {
        loading = true
        defer { loading = false }
        do {
            try await AppStore.sync()
            await refreshEntitlement()
            message = premium ? "Salim Premium restored." : "There is no purchase on this Apple ID to restore."
        } catch {
            message = "Could not reach the App Store. Check your connection."
        }
    }
}
