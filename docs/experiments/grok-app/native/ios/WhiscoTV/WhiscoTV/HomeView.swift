import SwiftUI

struct HomeView: View {
    @Environment(LocalStore.self) private var store
    @State private var home: HomePayload?
    @State private var live: [Channel] = []
    @State private var vod: VodShelvesPayload?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    header
                    if let hero = home?.hero.first {
                        NavigationLink(value: hero) { HeroCard(title: hero) }
                    }
                    if !live.isEmpty {
                        Text("Live in \(store.activeFace.languages.prefix(3).joined(separator: " · "))")
                            .font(.title3.bold())
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack {
                                ForEach(live.prefix(10)) { ch in
                                    NavigationLink(value: ch) { ChannelChip(channel: ch) }
                                }
                            }
                        }
                    }
                    if let shelves = vod?.shelves {
                        ForEach(shelves.prefix(6)) { shelf in
                            VStack(alignment: .leading) {
                                Text(shelf.name).font(.title3.bold())
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack {
                                        ForEach(shelf.items) { item in
                                            NavigationLink(value: item) { PosterView(title: item) }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    Text("One ad lives here. Never on the picture.")
                        .font(.footnote)
                        .foregroundStyle(WhiscoTheme.muted)
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(WhiscoTheme.surface, in: RoundedRectangle(cornerRadius: 16))
                }
                .padding()
            }
            .navigationTitle("Tonight")
            .navigationDestination(for: CatalogTitle.self) { TitleDetailView(slug: $0.slug) }
            .navigationDestination(for: Channel.self) { WatchView(channel: $0) }
            .task { await load() }
        }
        .whiscoScreen()
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("\(store.activeFace.name)")
                .foregroundStyle(WhiscoTheme.muted)
            if let lang = store.activeFace.languages.first {
                Text("Tonight in \(HomeTime.label(for: lang))")
                    .font(.largeTitle.bold())
            }
        }
    }

    private func load() async {
        do {
            async let h = APIClient.shared.home()
            async let v = APIClient.shared.vod()
            let lang = store.activeFace.languages.first
            async let l = APIClient.shared.live(language: lang)
            home = try await h
            vod = try await v
            live = try await l.channels
        } catch { }
    }
}

struct HeroCard: View {
    let title: CatalogTitle
    var body: some View {
        ZStack(alignment: .bottomLeading) {
            AsyncImage(url: URL(string: title.backdropUrl ?? title.posterUrl ?? "")) { img in
                img.resizable().scaledToFill()
            } placeholder: { WhiscoTheme.elevated }
            LinearGradient(colors: [.clear, WhiscoTheme.bg], startPoint: .top, endPoint: .bottom)
            VStack(alignment: .leading) {
                Text(title.collection ?? "Featured").font(.caption)
                Text(title.name).font(.title.bold())
            }
            .padding()
        }
        .frame(height: 220)
        .clipShape(RoundedRectangle(cornerRadius: 24))
    }
}

struct PosterView: View {
    let title: CatalogTitle
    var body: some View {
        VStack(alignment: .leading) {
            AsyncImage(url: URL(string: title.posterUrl ?? "")) { img in
                img.resizable().scaledToFill()
            } placeholder: { WhiscoTheme.elevated }
            .frame(width: 120, height: 180)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            Text(title.name).font(.caption).lineLimit(2).frame(width: 120, alignment: .leading)
        }
    }
}

struct ChannelChip: View {
    let channel: Channel
    var body: some View {
        HStack {
            Circle().fill(WhiscoTheme.live).frame(width: 8, height: 8)
            VStack(alignment: .leading) {
                Text(channel.name).font(.subheadline.bold()).lineLimit(1)
                if let lang = channel.language {
                    Text(HomeTime.label(for: lang)).font(.caption2).foregroundStyle(WhiscoTheme.muted)
                }
            }
        }
        .padding(12)
        .frame(width: 220, alignment: .leading)
        .background(WhiscoTheme.surface, in: RoundedRectangle(cornerRadius: 16))
    }
}
