import SwiftUI

struct OnboardingView: View {
    @Environment(LocalStore.self) private var store
    @State private var step = 0
    @State private var languages: Set<String> = []
    @State private var gulfHome = false
    @State private var country: GccCountry = .BH
    @State private var name = "You"
    @State private var kidsMode = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 12) {
                Image("WhiscoPortrait")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 56, height: 56)
                    .accessibilityHidden(true)
                VStack(alignment: .leading, spacing: 2) {
                    WhiscoMark(size: 22)
                    Text("Free. Legal. For the Gulf.")
                        .font(.subheadline)
                        .foregroundStyle(WhiscoTheme.muted)
                }
            }
            .padding(.bottom, 24)

            Group {
                if step == 0 { stepLanguages }
                else if step == 1 { stepCountry }
                else { stepFace }
            }
            Spacer(minLength: 12)
            footer
        }
        .padding(20)
        .whiscoScreen()
    }

    private var stepLanguages: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("What should feel like home?").font(.largeTitle.bold())
            Text("For Bahrainis, Emiratis, Saudis, Kuwaitis, Qataris, Omanis — and everyone who lives here. This stays on this device.")
                .foregroundStyle(WhiscoTheme.muted)
            ForEach(Pack.all, id: \.id) { pack in
                let on = pack.langs.allSatisfy { languages.contains($0) }
                Button {
                    if on {
                        pack.langs.forEach { languages.remove($0) }
                        if pack.id == "gulf" { gulfHome = false }
                    } else {
                        pack.langs.forEach { languages.insert($0) }
                        if pack.id == "gulf" { gulfHome = true }
                    }
                } label: {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            HStack {
                                Text(pack.title).font(.headline).foregroundStyle(WhiscoTheme.fg)
                                if pack.id == "gulf" {
                                    Text("FROM HERE")
                                        .font(.caption2)
                                        .foregroundStyle(WhiscoTheme.muted)
                                        .tracking(1)
                                }
                            }
                            Text(pack.subtitle).font(.caption).foregroundStyle(WhiscoTheme.muted)
                        }
                        Spacer()
                        Circle()
                            .stroke(on ? WhiscoTheme.accent : WhiscoTheme.muted, lineWidth: 1.5)
                            .fill(on ? WhiscoTheme.accent : Color.clear)
                            .frame(width: 16, height: 16)
                    }
                    .padding(14)
                    .background(on ? WhiscoTheme.elevated : WhiscoTheme.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                            .stroke(on ? WhiscoTheme.accent.opacity(0.5) : Color.clear)
                    )
                }
                .buttonStyle(.plain)
            }
            Text("Fine-tune languages")
                .font(.caption2)
                .foregroundStyle(WhiscoTheme.subtle)
                .textCase(.uppercase)
                .tracking(1.2)
                .padding(.top, 8)
            FlowLayout(spacing: 8) {
                ForEach(Pack.languages, id: \.self) { lang in
                    Chip(label: lang, selected: languages.contains(lang)) {
                        if languages.contains(lang) { languages.remove(lang) } else { languages.insert(lang) }
                    }
                }
            }
        }
    }

    private var stepCountry: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Where are you watching from?").font(.largeTitle.bold())
            Text(gulfHome
                 ? "Tonight’s clock uses this city — Manama, Dubai, Riyadh. Not sent anywhere."
                 : "Used to label live channels. Home Time still follows the languages you picked.")
                .foregroundStyle(WhiscoTheme.muted)
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                ForEach(GccCountry.allCases) { c in
                    Button {
                        country = c
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(c.rawValue).font(.caption).foregroundStyle(WhiscoTheme.subtle)
                            Text(c.name).font(.headline).foregroundStyle(WhiscoTheme.fg)
                            Text(c.city).font(.caption).foregroundStyle(WhiscoTheme.muted)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(14)
                        .background(country == c ? WhiscoTheme.elevated : WhiscoTheme.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .stroke(country == c ? WhiscoTheme.accent.opacity(0.5) : Color.clear)
                        )
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private var stepFace: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Name this face").font(.largeTitle.bold())
            Text("Households here share a phone. Faces swap the language mosaic without an account.")
                .foregroundStyle(WhiscoTheme.muted)
            TextField("You", text: $name)
                .textFieldStyle(.plain)
                .padding()
                .background(WhiscoTheme.surface, in: RoundedRectangle(cornerRadius: 12))
            Button {
                kidsMode.toggle()
            } label: {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Kids face · \(kidsMode ? "On" : "Off")").font(.headline).foregroundStyle(WhiscoTheme.fg)
                    Text("Pins this mosaic to Kids live + cartoons. Shared phone, one tap.")
                        .font(.caption)
                        .foregroundStyle(WhiscoTheme.muted)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(14)
                .background(kidsMode ? WhiscoTheme.accent.opacity(0.12) : WhiscoTheme.surface, in: RoundedRectangle(cornerRadius: 16))
            }
            .buttonStyle(.plain)
            VStack(alignment: .leading, spacing: 6) {
                Text("No signup. Ever.")
                Text("One ad per screen, never on the picture.")
                Text("Only legal streams — FTA, official embeds, licensed.")
            }
            .font(.subheadline)
            .foregroundStyle(WhiscoTheme.muted)
            Text("Named after a real Shih Tzu. In this house he is Whisco when children are in the room. The rest of his name lives in a glass.")
                .font(.caption)
                .foregroundStyle(WhiscoTheme.subtle)
        }
    }

    @ViewBuilder private var footer: some View {
        VStack(spacing: 8) {
            if step == 0 {
                Button("Continue") { step = 1 }
                    .buttonStyle(WhiscoPrimary())
                    .disabled(languages.isEmpty)
                Button("Start with the Gulf") {
                    store.completeOnboarding(name: "You", languages: ["Arabic", "English"], country: .BH, clockSource: "gulf")
                }
                .foregroundStyle(WhiscoTheme.muted)
            } else if step == 1 {
                HStack {
                    Button("Back") { step = 0 }.buttonStyle(WhiscoGhost())
                    Button("Continue") { step = 2 }.buttonStyle(WhiscoPrimary())
                }
            } else {
                HStack {
                    Button("Back") { step = 1 }.buttonStyle(WhiscoGhost())
                    Button("Start watching") {
                        store.completeOnboarding(
                            name: name,
                            languages: Array(languages),
                            country: country,
                            clockSource: gulfHome ? "gulf" : "origin",
                            kidsMode: kidsMode
                        )
                    }
                    .buttonStyle(WhiscoPrimary())
                }
            }
        }
        .padding(.top, 8)
    }
}

struct WhiscoPrimary: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(WhiscoTheme.fg.opacity(configuration.isPressed ? 0.85 : 1), in: RoundedRectangle(cornerRadius: 14))
            .foregroundStyle(WhiscoTheme.bg)
    }
}

struct WhiscoGhost: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .foregroundStyle(WhiscoTheme.fg)
            .opacity(configuration.isPressed ? 0.7 : 1)
    }
}

struct FlowLayout: Layout {
    var spacing: CGFloat = 8
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
            if x + size.width > maxW { x = 0; y += rowH + spacing; rowH = 0 }
            origins.append(CGPoint(x: x, y: y))
            x += size.width + spacing
            rowH = max(rowH, size.height)
        }
        return (origins, CGSize(width: maxW, height: y + rowH))
    }
}
