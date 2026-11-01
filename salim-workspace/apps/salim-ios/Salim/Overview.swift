import AVFoundation
import MapKit
import SwiftUI

/// The Overview banner: a dark "windscreen" card in every theme. The logo's road runs through
/// the background; the lockup pairs SALIM with سالم at equal weight; the line in the app's
/// language is the headline and the other language answers it from the opposite edge; a live
/// status strip closes the card.
struct HeroBanner: View {
    @EnvironmentObject var model: DriveModel
    var body: some View {
        let arabic = Ar.enabled
        let cameras = model.hazards.filter(\.isCamera).count
        let (dot, label): (Color, String) = model.mode == .gps && model.alertReady ? (.signal, "GPS LOCKED")
            : model.mode == .gps ? (.warn, "LOCATING") : model.mode == .demo ? (.warn, "SIMULATION") : (.nightMuted, "READY")
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 14) {
                SalimMark(size: 60)
                VStack(alignment: .leading, spacing: 0) {
                    Text(verbatim: "SALIM").font(.system(size: 22, weight: .bold, design: .monospaced)).tracking(5).foregroundStyle(Color.nightInk)
                    Text(verbatim: "سالم").font(.system(size: 28, weight: .bold)).foregroundStyle(Color.signal)
                }
                Spacer()
                Text("AWARE, NOT ALARMED").font(.system(size: 9, weight: .semibold, design: .monospaced)).tracking(1.6)
                    .foregroundStyle(Color.warn).padding(.horizontal, 8).padding(.vertical, 4)
                    .overlay(RoundedRectangle(cornerRadius: 4).stroke(Color.warn.opacity(0.5)))
            }
            Spacer().frame(height: 20)
            Text(verbatim: arabic ? "اعرف ما ينتظرك." : "Know what’s ahead.").font(.system(size: 30, weight: .bold)).foregroundStyle(Color.nightInk)
            Text(verbatim: arabic ? "وقُد بهدوء." : "Keep your calm.").font(.system(size: 30, weight: .bold)).foregroundStyle(Color.signal)
            Text(verbatim: arabic ? "Know what’s ahead. Keep your calm." : "اعرف ما ينتظرك… وقُد بهدوء.")
                .font(.system(size: arabic ? 14 : 21, weight: .bold)).foregroundStyle(Color.nightInk.opacity(0.72))
                .frame(maxWidth: .infinity, alignment: .trailing).padding(.top, 10)
            Rectangle().fill(Color.nightLine).frame(height: 1).padding(.top, 16).padding(.bottom, 10)
            HStack(spacing: 8) {
                Circle().fill(dot).frame(width: 8, height: 8)
                Text(label).font(.system(size: 11, design: .monospaced)).tracking(1.2).foregroundStyle(Color.nightInk)
                Text(verbatim: "·").foregroundStyle(Color.nightMuted)
                Text(verbatim: model.country).font(.system(size: 11, design: .monospaced)).foregroundStyle(Color.nightMuted)
                Text(verbatim: "·").foregroundStyle(Color.nightMuted)
                Text("\(cameras) CAMERAS NEARBY").font(.system(size: 11, design: .monospaced)).tracking(1).foregroundStyle(Color.nightMuted).lineLimit(1)
                if OfflinePacks.active && OfflinePacks.info(model.country) != nil {
                    Spacer()
                    Text("OFFLINE PACK").font(.system(size: 9, design: .monospaced)).foregroundStyle(Color.signal)
                }
            }
            Text("COVERAGE VARIES · FOLLOW POSTED SIGNS").font(.system(size: 9, design: .monospaced)).tracking(1.1)
                .foregroundStyle(Color.warn.opacity(0.85)).padding(.top, 6)
        }
        .padding(.horizontal, 20).padding(.vertical, 18)
        .background {
            ZStack {
                Color.nightGround
                Canvas { context, size in
                    let w = size.width, h = size.height, vx = w * 0.80, vy = h * 0.20
                    var road = Path()
                    road.move(to: CGPoint(x: w * 0.42, y: h)); road.addLine(to: CGPoint(x: vx - 7, y: vy + 15))
                    road.move(to: CGPoint(x: w * 1.18, y: h)); road.addLine(to: CGPoint(x: vx + 7, y: vy + 15))
                    context.stroke(road, with: .color(Color(red: 0.957, green: 0.937, blue: 0.902).opacity(0.06)), style: StrokeStyle(lineWidth: 7, lineCap: .round))
                    context.fill(Path(ellipseIn: CGRect(x: vx - 17, y: vy - 17, width: 34, height: 34)), with: .color(Color.warn.opacity(0.10)))
                    context.fill(Path(ellipseIn: CGRect(x: vx - 5.5, y: vy - 5.5, width: 11, height: 11)), with: .color(Color.warn.opacity(0.28)))
                }
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.nightLine))
    }
}

/// Hands a destination to the driver's navigation app.
enum NavLauncher {
    @MainActor static var pending: (String, Date)?
    @MainActor static func open(_ destination: String, app: NavAppOption = DriverOptions.nav) {
        let target = destination.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !target.isEmpty else { return }
        DriverOptions.remember(target)
        var allowed = CharacterSet.alphanumerics; allowed.insert(charactersIn: "-._~")
        let q = target.addingPercentEncoding(withAllowedCharacters: allowed) ?? ""
        let web = URL(string: "https://www.google.com/maps/dir/?api=1&destination=\(q)&travelmode=driving&dir_action=navigate")!
        let url: URL? = switch app {
        case .apple: URL(string: "https://maps.apple.com/?daddr=\(q)&dirflg=d")
        case .google: URL(string: "comgooglemaps://?daddr=\(q)&directionsmode=driving")
        case .waze: URL(string: "https://waze.com/ul?q=\(q)&navigate=yes")
        }
        UIApplication.shared.open(url ?? web) { ok in if !ok { UIApplication.shared.open(web) } }
    }
    /// Opens navigation if it was asked for in the last minute, once the drive is running.
    @MainActor static func driveStarted() {
        guard let (target, at) = pending else { return }
        pending = nil
        if Date().timeIntervalSince(at) < 60 { open(target) }
    }
}

/// "Drive to": one tap from Home, Work or a recent place starts Salim *and* opens Apple Maps,
/// Google Maps or Waze already navigating, so alerts run underneath the navigation app.
struct DriveToView: View {
    @EnvironmentObject var model: DriveModel
    let theme: Theme
    let startDrive: () -> Void
    @State private var destination = ""
    @AppStorage(DriverOptions.homeKey) private var home = ""
    @AppStorage(DriverOptions.workKey) private var work = ""
    @AppStorage(DriverOptions.navKey) private var nav = NavAppOption.apple.rawValue
    @State private var recents: [String] = DriverOptions.recents

    private func go(_ target: String) {
        guard !target.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        if model.mode == .gps { NavLauncher.open(target) } else { NavLauncher.pending = (target, Date()); startDrive() }
        recents = DriverOptions.recents
    }

    var body: some View {
        let app = NavAppOption(rawValue: nav) ?? .apple
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("DRIVE TO").font(.system(size: 11, design: .monospaced)).tracking(2).foregroundStyle(theme.accent)
                Spacer()
                Text("WITH \(app.label.uppercased())").font(.system(size: 10, design: .monospaced)).tracking(1).foregroundStyle(theme.muted)
            }
            HStack {
                Image(systemName: "magnifyingglass").foregroundStyle(theme.muted)
                TextField(Ar.t("Search or say a destination"), text: $destination).textFieldStyle(.plain).submitLabel(.go).onSubmit { go(destination) }
            }
            .padding(12).background(theme.ground, in: RoundedRectangle(cornerRadius: 8)).overlay(RoundedRectangle(cornerRadius: 8).stroke(theme.line))
            let chips: [PlaceChip] = (home.isEmpty ? [] : [PlaceChip(icon: "house", label: Ar.t("Home"), target: home)])
                + (work.isEmpty ? [] : [PlaceChip(icon: "briefcase", label: Ar.t("Work"), target: work)])
                + recents.prefix(4).map { PlaceChip(icon: "clock", label: $0, target: $0) }
            if !chips.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(chips) { chip in
                            Button { go(chip.target) } label: {
                                Label { Text(verbatim: chip.label).lineLimit(1) } icon: { Image(systemName: chip.icon) }
                                    .font(.system(size: 13)).padding(.horizontal, 14).padding(.vertical, 9)
                                    .overlay(Capsule().stroke(theme.line))
                            }.buttonStyle(.plain).foregroundStyle(theme.ink)
                        }
                    }
                }
            }
            Button { go(destination) } label: {
                Label { Text(model.mode == .gps ? "NAVIGATE" : "DRIVE & NAVIGATE").font(.system(size: 13, weight: .bold, design: .monospaced)).tracking(1) } icon: { Image(systemName: "location.north.line.fill") }
                    .frame(maxWidth: .infinity, minHeight: 52)
                    .background(theme.accent, in: RoundedRectangle(cornerRadius: 8)).foregroundStyle(theme.onAccent)
            }
            .buttonStyle(.plain).disabled(destination.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            if !destination.isEmpty {
                HStack(spacing: 16) {
                    Button(Ar.t("Save as Home")) { home = destination }.font(.caption)
                    Button(Ar.t("Save as Work")) { work = destination }.font(.caption)
                }
            }
            Text("Salim keeps alerting in the background while your navigation app guides you.").font(.system(size: 11)).foregroundStyle(theme.muted)
        }
        .padding(16).background(theme.surface, in: RoundedRectangle(cornerRadius: 10)).overlay(RoundedRectangle(cornerRadius: 10).stroke(theme.line))
        .onChange(of: model.mode) { _, value in if value == .gps { NavLauncher.driveStarted() } }
    }
}

struct PlaceChip: Identifiable {
    let icon: String, label: String, target: String
    var id: String { icon + target }
}

/// Drop a pin like in Google Maps: pan the map under the fixed centre marker, then confirm.
struct PinPickerView: View {
    let start: CLLocationCoordinate2D
    let onPick: (CLLocationCoordinate2D) -> Void
    @Environment(\.dismiss) private var dismiss
    @State private var center: CLLocationCoordinate2D
    @State private var camera: MapCameraPosition
    init(start: CLLocationCoordinate2D, onPick: @escaping (CLLocationCoordinate2D) -> Void) {
        self.start = start; self.onPick = onPick
        _center = State(initialValue: start)
        _camera = State(initialValue: .region(MKCoordinateRegion(center: start, span: MKCoordinateSpan(latitudeDelta: 0.008, longitudeDelta: 0.008))))
    }
    var body: some View {
        NavigationStack {
            ZStack {
                Map(position: $camera).onMapCameraChange(frequency: .continuous) { context in center = context.region.center }
                Image(systemName: "mappin.circle.fill").font(.system(size: 36)).foregroundStyle(Color.warn).shadow(radius: 2).offset(y: -18)
            }
            .ignoresSafeArea(edges: .bottom)
            .navigationTitle(Ar.t("Move the map to place the pin")).navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button(Ar.t("Cancel")) { dismiss() } }
                ToolbarItem(placement: .confirmationAction) { Button(Ar.t("Use this spot")) { onPick(center); dismiss() } }
            }
        }
    }
}

/// Settings › Alerts, Drive view, Integrations and Offline packs.
struct DriverSettingsSections: View {
    let theme: Theme
    @EnvironmentObject var model: DriveModel
    @EnvironmentObject var store: Store
    @AppStorage(DriverOptions.toneKey) private var tone = TonePreset.chime.rawValue
    @AppStorage(DriverOptions.voiceKey) private var voice = ""
    @AppStorage(DriverOptions.rateKey) private var rate = 1.0
    @AppStorage(DriverOptions.countdownKey) private var countdown = true
    @AppStorage(DriverOptions.hapticsKey) private var haptics = true
    @AppStorage(DriverOptions.leadKey) private var lead = LeadOption.standard.rawValue
    @AppStorage(DriverOptions.screenKey) private var screenOn = true
    @AppStorage(DriverOptions.navKey) private var nav = NavAppOption.apple.rawValue
    @State private var packInfo: [String: OfflinePacks.Info] = [:]
    @State private var busy: Set<String> = []
    @State private var premiumSheet = false
    private let preview = AVSpeechSynthesizer()

    private var voices: [AVSpeechSynthesisVoice] {
        let lang = Ar.enabled ? "ar" : "en"
        return Array(AVSpeechSynthesisVoice.speechVoices().filter { $0.language.hasPrefix(lang) }.sorted { $0.name < $1.name }.prefix(8))
    }

    private func testAlert() {
        TonePlayer.shared.play(ToneSynth.alert(DriverOptions.tone))
        if DriverOptions.haptics { Haptics.pulse(0.9) }
        Task { @MainActor in
            try? await Task.sleep(for: .milliseconds(500))
            let u = AVSpeechUtterance(string: Ar.enabled ? "كاميرا سرعة بعد 400 متر، السرعة المحددة 80. التزم باللوحات المرورية." : "Speed camera in 400 metres, limit 80. Follow posted signs.")
            u.voice = DriverOptions.voiceID.flatMap { AVSpeechSynthesisVoice(identifier: $0) } ?? AVSpeechSynthesisVoice(language: Ar.enabled ? "ar-SA" : "en")
            u.rate = min(AVSpeechUtteranceMaximumSpeechRate, AVSpeechUtteranceDefaultSpeechRate * Float(DriverOptions.rate))
            preview.speak(u)
            try? await Task.sleep(for: .seconds(3.8))
            guard DriverOptions.countdown else { return }
            for (i, gap) in [0.9, 0.65, 0.45, 0.3, 0.22].enumerated() {
                TonePlayer.shared.play(ToneSynth.tick(DriverOptions.tone)); if DriverOptions.haptics { Haptics.pulse(0.3 + Double(i) * 0.15) }
                try? await Task.sleep(for: .seconds(gap))
            }
            TonePlayer.shared.play(ToneSynth.flat()); if DriverOptions.haptics { Haptics.pulse(1) }
        }
    }

    var body: some View {
        Section {
            Picker(Ar.t("Alert sound"), selection: $tone) { ForEach(TonePreset.allCases) { Text($0.label).tag($0.rawValue) } }
                .onChange(of: tone) { _, value in TonePlayer.shared.play(ToneSynth.alert(TonePreset(rawValue: value) ?? .chime)) }
            Picker(Ar.t("Voice"), selection: $voice) {
                Text("Default").tag("")
                ForEach(voices, id: \.identifier) { v in Text(verbatim: "\(v.name) · \(v.language)").tag(v.identifier) }
            }
            Picker(Ar.t("Speaking speed"), selection: $rate) { Text("Calm").tag(0.85); Text("Normal").tag(1.0); Text("Brisk").tag(1.2) }
            Toggle(Ar.t("Countdown beeps"), isOn: $countdown)
            Toggle(Ar.t("Vibration"), isOn: $haptics)
            Picker(Ar.t("Alert distance"), selection: $lead) { ForEach(LeadOption.allCases) { Text($0.label).tag($0.rawValue) } }
            Text((LeadOption(rawValue: lead) ?? .standard).detail).font(.caption)
            Button(Ar.t("Play a test alert"), action: testAlert)
        } header: { Text("Alerts") } footer: { Text("Haptics play while Salim is on screen.") }
        Section(Ar.t("Drive view")) {
            Toggle(Ar.t("Keep screen on"), isOn: $screenOn)
        }
        Section {
            Picker(Ar.t("Navigation app"), selection: $nav) { ForEach(NavAppOption.allCases) { Text($0.label).tag($0.rawValue) } }
        } header: { Text("Navigation app") } footer: { Text("Alerts over other apps aren't possible on iPhone. Salim speaks and sounds alerts in the background while you navigate.") }
        Section(Ar.t("Cars and watches")) {
            VStack(alignment: .leading) { Text("CarPlay").bold(); Text("Coming soon. Alerts already play through CarPlay audio and Bluetooth.").font(.caption) }
            VStack(alignment: .leading) { Text("Apple Watch countdown").bold(); Text("Coming soon for Premium: feel the countdown on your wrist.").font(.caption) }
        }
        Section {
            ForEach(OfflinePacks.countries, id: \.0) { code, name in
                HStack {
                    VStack(alignment: .leading) {
                        Text(name)
                        Text(verbatim: packInfo[code].map { "\($0.count) \(Ar.t("cameras")) · \($0.updatedAt.formatted(date: .abbreviated, time: .omitted))" } ?? Ar.t("Not downloaded")).font(.caption)
                    }
                    Spacer()
                    if busy.contains(code) { ProgressView() }
                    else if !store.premium { Button(Ar.t("Premium")) { premiumSheet = true }.font(.caption) }
                    else {
                        Button { Task { busy.insert(code); defer { busy.remove(code) }; if (try? await OfflinePacks.download(code)) != nil { packInfo[code] = OfflinePacks.info(code) } } } label: { Image(systemName: "arrow.down.circle") }
                            .buttonStyle(.borderless)
                        if packInfo[code] != nil { Button(role: .destructive) { OfflinePacks.remove(code); packInfo[code] = nil } label: { Image(systemName: "trash") }.buttonStyle(.borderless) }
                    }
                }
            }
        } header: { Text("Offline camera packs") } footer: { Text("Download every mapped camera in a country so alerts keep working without signal.") }
        .onAppear { for (code, _) in OfflinePacks.countries { packInfo[code] = OfflinePacks.info(code) } }
        .sheet(isPresented: $premiumSheet) { Paywall(theme: theme) }
    }
}
