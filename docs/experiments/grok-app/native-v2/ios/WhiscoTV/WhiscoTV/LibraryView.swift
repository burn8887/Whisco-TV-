import SwiftUI

struct LibraryView: View {
    @Environment(LocalStore.self) private var store
    @State private var vod: VodShelvesPayload?

    private var kids: Bool { store.activeFace.kidsMode == true }
    private var langs: [String] { store.activeFace.languages }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 22) {
                    Text(kids ? "Kids face · cartoons only" : "\(vod?.total ?? 0) titles · language first, genre second")
                        .font(.subheadline)
                        .foregroundStyle(WhiscoTheme.muted)
                    if !kids {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack {
                                ForEach(hubs, id: \.self) { lang in
                                    NavigationLink(value: HubRoute(lang: lang)) {
                                        Text(lang)
                                            .font(.subheadline)
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 8)
                                            .background(langs.contains(lang) ? WhiscoTheme.accent.opacity(0.15) : Color.clear, in: Capsule())
                                            .overlay(Capsule().stroke(langs.contains(lang) ? WhiscoTheme.accent.opacity(0.5) : WhiscoTheme.muted.opacity(0.25)))
                                            .foregroundStyle(WhiscoTheme.fg)
                                    }
                                }
                            }
                        }
                    }
                    let mine = (vod?.shelves ?? []).filter { shelf in
                        if kids { return Pack.isKidsShelf(shelf.name) }
                        return langs.contains(languageOf(shelf.name) ?? "")
                    }
                    ForEach(mine) { shelf in
                        VStack(alignment: .leading, spacing: 10) {
                            Text(shelf.name).font(.title3.bold())
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 10) { ForEach(shelf.items) { PosterView(title: $0) } }
                            }
                        }
                    }
                    if kids && mine.isEmpty {
                        EmptyState(title: "No cartoon shelf", detail: "Turn kids mode off on You if you want the full library.")
                    }
                    if !kids {
                        AdCard(kicker: "Ad · 1 of 1 on this screen", title: "Friday flights, Saturday serials", bodyText: "Airline inventory belongs at the end of a browse, not on the picture.")
                        Text("Also on Whisco").font(.title3.bold()).padding(.top, 8)
                        ForEach((vod?.shelves ?? []).filter { shelf in !mine.contains(shelf) && !Pack.isKidsShelf(shelf.name) }) { shelf in
                            VStack(alignment: .leading, spacing: 10) {
                                Text(shelf.name).font(.headline)
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 10) { ForEach(shelf.items) { PosterView(title: $0) } }
                                }
                            }
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Library")
            .navigationDestination(for: CatalogTitle.self) { TitleDetailView(slug: $0.slug) }
            .navigationDestination(for: HubRoute.self) { HubView(lang: $0.lang) }
            .task { vod = try? await APIClient.shared.vod() }
        }
        .whiscoScreen()
    }

    private var hubs: [String] {
        Array(Set((vod?.shelves ?? []).compactMap { languageOf($0.name) })).sorted()
    }

    private func languageOf(_ shelf: String) -> String? {
        Pack.collectionLanguage[shelf]
    }
}

struct HubRoute: Hashable {
    let lang: String
}

struct HubView: View {
    let lang: String
    @Environment(LocalStore.self) private var store
    @State private var live: [Channel] = []
    @State private var vod: VodShelvesPayload?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                TimelineView(.periodic(from: .now, by: 15)) { context in
                    Text(HomeTime.label(for: lang, country: store.country, clockSource: store.activeFace.clockSource, now: context.date))
                        .foregroundStyle(WhiscoTheme.muted)
                }
                Text(lang).font(.largeTitle.bold())
                let s = Pack.sponsor(languages: [lang], clockSource: store.activeFace.clockSource)
                SponsorStrip(brand: s.brand, line: s.line)
                if !live.isEmpty {
                    Text("Live now").font(.title3.bold())
                    ForEach(live.prefix(12)) { ch in
                        NavigationLink(value: ch) { ChannelChip(channel: ch) }
                    }
                }
                ForEach(vod?.shelves.filter { Pack.collectionLanguage[$0.name] == lang } ?? []) { shelf in
                    Text(shelf.name).font(.title3.bold())
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 10) { ForEach(shelf.items) { PosterView(title: $0) } }
                    }
                }
            }
            .padding()
        }
        .navigationTitle(lang)
        .navigationDestination(for: Channel.self) { WatchView(channel: $0) }
        .navigationDestination(for: CatalogTitle.self) { TitleDetailView(slug: $0.slug) }
        .task {
            live = (try? await APIClient.shared.liveAll(language: lang)) ?? []
            vod = try? await APIClient.shared.vod()
        }
        .whiscoScreen()
    }
}
