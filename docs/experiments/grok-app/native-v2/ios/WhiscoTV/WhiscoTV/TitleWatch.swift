import SwiftUI

struct TitleDetailView: View {
    let slug: String
    @Environment(LocalStore.self) private var store
    @State private var payload: TitlePayload?
    @State private var failed = false

    var body: some View {
        ScrollView {
            if let t = payload?.title {
                VStack(alignment: .leading, spacing: 14) {
                    AsyncImage(url: URL(string: t.backdropUrl ?? t.posterUrl ?? "")) { phase in
                        switch phase {
                        case .success(let img): img.resizable().scaledToFill()
                        default: WhiscoTheme.elevated
                        }
                    }
                    .frame(height: 220)
                    .clipped()
                    VStack(alignment: .leading, spacing: 8) {
                        Text([t.language, t.collection, t.releaseYear.map(String.init)].compactMap { $0 }.joined(separator: " · "))
                            .font(.caption)
                            .foregroundStyle(WhiscoTheme.muted)
                            .textCase(.uppercase)
                            .tracking(1.2)
                        Text(t.name).font(.largeTitle.bold())
                        if let syn = t.synopsis { Text(syn).foregroundStyle(WhiscoTheme.muted) }
                        HStack {
                            if let first = t.seasons?.first?.episodes.first {
                                NavigationLink {
                                    WatchView(episode: first, titleName: t.name, slug: t.slug, poster: t.posterUrl)
                                } label: {
                                    Label("Play", systemImage: "play.fill")
                                        .frame(maxWidth: .infinity)
                                }
                                .buttonStyle(WhiscoPrimary())
                            } else if YouTube.isHLS(t.streamUrl) || YouTube.isYouTube(t.streamUrl) {
                                NavigationLink {
                                    WatchView(directURL: t.streamUrl, titleName: t.name, slug: t.slug, poster: t.posterUrl)
                                } label: {
                                    Label("Play", systemImage: "play.fill").frame(maxWidth: .infinity)
                                }
                                .buttonStyle(WhiscoPrimary())
                            }
                            Button {
                                store.toggleSaved(catalogTitle(from: t))
                            } label: {
                                Image(systemName: store.watchlist.contains(where: { $0.slug == t.slug }) ? "bookmark.fill" : "bookmark")
                                    .frame(width: 48, height: 48)
                            }
                            .accessibilityLabel("Save")
                        }
                    }
                    .padding(.horizontal)
                    ForEach(t.seasons ?? [], id: \.number) { season in
                        Text("Season \(season.number)").font(.title3.bold()).padding(.horizontal)
                        ForEach(season.episodes) { ep in
                            NavigationLink {
                                WatchView(episode: ep, titleName: t.name, slug: t.slug, poster: t.posterUrl)
                            } label: {
                                HStack(spacing: 12) {
                                    if let still = ep.stillUrl, let u = URL(string: still) {
                                        AsyncImage(url: u) { phase in
                                            if case .success(let img) = phase { img.resizable().scaledToFill() } else { WhiscoTheme.elevated }
                                        }
                                        .frame(width: 96, height: 54)
                                        .clipShape(RoundedRectangle(cornerRadius: 8))
                                    }
                                    Text(ep.number.description).foregroundStyle(WhiscoTheme.subtle).frame(width: 28)
                                    Text(ep.name).foregroundStyle(WhiscoTheme.fg)
                                    Spacer()
                                }
                                .padding(.horizontal)
                                .padding(.vertical, 6)
                            }
                        }
                    }
                    if let similar = payload?.similar, !similar.isEmpty {
                        Text("More like this").font(.title3.bold()).padding(.horizontal)
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 10) { ForEach(similar) { PosterView(title: $0) } }
                                .padding(.horizontal)
                        }
                    }
                    AdCard(kicker: "Ad · below the episodes, never on them", title: "A bank that already knows the corridor", bodyText: "One card. No takeover. Close it and keep watching.")
                        .padding()
                }
            } else if failed {
                EmptyState(title: "Title unavailable", detail: "Pull to retry.")
            } else {
                ProgressView().tint(WhiscoTheme.fg).frame(maxWidth: .infinity, minHeight: 200)
            }
        }
        .task {
            do { payload = try await APIClient.shared.title(slug: slug) }
            catch { failed = true }
        }
        .refreshable {
            do { payload = try await APIClient.shared.title(slug: slug); failed = false }
            catch { failed = true }
        }
        .whiscoScreen()
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: CatalogTitle.self) { TitleDetailView(slug: $0.slug) }
    }

    private func catalogTitle(from t: TitleDetail) -> CatalogTitle {
        CatalogTitle(
            id: t.id,
            slug: t.slug,
            name: t.name,
            posterUrl: t.posterUrl,
            backdropUrl: t.backdropUrl,
            type: t.type ?? "SERIES",
            releaseYear: t.releaseYear,
            imdbRating: t.imdbRating,
            collection: t.collection,
            language: t.language
        )
    }
}

struct WatchView: View {
    var channel: Channel? = nil
    var episode: Episode? = nil
    var titleName: String = ""
    var slug: String? = nil
    var poster: String? = nil
    var directURL: String? = nil
    @Environment(LocalStore.self) private var store
    @State private var related: [Channel] = []

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            player
                .aspectRatio(16/9, contentMode: .fit)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 6) {
                    if channel != nil {
                        Text("LIVE")
                            .font(.caption2.bold())
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(WhiscoTheme.live, in: Capsule())
                            .foregroundStyle(WhiscoTheme.bg)
                    }
                    Text(channel?.name ?? "\(titleName) · \(episode?.name ?? "")")
                        .font(.title2.bold())
                    if let channel {
                        Text([channel.language, channel.country, channel.category, channel.isHD == true ? "HD" : nil].compactMap { $0 }.joined(separator: " · "))
                            .font(.subheadline)
                            .foregroundStyle(WhiscoTheme.muted)
                        Text(HomeTime.channelLabel(channel)).font(.caption).foregroundStyle(WhiscoTheme.subtle)
                    }
                }
                Spacer()
                AirPlayButton().frame(width: 44, height: 44)
                if let channel {
                    Button { store.toggleFavorite(channel) } label: {
                        Image(systemName: store.isFavorite(channel.id) ? "star.fill" : "star")
                            .frame(width: 44, height: 44)
                            .foregroundStyle(store.isFavorite(channel.id) ? WhiscoTheme.accent : WhiscoTheme.muted)
                    }
                    .accessibilityLabel(store.isFavorite(channel.id) ? "Unpin channel" : "Pin channel")
                }
            }
            .padding(.horizontal)
            if let channel, related.count > 1 {
                let idx = related.firstIndex(where: { $0.id == channel.id }) ?? 0
                let prev = related[(idx - 1 + related.count) % related.count]
                let next = related[(idx + 1) % related.count]
                HStack(spacing: 8) {
                    NavigationLink(value: prev) {
                        VStack(alignment: .leading) {
                            Text("Ch −").font(.caption2).foregroundStyle(WhiscoTheme.subtle)
                            Text(prev.name).font(.subheadline).lineLimit(1)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .whiscoCard()
                    }
                    NavigationLink(value: next) {
                        VStack(alignment: .leading) {
                            Text("Ch +").font(.caption2).foregroundStyle(WhiscoTheme.subtle)
                            Text(next.name).font(.subheadline).lineLimit(1)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .whiscoCard()
                    }
                }
                .padding(.horizontal)
            }
            Text(channel != nil
                 ? "No ads on the picture. HLS is AVPlayer — no CORS. Pin and AirPlay stay on this device."
                 : "Official YouTube embed. We do not extract streams. The broadcaster keeps the video ads.")
                .font(.footnote)
                .foregroundStyle(WhiscoTheme.muted)
                .padding(.horizontal)
            if related.count > 1 {
                Text("More \(channel?.language ?? "")").font(.title3.bold()).padding(.horizontal)
                ScrollView {
                    VStack(spacing: 8) {
                        ForEach(related.filter { $0.id != channel?.id }.prefix(10)) { ch in
                            NavigationLink(value: ch) { ChannelChip(channel: ch) }
                        }
                    }
                    .padding(.horizontal)
                }
            }
            Spacer(minLength: 0)
        }
        .whiscoScreen()
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: Channel.self) { WatchView(channel: $0) }
        .task {
            if let ch = channel {
                store.upsertResume(ResumeEntry(id: ch.id, kind: "live", slug: nil, name: ch.name, posterUrl: ch.logoUrl, language: ch.language, updatedAt: Date().timeIntervalSince1970))
                if let lang = ch.language {
                    related = (try? await APIClient.shared.liveAll(language: lang)) ?? []
                }
            } else if !titleName.isEmpty {
                store.upsertResume(ResumeEntry(id: slug ?? titleName, kind: "vod", slug: slug, name: titleName, posterUrl: poster, language: nil, updatedAt: Date().timeIntervalSince1970))
            }
        }
    }

    @ViewBuilder private var player: some View {
        if let url = channel?.streamUrl, YouTube.isHLS(url) {
            HLSPlayer(url: url)
        } else if let src = episode?.streamUrl ?? directURL, YouTube.isYouTube(src) {
            YouTubeEmbed(url: src)
        } else if let src = episode?.streamUrl ?? directURL, YouTube.isHLS(src) {
            HLSPlayer(url: src)
        } else {
            EmptyState(title: "Nothing to play", detail: "This title has no legal playable source.")
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(WhiscoTheme.surface)
        }
    }
}
