import SwiftUI

enum WhiscoTheme {
    static let bg = Color(red: 0.039, green: 0.039, blue: 0.059)
    static let surface = Color(red: 0.071, green: 0.071, blue: 0.102)
    static let elevated = Color(red: 0.102, green: 0.102, blue: 0.141)
    static let fg = Color(red: 0.957, green: 0.941, blue: 0.918)
    static let muted = Color(red: 0.604, green: 0.580, blue: 0.549)
    static let subtle = Color(red: 0.420, green: 0.400, blue: 0.373)
    static let accent = Color(red: 0.976, green: 0.451, blue: 0.086)
    static let accent2 = Color(red: 0.859, green: 0.153, blue: 0.467)
    static let live = Color(red: 0.984, green: 0.443, blue: 0.522)

    static var wordmark: LinearGradient {
        LinearGradient(colors: [accent, accent2], startPoint: .leading, endPoint: .trailing)
    }
}

extension View {
    func whiscoScreen() -> some View {
        self.background(WhiscoTheme.bg.ignoresSafeArea())
            .foregroundStyle(WhiscoTheme.fg)
            .toolbarBackground(WhiscoTheme.bg, for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
    }

    func whiscoCard() -> some View {
        self.background(WhiscoTheme.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}

struct WhiscoMark: View {
    var size: CGFloat = 28
    var body: some View {
        Text("Whisco")
            .font(.system(size: size, weight: .semibold, design: .rounded))
            .foregroundStyle(WhiscoTheme.wordmark)
            .accessibilityAddTraits(.isHeader)
    }
}

struct AdCard: View {
    var kicker: String
    var title: String
    var bodyText: String
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(kicker)
                .font(.caption2.weight(.medium))
                .foregroundStyle(WhiscoTheme.subtle)
                .textCase(.uppercase)
                .tracking(1.2)
            Text(title).font(.headline)
            Text(bodyText).font(.subheadline).foregroundStyle(WhiscoTheme.muted)
            Capsule().fill(WhiscoTheme.wordmark).frame(width: 88, height: 4).padding(.top, 6)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(WhiscoTheme.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .accessibilityLabel("Advertisement. \(title)")
    }
}

struct SponsorStrip: View {
    var brand: String
    var line: String
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("Presented by \(brand)")
                    .font(.caption2.weight(.medium))
                    .foregroundStyle(WhiscoTheme.subtle)
                    .textCase(.uppercase)
                    .tracking(1.1)
                Text(line).font(.subheadline)
            }
            Spacer()
            Text("Sponsor")
                .font(.caption2)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .overlay(Capsule().stroke(WhiscoTheme.muted.opacity(0.3)))
                .foregroundStyle(WhiscoTheme.muted)
        }
        .padding(16)
        .whiscoCard()
    }
}
