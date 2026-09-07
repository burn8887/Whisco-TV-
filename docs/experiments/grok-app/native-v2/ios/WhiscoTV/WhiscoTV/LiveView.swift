import SwiftUI

struct LiveView: View {
    @Environment(LocalStore.self) private var store
    @State private var language: String = "Arabic"
    @State private var channels: [Channel] = []
    @State private var category: String = "All"
    @State private var query = ""
    @State private var loading = false
    @State private var mosaic = true

    private var kids: Bool { store.activeFace.kidsMode == true }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("\(channels.count) channels · legal FTA")
                        .font(.subheadline)
                        .foregroundStyle(WhiscoTheme.muted)
                    Text("Grouped by language, then category. Channel +/− on the player is the remote.")
                        .font(.subheadline)
                        .foregroundStyle(WhiscoTheme.muted)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack {
                            ForEach(store.activeFace.languages, id: \.self) { lang in
                                Chip(label: lang, selected: language == lang) {
                                    language = lang
                                    Task { await load() }
                                }
                            }
                        }
                    }
                    if !kids {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack {
                                ForEach(Pack.categories.filter { cat in
                                    cat == "All" || channels.contains(where: { $0.category == cat })
                                }, id: \.self) { cat in
                                    let n = cat == "All" ? 0 : channels.filter { $0.category == cat }.count
                                    Chip(label: n > 0 ? "\(cat) · \(n)" : cat, selected: category == cat) {
                                        category = cat
                                    }
                                }
                            }
                        }
                    }
                    HStack {
                        TextField("Filter \(language) channels", text: $query)
                            .textFieldStyle(.plain)
                            .padding(12)
                            .background(WhiscoTheme.surface, in: RoundedRectangle(cornerRadius: 12))
                        Button(mosaic ? "List" : "Mosaic") { mosaic.toggle() }
                            .font(.caption)
                            .foregroundStyle(WhiscoTheme.muted)
                    }
                    if !store.favoriteChannels.isEmpty {
                        Text("Pinned").font(.title3.bold())
                        ForEach(store.favoriteChannels) { ch in
                            NavigationLink(value: ch) { ChannelChip(channel: ch) }
                        }
                    }
                    let filtered = channels.filter { ch in
                        if kids { return ch.category == "Kids" }
                        if category != "All" && ch.category != category { return false }
                        if query.isEmpty { return true }
                        return "\(ch.name) \(ch.country ?? "") \(ch.category ?? "")".localizedCaseInsensitiveContains(query)
                    }
                    if loading {
                        ProgressView("Loading \(language)…").tint(WhiscoTheme.fg).padding()
                    } else if filtered.isEmpty {
                        EmptyState(
                            title: kids ? "No kids channels here" : "Nothing in this slice",
                            detail: kids ? "Try English, or open Cartoons in Library." : "Try another language or category."
                        )
                    } else if mosaic {
                        LazyVGrid(columns: [GridItem(.adaptive(minimum: 96), spacing: 12)], spacing: 12) {
                            ForEach(filtered) { MosaicCell(channel: $0) }
                        }
                    } else {
                        VStack(spacing: 8) {
                            ForEach(filtered) { ch in
                                NavigationLink(value: ch) { ChannelChip(channel: ch) }
                            }
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Live")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    NavigationLink { SearchView() } label: { Image(systemName: "magnifyingglass") }
                }
            }
            .navigationDestination(for: Channel.self) { WatchView(channel: $0) }
            .task(id: store.activeFaceId) {
                language = store.activeFace.languages.first ?? "Arabic"
                if kids { category = "Kids" } else if category == "Kids" { category = "All" }
                await load()
            }
        }
        .whiscoScreen()
    }

    private func load() async {
        loading = true
        defer { loading = false }
        channels = (try? await APIClient.shared.liveAll(language: language)) ?? []
    }
}
