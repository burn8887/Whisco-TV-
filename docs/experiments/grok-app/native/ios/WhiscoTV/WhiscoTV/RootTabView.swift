import SwiftUI

struct RootTabView: View {
    var body: some View {
        TabView {
            Tab("Tonight", systemImage: "house") { HomeView() }
            Tab("Live", systemImage: "dot.radiowaves.left.and.right") { LiveView() }
            Tab("Library", systemImage: "rectangle.stack") { LibraryView() }
            Tab("You", systemImage: "person") { YouView() }
        }
        .tint(WhiscoTheme.accent)
        .whiscoScreen()
    }
}

struct OnboardingView: View {
    @Environment(LocalStore.self) private var store
    @State private var languages: Set<String> = ["Hindi", "English"]
    @State private var country: GccCountry = .BH
    @State private var name = "You"

    private let all = ["Hindi","Malayalam","Tamil","Telugu","Punjabi","Bengali","Urdu","Arabic","Filipino","English","Turkish"]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Whisco").font(.largeTitle.bold())
                .foregroundStyle(LinearGradient(colors: [WhiscoTheme.accent, WhiscoTheme.accent2], startPoint: .leading, endPoint: .trailing))
            Text("What feels like home?").font(.title2.bold())
            Text("Device-local. No account.").foregroundStyle(WhiscoTheme.muted)
            FlexibleLangs
            Picker("Country", selection: $country) {
                ForEach(GccCountry.allCases, id: \.self) { Text($0.name).tag($0) }
            }
            TextField("Face name", text: $name)
                .textFieldStyle(.roundedBorder)
            Button("Start watching") {
                store.completeOnboarding(name: name, languages: Array(languages), country: country)
            }
            .buttonStyle(.borderedProminent)
            .tint(WhiscoTheme.fg)
            .foregroundStyle(WhiscoTheme.bg)
        }
        .padding()
        .whiscoScreen()
    }

    private var FlexibleLangs: some View {
        FlowLayout {
            ForEach(all, id: \.self) { lang in
                let on = languages.contains(lang)
                Button(lang) {
                    if on { languages.remove(lang) } else { languages.insert(lang) }
                }
                .buttonStyle(.bordered)
                .tint(on ? WhiscoTheme.accent : WhiscoTheme.muted)
            }
        }
    }
}

/// Minimal wrap stack — iOS 17.
struct FlowLayout: Layout {
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        arrange(proposal: proposal, subviews: subviews).size
    }
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = arrange(proposal: proposal, subviews: subviews)
        for (i, p) in result.origins.enumerated() {
            subviews[i].place(at: CGPoint(x: bounds.minX + p.x, y: bounds.minY + p.y), proposal: .unspecified)
        }
    }
    private func arrange(proposal: ProposedViewSize, subviews: Subviews) -> (origins: [CGPoint], size: CGSize) {
        let maxW = proposal.width ?? 320
        var x: CGFloat = 0, y: CGFloat = 0, rowH: CGFloat = 0
        var origins: [CGPoint] = []
        for s in subviews {
            let size = s.sizeThatFits(.unspecified)
            if x + size.width > maxW { x = 0; y += rowH + 8; rowH = 0 }
            origins.append(CGPoint(x: x, y: y))
            x += size.width + 8
            rowH = max(rowH, size.height)
        }
        return (origins, CGSize(width: maxW, height: y + rowH))
    }
}
