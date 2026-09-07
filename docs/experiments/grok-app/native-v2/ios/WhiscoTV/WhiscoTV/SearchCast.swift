import SwiftUI

struct SearchView: View {
    @Environment(LocalStore.self) private var store
    @State private var q = ""
    @State private var titles: [CatalogTitle] = []
    @State private var channels: [Channel] = []
    @State private var busy = false
    private let suggestions = ["Ezel", "Asianet", "natok", "Geo News", "Bahrain TV", "ABS-CBN", "Kuruluş Osman"]

    var body: some View {
        List {
            Section {
                TextField("Channels, serials, films — try Ezel, Asianet, natok", text: $q)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .onChange(of: q) { _, new in
                        Task { await debounce(new) }
                    }
            }
            if q.trimmingCharacters(in: .whitespaces).count < 2 {
                if !store.recentSearches.isEmpty {
                    Section("Recent") {
                        ForEach(store.recentSearches, id: \.self) { s in
                            Button(s) { q = s; Task { await run() } }
                        }
                    }
                }
                Section("Try") {
                    ForEach(suggestions, id: \.self) { s in
                        Button(s) { q = s; Task { await run() } }
                    }
                }
            }
            if busy { ProgressView("Looking…") }
            if !channels.isEmpty {
                Section("Live") {
                    ForEach(channels.prefix(8)) { ch in
                        NavigationLink(value: ch) { ChannelChip(channel: ch) }
                    }
                }
            }
            if !titles.isEmpty {
                Section("On demand") {
                    ForEach(titles) { t in
                        NavigationLink(value: t) { Text(t.name) }
                    }
                }
            }
            if q.count >= 2, !busy, titles.isEmpty, channels.isEmpty {
                Text("Nothing for “\(q)”.")
                    .foregroundStyle(WhiscoTheme.muted)
            }
        }
        .scrollContentBackground(.hidden)
        .navigationTitle("Search")
        .navigationDestination(for: Channel.self) { WatchView(channel: $0) }
        .navigationDestination(for: CatalogTitle.self) { TitleDetailView(slug: $0.slug) }
        .whiscoScreen()
    }

    private func debounce(_ value: String) async {
        try? await Task.sleep(nanoseconds: 280_000_000)
        guard value == q else { return }
        await run()
    }

    private func run() async {
        let value = q.trimmingCharacters(in: .whitespaces)
        guard value.count >= 2 else {
            titles = []; channels = []; return
        }
        store.pushSearch(value)
        busy = true
        defer { busy = false }
        async let v = APIClient.shared.searchVod(value)
        async let l = APIClient.shared.live(q: value)
        titles = (try? await v)?.items ?? []
        channels = (try? await l)?.channels ?? []
    }
}

struct CastView: View {
    @Environment(LocalStore.self) private var store
    @State private var started = false
    private let code: String = {
        let a = ["whisco", "bahrain", "kochi", "manila", "karachi", "dhaka"].randomElement()!
        let b = ["dizi", "natok", "surya", "osman", "gulffree"].randomElement()!
        return "\(a)-\(b)"
    }()

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("The legal Jadoo").font(.largeTitle.bold())
            Text("Pirate boxes won because the phone was a remote and the TV was a screen. We copy that ritual — not the stolen signal. AirPlay on the player, and a room code for any cheap Android stick.")
                .foregroundStyle(WhiscoTheme.muted)
            RoundedRectangle(cornerRadius: 24)
                .fill(Color.black)
                .frame(height: 220)
                .overlay {
                    VStack(spacing: 10) {
                        Image("WhiscoSit").resizable().scaledToFit().frame(width: 72, height: 72)
                        if started {
                            Text(code).font(.title.bold().monospaced()).foregroundStyle(WhiscoTheme.fg)
                            Text("Enter on the TV app · 8 min left").font(.caption).foregroundStyle(WhiscoTheme.muted)
                        } else {
                            Text("TV is waiting").foregroundStyle(WhiscoTheme.muted)
                        }
                    }
                }
            Text("Playing as \(store.activeFace.name) · \(store.activeFace.languages.joined(separator: " · "))")
                .foregroundStyle(WhiscoTheme.muted)
            HStack(spacing: 12) {
                AirPlayButton().frame(width: 44, height: 44)
                Text("AirPlay · this phone is the remote")
                    .font(.subheadline)
                    .foregroundStyle(WhiscoTheme.muted)
            }
            .padding(12)
            .whiscoCard()
            Button(started ? "Code refreshed on the TV" : "Start a TV session") { started = true }
                .buttonStyle(WhiscoPrimary())
            Text("Streams stay legal FTA and official embeds. Never a scraped YouTube URL.")
                .font(.footnote)
                .foregroundStyle(WhiscoTheme.subtle)
            Spacer()
        }
        .padding()
        .whiscoScreen()
        .navigationTitle("TV")
    }
}
