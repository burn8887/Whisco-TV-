import SwiftUI

struct HomeView: View {
    @Environment(LocalStore.self) private var store
    @State private var home: HomePayload?
    @State private var live: [Channel] = []
    @State private var vod: VodShelvesPayload?
    @State private var failed = false

    private var kids: Bool { store.activeFace.kidsMode == true }
    private var langs: [String] { store.activeFace.languages }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    header
                    if failed && home == nil {
                        EmptyState(title: "Couldn’t reach the catalog", detail: "Check the connection and pull to refresh.")
                    }
                    if let hero = home?.hero.first, !kids {
                        HeroCard(title: hero)
                    }
                    if !kids {
                        let s = Pack.sponsor(languages: langs, clockSource: store.activeFace.clockSource)
                        SponsorStrip(brand: s.brand, line: s.line)
                    }
                    if !store.resume.isEmpty {
                        section("Continue") {
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 10) {
                                    ForEach(store.resume.prefix(8)) { entry in
                                        ResumeCard(entry: entry)
                                    }
                                }
                            }
                        }
                    }
                    if !store.favoriteChannels.isEmpty {
                        section("Pinned live") {
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 10) {
                                    ForEach(store.favoriteChannels) { ch in
                                        NavigationLink(value: ch) { ChannelChip(channel: ch).frame(width: 240) }
                                    }
                                }
                            }
                        }
                    }
                    let pool = kids ? live.filter { $0.category == "Kids" } : live
                    section(kids ? "Kids live" : "Live mosaic · \(langs.prefix(3).joined(separator: " · "))") {
                        if pool.isEmpty {
                            Text(kids ? "No kids live in this language yet. Cartoons below." : "Tuning the mosaic…")
                                .font(.subheadline)
                                .foregroundStyle(WhiscoTheme.muted)
                        } else {
                            LazyVGrid(columns: [GridItem(.adaptive(minimum: 96), spacing: 10)], spacing: 12) {
                                ForEach(pool.prefix(12)) { MosaicCell(channel: $0) }
                            }
                        }
                    }
                    let news = kids ? [] : pool.filter { $0.category == "News" }.prefix(8)
                    if !news.isEmpty {
                        section("News now") {
                            VStack(spacing: 8) { ForEach(Array(news)) { ch in NavigationLink(value: ch) { ChannelChip(channel: ch) } } }
                        }
                    }
                    let sports = kids ? [] : pool.filter { $0.category == "Sports" }.prefix(8)
                    if !sports.isEmpty {
                        section("Sports · legal FTA only") {
                            VStack(spacing: 8) { ForEach(Array(sports)) { ch in NavigationLink(value: ch) { ChannelChip(channel: ch) } } }
                        }
                    }
                    let shelves = (vod?.shelves ?? []).filter { shelf in
                        if kids { return Pack.isKidsShelf(shelf.name) }
                        return langs.contains(Pack.collectionLanguage[shelf.name] ?? "")
                    }
                    if !shelves.isEmpty {
                        section(kids ? "Cartoons" : "Serials and cinema for your languages") {
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 10) {
                                    ForEach(shelves.flatMap(\.items).prefix(16)) { PosterView(title: $0) }
                                }
                            }
                        }
                    }
                    if !kids {
                        AdCard(
                            kicker: "Ad · 1 of 1 on this screen",
                            title: "Send home in minutes",
                            bodyText: "Illustrative remittance sponsor. Real ads stay this quiet."
                        )
                        ForEach(shelves.prefix(4)) { shelf in
                            section(shelf.name) {
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 10) { ForEach(shelf.items) { PosterView(title: $0) } }
                                }
                            }
                        }
                    }
                    if let stats = home?.stats {
                        Text("\(stats.channels ?? 0) live channels · \((stats.titles ?? 0).formatted()) titles · legal sources only")
                            .font(.caption)
                            .foregroundStyle(WhiscoTheme.subtle)
                            .frame(maxWidth: .infinity)
                    }
                }
                .padding()
            }
            .navigationTitle("Tonight")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { WhiscoMark(size: 18) }
                ToolbarItem(placement: .topBarTrailing) {
                    NavigationLink { SearchView() } label: {
                        Image(systemName: "magnifyingglass").foregroundStyle(WhiscoTheme.fg)
                    }
                    .accessibilityLabel("Search")
                }
            }
            .navigationDestination(for: CatalogTitle.self) { TitleDetailView(slug: $0.slug) }
            .navigationDestination(for: Channel.self) { WatchView(channel: $0) }
            .navigationDestination(for: ResumeEntry.self) { ResumeDestination(entry: $0) }
            .refreshable { await load() }
            .task { await load() }
        }
        .whiscoScreen()
    }

    private var header: some View {
        TimelineView(.periodic(from: .now, by: 15)) { context in
            let pair = HomeTime.pair(language: langs.first ?? "English", country: store.country, clockSource: store.activeFace.clockSource)
            VStack(alignment: .leading, spacing: 4) {
                Text("\(HomeTime.greeting(tz: pair.tz, now: context.date)), \(store.activeFace.name)\(kids ? " · kids" : "")")
                    .foregroundStyle(WhiscoTheme.muted)
                Text("Tonight in \(pair.city)")
                    .font(.largeTitle.bold())
                Text("\(HomeTime.format(tz: pair.tz, now: context.date)) at home · watching from \(store.country.name)")
                    .font(.subheadline)
                    .foregroundStyle(WhiscoTheme.muted)
                    .monospacedDigit()
            }
        }
    }

    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title).font(.title3.bold())
            content()
        }
    }

    private func load() async {
        failed = false
        do {
            async let h = APIClient.shared.home()
            async let v = APIClient.shared.vod()
            let lang = langs.first ?? "Arabic"
            async let l = APIClient.shared.liveAll(language: lang)
            home = try await h
            vod = try await v
            live = try await l
        } catch {
            failed = true
        }
    }
}

struct ResumeCard: View {
    let entry: ResumeEntry
    var body: some View {
        NavigationLink(value: entry) {
            VStack(alignment: .leading, spacing: 6) {
                ZStack(alignment: .bottomLeading) {
                    AsyncImage(url: URL(string: entry.posterUrl ?? "")) { phase in
                        if case .success(let img) = phase { img.resizable().scaledToFill() } else { WhiscoTheme.elevated }
                    }
                    .frame(width: 168, height: 94)
                    .clipped()
                    LinearGradient(colors: [.clear, WhiscoTheme.bg.opacity(0.9)], startPoint: .center, endPoint: .bottom)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(entry.kind == "live" ? "LIVE" : "Resume")
                            .font(.caption2.bold())
                            .foregroundStyle(entry.kind == "live" ? WhiscoTheme.live : WhiscoTheme.muted)
                        Text(entry.name).font(.caption.weight(.medium)).lineLimit(2).foregroundStyle(WhiscoTheme.fg)
                    }
                    .padding(8)
                }
                .frame(width: 168, height: 94)
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Continue \(entry.name)")
    }
}

struct ResumeDestination: View {
    let entry: ResumeEntry
    @State private var channel: Channel?
    @State private var failed = false

    var body: some View {
        Group {
            if entry.kind == "live" {
                if let channel {
                    WatchView(channel: channel)
                } else if failed {
                    EmptyState(title: "Channel unavailable", detail: "It may have gone off-air.")
                } else {
                    ProgressView().tint(WhiscoTheme.fg)
                }
            } else if let slug = entry.slug, !slug.isEmpty {
                TitleDetailView(slug: slug)
            } else {
                EmptyState(title: "Nothing to resume", detail: "Pick something from Tonight.")
            }
        }
        .task {
            guard entry.kind == "live" else { return }
            do { channel = try await APIClient.shared.channel(id: entry.id) }
            catch { failed = true }
        }
    }
}
