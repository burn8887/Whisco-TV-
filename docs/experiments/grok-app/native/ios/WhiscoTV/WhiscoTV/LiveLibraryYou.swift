import SwiftUI
import AVKit
import WebKit

struct LiveView: View {
    @Environment(LocalStore.self) private var store
    @State private var language: String = "Arabic"
    @State private var payload: LivePayload?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Live").font(.largeTitle.bold())
                    Text("Language mosaic, not a 575-row dump.")
                        .foregroundStyle(WhiscoTheme.muted)
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack {
                            ForEach(store.activeFace.languages, id: \.self) { lang in
                                Button(lang) { language = lang; Task { await load() } }
                                    .buttonStyle(.bordered)
                                    .tint(language == lang ? WhiscoTheme.accent : WhiscoTheme.muted)
                            }
                        }
                    }
                    if let payload {
                        ForEach(payload.channels) { ch in
                            NavigationLink(value: ch) { ChannelChip(channel: ch) }
                        }
                    }
                }
                .padding()
            }
            .navigationDestination(for: Channel.self) { WatchView(channel: $0) }
            .task {
                language = store.activeFace.languages.first ?? "Arabic"
                await load()
            }
        }
        .whiscoScreen()
    }

    private func load() async {
        payload = try? await APIClient.shared.live(language: language)
    }
}

struct LibraryView: View {
    @State private var vod: VodShelvesPayload?
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("Library").font(.largeTitle.bold())
                    if let vod {
                        ForEach(vod.shelves) { shelf in
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
                .padding()
            }
            .navigationDestination(for: CatalogTitle.self) { TitleDetailView(slug: $0.slug) }
            .task { vod = try? await APIClient.shared.vod() }
        }
        .whiscoScreen()
    }
}

struct YouView: View {
    @Environment(LocalStore.self) private var store
    var body: some View {
        NavigationStack {
            List {
                Section("Faces") {
                    ForEach(store.faces) { face in
                        Button {
                            store.activeFaceId = face.id
                            store.persist()
                        } label: {
                            HStack {
                                Text(face.name)
                                Spacer()
                                Text(face.languages.joined(separator: " · "))
                                    .foregroundStyle(WhiscoTheme.muted)
                            }
                        }
                    }
                }
                Section("Watching from") {
                    Picker("Country", selection: Binding(get: { store.country }, set: { store.country = $0; store.persist() })) {
                        ForEach(GccCountry.allCases, id: \.self) { Text($0.rawValue).tag($0) }
                    }
                }
                Section("Saved") {
                    if store.watchlist.isEmpty {
                        Text("Nothing saved yet.")
                    } else {
                        ForEach(store.watchlist) { t in Text(t.name) }
                    }
                }
                Section {
                    Toggle("Live chime", isOn: Binding(get: { store.soundEnabled }, set: { store.soundEnabled = $0; store.persist() }))
                    Text("Off by default. Shared rooms, night shifts.")
                        .font(.footnote)
                        .foregroundStyle(WhiscoTheme.muted)
                }
            }
            .navigationTitle("You")
        }
        .whiscoScreen()
    }
}

struct TitleDetailView: View {
    let slug: String
    @Environment(LocalStore.self) private var store
    @State private var payload: TitlePayload?

    var body: some View {
        ScrollView {
            if let t = payload?.title {
                VStack(alignment: .leading, spacing: 12) {
                    AsyncImage(url: URL(string: t.backdropUrl ?? t.posterUrl ?? "")) { img in
                        img.resizable().scaledToFill()
                    } placeholder: { WhiscoTheme.elevated }
                    .frame(height: 220)
                    .clipped()
                    Text(t.name).font(.largeTitle.bold()).padding(.horizontal)
                    Text(t.synopsis ?? "").foregroundStyle(WhiscoTheme.muted).padding(.horizontal)
                    if let first = t.seasons?.first?.episodes.first {
                        NavigationLink("Play") { WatchView(episode: first, titleName: t.name) }
                            .buttonStyle(.borderedProminent)
                            .padding(.horizontal)
                    }
                    ForEach(t.seasons ?? [], id: \.number) { season in
                        Text("Season \(season.number)").font(.title3.bold()).padding(.horizontal)
                        ForEach(season.episodes) { ep in
                            NavigationLink {
                                WatchView(episode: ep, titleName: t.name)
                            } label: {
                                HStack {
                                    Text(ep.number.description).foregroundStyle(WhiscoTheme.muted)
                                    Text(ep.name)
                                    Spacer()
                                }
                                .padding(.horizontal)
                            }
                        }
                    }
                }
            }
        }
        .task { payload = try? await APIClient.shared.title(slug: slug) }
        .whiscoScreen()
    }
}

struct WatchView: View {
    var channel: Channel? = nil
    var episode: Episode? = nil
    var titleName: String = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let url = channel?.streamUrl, url.contains(".m3u8") {
                HLSPlayer(url: url)
                    .aspectRatio(16/9, contentMode: .fit)
            } else if let src = episode?.streamUrl, src.contains("youtube") {
                YouTubeEmbed(url: src)
                    .aspectRatio(16/9, contentMode: .fit)
            } else {
                ContentUnavailableView("Nothing to play", systemImage: "play.slash")
            }
            Text(channel?.name ?? "\(titleName) · \(episode?.name ?? "")")
                .font(.title2.bold())
                .padding(.horizontal)
            Text("No ads on the picture. YouTube stays an official embed (ToS). HLS is AVPlayer.")
                .font(.footnote)
                .foregroundStyle(WhiscoTheme.muted)
                .padding(.horizontal)
            Spacer()
        }
        .whiscoScreen()
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct HLSPlayer: UIViewControllerRepresentable {
    let url: String
    func makeUIViewController(context: Context) -> AVPlayerViewController {
        let vc = AVPlayerViewController()
        if let u = URL(string: url) {
            vc.player = AVPlayer(url: u)
            vc.player?.play()
        }
        return vc
    }
    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {}
}

struct YouTubeEmbed: UIViewRepresentable {
    let url: String
    func makeUIView(context: Context) -> WKWebView {
        let w = WKWebView(frame: .zero, configuration: WKWebViewConfiguration())
        w.scrollView.isScrollEnabled = false
        if let u = URL(string: url.replacingOccurrences(of: "youtube.com/embed", with: "youtube-nocookie.com/embed")) {
            w.load(URLRequest(url: u))
        }
        return w
    }
    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
