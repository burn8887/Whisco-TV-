import SwiftUI

struct YouView: View {
    @Environment(LocalStore.self) private var store
    @State private var adding = false
    @State private var newName = ""
    @State private var newLangs: Set<String> = ["Arabic", "English"]
    @State private var newKids = false

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Text("On this device only").font(.subheadline).foregroundStyle(WhiscoTheme.muted)
                }
                Section("Faces") {
                    ForEach(store.faces) { face in
                        Button {
                            store.setActiveFace(face.id)
                        } label: {
                            HStack {
                                Circle()
                                    .fill(Color(hue: face.hue / 360, saturation: 0.8, brightness: 0.55))
                                    .frame(width: 32, height: 32)
                                    .overlay(Text(String(face.name.prefix(1))).font(.caption.bold()).foregroundStyle(WhiscoTheme.bg))
                                VStack(alignment: .leading) {
                                    HStack {
                                        Text(face.name).foregroundStyle(WhiscoTheme.fg)
                                        if face.kidsMode == true {
                                            Text("Kids").font(.caption2).foregroundStyle(WhiscoTheme.accent)
                                        }
                                    }
                                    Text(face.languages.joined(separator: " · ")).font(.caption).foregroundStyle(WhiscoTheme.muted)
                                }
                                Spacer()
                                if face.id == store.activeFaceId {
                                    Image(systemName: "checkmark").foregroundStyle(WhiscoTheme.fg)
                                }
                            }
                        }
                    }
                    .onDelete { index in
                        index.map { store.faces[$0].id }.forEach(store.removeFace)
                    }
                    if store.faces.count < 4 {
                        Button("Add face") { adding = true }
                    }
                    Toggle("Kids face", isOn: Binding(
                        get: { store.activeFace.kidsMode == true },
                        set: { on in store.updateActive { $0.kidsMode = on } }
                    ))
                    if adding {
                        TextField("Ammi, Kids, Baba…", text: $newName)
                        FlowLayout {
                            ForEach(Pack.languages, id: \.self) { lang in
                                Chip(label: lang, selected: newLangs.contains(lang)) {
                                    if newLangs.contains(lang) { newLangs.remove(lang) } else { newLangs.insert(lang) }
                                }
                            }
                        }
                        Toggle("Kids face", isOn: $newKids)
                        Button("Save face") {
                            store.addFace(name: newName.isEmpty ? (newKids ? "Kids" : "Face") : newName, languages: Array(newLangs), kidsMode: newKids)
                            adding = false
                            newName = ""
                        }
                    }
                }
                Section("Watching from") {
                    Picker("Country", selection: Binding(get: { store.country }, set: { store.country = $0; store.persist() })) {
                        ForEach(GccCountry.allCases) { Text($0.name).tag($0) }
                    }
                    Picker("Clock", selection: Binding(
                        get: { store.activeFace.clockSource ?? "origin" },
                        set: { src in store.updateActive { $0.clockSource = src } }
                    )) {
                        Text("Clock from here").tag("gulf")
                        Text("Clock from home languages").tag("origin")
                    }
                }
                if !store.resume.isEmpty {
                    Section("Continue") {
                        ForEach(store.resume.prefix(6)) { entry in
                            NavigationLink(value: entry) {
                                VStack(alignment: .leading) {
                                    Text(entry.name)
                                    Text(entry.kind == "live" ? "Live" : "On demand")
                                        .font(.caption)
                                        .foregroundStyle(WhiscoTheme.muted)
                                }
                            }
                        }
                    }
                }
                Section("Pinned live") {
                    if store.favoriteChannels.isEmpty {
                        Text("Star a channel on the player.")
                    } else {
                        ForEach(store.favoriteChannels) { ch in
                            NavigationLink(value: ch) { Text(ch.name) }
                        }
                    }
                }
                Section("Saved") {
                    if store.watchlist.isEmpty {
                        Text("Nothing saved yet. Tap Save on a title.")
                    } else {
                        ForEach(store.watchlist) { t in
                            NavigationLink(value: t) { Text(t.name) }
                        }
                    }
                }
                Section {
                    NavigationLink { CastView() } label: {
                        Label("Put it on the TV", systemImage: "tv")
                    }
                    Toggle("Live chime", isOn: Binding(get: { store.soundEnabled }, set: { store.soundEnabled = $0; store.persist() }))
                    Text("Off by default. Shared rooms, night shifts.")
                        .font(.footnote)
                        .foregroundStyle(WhiscoTheme.muted)
                }
                Section {
                    HStack(alignment: .top, spacing: 12) {
                        Image("WhiscoSit").resizable().scaledToFit().frame(width: 56, height: 56)
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Whisco").font(.headline)
                            Text("Named after a real Shih Tzu. In this house he is Whisco when children are in the room. The rest of his name lives in a glass.")
                                .font(.caption)
                                .foregroundStyle(WhiscoTheme.muted)
                        }
                    }
                    Button("Reset this device", role: .destructive, action: store.reset)
                    Text("Data not collected. Watchlist and faces never leave the phone.")
                        .font(.caption)
                        .foregroundStyle(WhiscoTheme.subtle)
                }
            }
            .scrollContentBackground(.hidden)
            .navigationTitle("You")
            .navigationDestination(for: CatalogTitle.self) { TitleDetailView(slug: $0.slug) }
            .navigationDestination(for: Channel.self) { WatchView(channel: $0) }
            .navigationDestination(for: ResumeEntry.self) { ResumeDestination(entry: $0) }
        }
        .whiscoScreen()
    }
}
