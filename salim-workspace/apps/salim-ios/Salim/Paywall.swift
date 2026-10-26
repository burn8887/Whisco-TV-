import SwiftUI
import StoreKit

/// The one screen that asks for money, written to be boring.
///
/// It states the price, states what the money buys, and states — first, in the largest type on
/// the page — what it never buys. A driver deciding whether to pay should not have to work
/// out whether a safety warning depends on it.
struct Paywall: View {
    @EnvironmentObject var store: Store
    @Environment(\.dismiss) private var dismiss
    let theme: Theme

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                header
                promise
                plans
                benefits
                footer
            }
            .padding(22)
            .frame(maxWidth: 560, alignment: .leading)
        }
        .background(theme.ground.ignoresSafeArea())
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("SALIM PREMIUM")
                    .font(.system(size: 11, weight: .semibold, design: .monospaced))
                    .tracking(2.4)
                    .foregroundStyle(theme.accent)
                Spacer()
                Button { dismiss() } label: {
                    Text("CLOSE")
                        .font(.system(size: 11, weight: .semibold, design: .monospaced))
                        .tracking(1.6)
                        .foregroundStyle(theme.muted)
                }
                .buttonStyle(.plain)
            }
            Rectangle().fill(theme.line).frame(height: 1)
            Text(store.premium ? "Active on this Apple ID." : "An optional subscription.")
                .font(.system(size: 26, weight: .regular, design: .serif))
                .foregroundStyle(theme.ink)
        }
    }

    private var promise: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Every camera warning stays free.")
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(theme.ink)
            Text("Speed cameras, seatbelt cameras, red lights, roadworks and congestion alerts are never held back from a driver who has not subscribed. There is no version of this app that withholds a warning to sell you one.")
                .font(.system(size: 13))
                .foregroundStyle(theme.muted)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(theme.raised, in: RoundedRectangle(cornerRadius: 8))
        .overlay(RoundedRectangle(cornerRadius: 8).stroke(theme.line, lineWidth: 1))
    }

    @ViewBuilder
    private var plans: some View {
        if store.premium {
            Text("Salim Premium is active. Thank you.")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(theme.accent)
        } else if store.products.isEmpty {
            VStack(alignment: .leading, spacing: 6) {
                Text("Not available yet")
                    .font(.system(size: 11, weight: .semibold, design: .monospaced))
                    .tracking(1.8)
                    .foregroundStyle(theme.muted)
                Text("This build has no products configured, so nothing can be purchased. Subscribe from a build installed from the App Store.")
                    .font(.system(size: 13))
                    .foregroundStyle(theme.muted)
                    .fixedSize(horizontal: false, vertical: true)
            }
        } else {
            VStack(spacing: 10) {
                ForEach(store.products, id: \.id) { product in
                    Button { Task { await store.purchase(product) } } label: {
                        HStack(alignment: .center, spacing: 12) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(product.displayName)
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundStyle(theme.ink)
                                Text(Store.period(for: product))
                                    .font(.system(size: 11, weight: .regular, design: .monospaced))
                                    .tracking(0.8)
                                    .foregroundStyle(theme.muted)
                            }
                            Spacer()
                            Text(product.displayPrice)
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundStyle(theme.accent)
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 14)
                        .frame(maxWidth: .infinity)
                        .background(theme.raised, in: RoundedRectangle(cornerRadius: 8))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(theme.line, lineWidth: 1))
                    }
                    .buttonStyle(.plain)
                    .disabled(store.loading)
                }
            }
        }
    }

    private var benefits: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("WHAT IT INCLUDES")
                .font(.system(size: 10, weight: .semibold, design: .monospaced))
                .tracking(2)
                .foregroundStyle(theme.muted)
            ForEach(Store.benefits, id: \.self) { line in
                HStack(alignment: .top, spacing: 8) {
                    Rectangle().fill(theme.accent).frame(width: 2, height: 14).padding(.top, 3)
                    Text(line)
                        .font(.system(size: 13))
                        .foregroundStyle(theme.ink)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
    }

    private var footer: some View {
        VStack(alignment: .leading, spacing: 10) {
            if let message = store.message {
                Text(message)
                    .font(.system(size: 12))
                    .foregroundStyle(theme.muted)
                    .fixedSize(horizontal: false, vertical: true)
            }
            Button { Task { await store.restore() } } label: {
                Text("RESTORE PURCHASES")
                    .font(.system(size: 11, weight: .semibold, design: .monospaced))
                    .tracking(1.6)
                    .foregroundStyle(theme.ink)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(theme.line, lineWidth: 1))
            }
            .buttonStyle(.plain)
            .disabled(store.loading)

            Text("Payment is charged to your Apple ID at confirmation. The subscription renews automatically unless it is cancelled at least 24 hours before the period ends. Cancel any time in Settings → Apple ID → Subscriptions. Ending a subscription never removes a warning from the road.")
                .font(.system(size: 11))
                .foregroundStyle(theme.muted)
                .fixedSize(horizontal: false, vertical: true)

            HStack(spacing: 16) {
                Link("Terms of Use", destination: Store.termsURL)
                Link("Privacy Policy", destination: Store.privacyURL)
            }
            .font(.system(size: 11, weight: .semibold))
            .foregroundStyle(theme.accent)
        }
        .padding(.top, 4)
    }
}
