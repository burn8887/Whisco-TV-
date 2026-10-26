import SwiftUI
import MapKit
import UIKit
import Foundation

// Visual system, matching the Android instrument-panel direction.
//
// The first iOS build used the rounded, gradient, soft-green vocabulary that the Founder
// called a "startup dentist clinic". This is the opposite: sharp corners, hairline rules
// doing the separating, a near-black ground, one saturated signal colour, monospaced digits
// wherever a number is a reading. Contrast floor is 4.9:1 for every ink.
extension Color {
    static let signal=Color(red:0.291,green:0.871,blue:0.608)      // #4ADE9B
    static let signalDeep=Color(red:0.078,green:0.420,blue:0.298)  // #146B4C
    static let warn=Color(red:1.0,green:0.761,blue:0.294)          // #FFC24B
    static let warnInk=Color(red:0.478,green:0.353,blue:0.063)     // #7A5A10, 6.5:1 on white
    static let danger=Color(red:1.0,green:0.420,blue:0.353)        // #FF6B5A
    static let dangerInk=Color(red:0.639,green:0.180,blue:0.110)   // #A32E1C, 6.3:1 on white

    static let nightGround=Color(red:0.039,green:0.051,blue:0.043)  // #0A0D0B
    static let nightSurface=Color(red:0.071,green:0.090,blue:0.082) // #121715
    static let nightRaised=Color(red:0.102,green:0.129,blue:0.114)  // #1A211D
    static let nightLine=Color(red:0.153,green:0.200,blue:0.173)    // #27332C
    static let nightInk=Color(red:0.914,green:0.945,blue:0.918)     // #E9F1EA
    static let nightMuted=Color(red:0.580,green:0.655,blue:0.608)   // #94A79B, 6.9:1

    static let dayGround=Color(red:0.937,green:0.949,blue:0.925)    // #EFF2EC
    static let daySurface=Color.white
    static let dayLine=Color(red:0.796,green:0.831,blue:0.776)      // #CBD4C6
    static let dayInk=Color(red:0.055,green:0.090,blue:0.071)       // #0E1712
    static let dayMuted=Color(red:0.306,green:0.369,blue:0.329)     // #4E5E54, 7.2:1

    // Kept for the older views that still reference them.
    static let salim=Color(red:0.078,green:0.420,blue:0.298)
    static let ink=Color(red:0.055,green:0.090,blue:0.071)
    static let muted=Color(red:0.306,green:0.369,blue:0.329)
    static let amberInk=Color(red:0.478,green:0.353,blue:0.063)
    static let canvas=Color(red:0.937,green:0.949,blue:0.925)
}

/// Resolves the user's appearance choice against the system setting.
struct Theme {
    let dark: Bool
    init(_ choice: String, system: ColorScheme) {
        switch choice {
        case "dark": dark = true
        case "light": dark = false
        default: dark = system == .dark
        }
    }
    var ground: Color { dark ? .nightGround : .dayGround }
    var surface: Color { dark ? .nightSurface : .daySurface }
    var line: Color { dark ? .nightLine : .dayLine }
    var ink: Color { dark ? .nightInk : .dayInk }
    var muted: Color { dark ? .nightMuted : .dayMuted }
    var accent: Color { dark ? .signal : .signalDeep }
    var caution: Color { dark ? .warn : .warnInk }
    var onAccent: Color { dark ? .nightGround : .white }
}

@main struct SalimApp: App {
    @StateObject private var model = DriveModel()
    @Environment(\.scenePhase) private var phase

    var body: some Scene {
        WindowGroup {
            RootView(appearance: model.appearance)
                .environmentObject(model)
                .preferredColorScheme(model.appearance == "dark" ? .dark : model.appearance == "light" ? .light : nil)
                .onChange(of: phase) { _, value in
                    if value == .background && model.mode == .demo { model.stop() }
                }
        }
    }
}

struct RootView: View {
    @EnvironmentObject var model: DriveModel
    @Environment(\.colorScheme) private var scheme
    let appearance: String
    @State private var minimised = false

    var body: some View {
        let theme = Theme(appearance, system: scheme)
        Group {
            if model.mode != .idle && !minimised {
                DriveScreen(theme: theme, minimised: $minimised)
            } else {
                TabView {
                    NavigationStack { Dashboard(theme: theme) }
                        .tabItem { Label("Overview", systemImage: "square.grid.2x2") }
                    NavigationStack { TripsView() }
                        .tabItem { Label("Trips", systemImage: "clock.arrow.circlepath") }
                    NavigationStack { CommunityView(theme: theme) }
                        .tabItem { Label("Community", systemImage: "person.2") }
                    NavigationStack { SettingsView(theme: theme) }
                        .tabItem { Label("Settings", systemImage: "slider.horizontal.3") }
                }
                .tint(theme.accent)
            }
        }
        .onChange(of: model.mode) { _, value in if value == .idle { minimised = false } }
    }
}

/// The mark: Arabic initial in a square tile, SALIM in monospaced caps on a hairline.
struct BrandLockup: View {
    let theme: Theme
    var screen: String? = nil
    var body: some View {
        HStack(spacing: 10) {
            Text("س")
                .font(.system(size: 17, weight: .bold))
                .foregroundStyle(theme.onAccent)
                .frame(width: 30, height: 30)
                .background(theme.accent, in: RoundedRectangle(cornerRadius: 4))
            VStack(alignment: .leading, spacing: 3) {
                Text(screen?.uppercased() ?? "SALIM")
                    .font(.system(size: 16, weight: .bold, design: .monospaced))
                    .tracking(2)
                    .foregroundStyle(theme.ink)
                if screen == nil {
                    Rectangle().fill(theme.line).frame(width: 34, height: 1)
                }
            }
        }
    }
}

struct Dashboard: View {
    @EnvironmentObject var model: DriveModel
    let theme: Theme
    @State private var camera = MapCameraPosition.region(
        MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: 26.223, longitude: 50.565),
                           span: MKCoordinateSpan(latitudeDelta: 0.07, longitudeDelta: 0.07)))
    @State private var consent = false
    @State private var destination = ""
    @State private var centred = false

    private var cameras: [Hazard] { model.hazards.filter(\.isCamera) }
    private var others: [Hazard] { model.hazards.filter { !$0.isCamera } }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                statement
                mapCard
                metrics
                if model.mode == .idle { startRow }
                if model.mode == .gps && !model.acquired { acquiring }

                Text(model.status).font(.system(size: 12, design: .monospaced)).foregroundStyle(theme.accent)
                Text(model.feed).font(.system(size: 12)).foregroundStyle(theme.muted)

                if let match = model.warning { alertBanner(match) }

                if !cameras.isEmpty {
                    sectionLabel("CAMERAS · \(cameras.count)" + (cameras.contains { $0.id.hasPrefix("osm:") } ? " · \(cameras.filter { $0.id.hasPrefix("osm:") }.count) LIVE" : ""))
                    ForEach(cameras) { hazard in
                        alertRow(hazard.title, hazard.subtitle,
                                 camera: hazard.id.hasPrefix("osm:") ? "OSM" : hazard.approximate ? "≈" : nil)
                    }
                }
                if !others.isEmpty {
                    sectionLabel("ROAD CONDITIONS")
                    ForEach(others) { hazard in
                        alertRow(hazard.title, hazard.subtitle, camera: nil)
                    }
                }

                sectionLabel("DESTINATION")
                TextField("Where are you heading?", text: $destination)
                    .textFieldStyle(.plain)
                    .padding(12)
                    .background(theme.surface, in: RoundedRectangle(cornerRadius: 6))
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(theme.line))
                    .disabled(model.mode != .idle)
                Button {
                    var components = URLComponents(string: "https://maps.apple.com")!
                    components.queryItems = [URLQueryItem(name: "q", value: destination)]
                    if let url = components.url { UIApplication.shared.open(url) }
                } label: {
                    Text("OPEN IN MAPS")
                        .font(.system(size: 12, weight: .semibold, design: .monospaced))
                        .tracking(1)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                }
                .buttonStyle(.plain)
                .overlay(RoundedRectangle(cornerRadius: 6).stroke(theme.line))
                .foregroundStyle(theme.ink)
                .disabled(destination.trimmingCharacters(in: .whitespaces).isEmpty || model.mode != .idle)

                Text("Simulation is foreground-only. A GPS test may continue in the background until ended, subject to OS restrictions. This is not a navigation or emergency service.")
                    .font(.system(size: 11)).foregroundStyle(theme.muted).lineSpacing(3)
            }
            .padding(18)
        }
        .background(theme.ground)
        .onChange(of: model.fix?.point) { _, point in
            guard let point, !centred else { return }
            centred = true
            withAnimation(.easeInOut(duration: 0.3)) {
                camera = .region(MKCoordinateRegion(
                    center: CLLocationCoordinate2D(latitude: point.lat, longitude: point.lon),
                    span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)))
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) { BrandLockup(theme: theme) }
            ToolbarItem(placement: .topBarTrailing) {
                Text(model.country)
                    .font(.system(size: 11, design: .monospaced))
                    .foregroundStyle(theme.muted)
            }
        }
        .alert("Start a GPS test?", isPresented: $consent) {
            Button("Start GPS test") { model.startGPS() }
            Button("Not now", role: .cancel) {}
        } message: {
            Text("Set up while safely parked. Salim uses precise location during this test, including in the background, until you end it. Camera positions come from OpenStreetMap for the area around you. No route is uploaded.")
        }
    }

    /// The two ways in. Deliberately not a single "Go" button: a simulation and a real
    /// GPS test make different promises, and the driver should know which one they chose.
    private var startRow: some View {
        VStack(spacing: 8) {
            Button { model.startDemo() } label: {
                Text("START SIMULATED DRIVE")
                    .font(.system(size: 13, weight: .bold, design: .monospaced)).tracking(1)
                    .frame(maxWidth: .infinity).padding(.vertical, 13)
                    .background(theme.accent, in: RoundedRectangle(cornerRadius: 6))
                    .foregroundStyle(theme.onAccent)
            }
            .buttonStyle(.plain)
            .disabled(model.country != "BH")

            Button { consent = true } label: {
                Text("START GPS TEST")
                    .font(.system(size: 13, weight: .bold, design: .monospaced)).tracking(1)
                    .frame(maxWidth: .infinity).padding(.vertical, 13)
                    .foregroundStyle(theme.ink)
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(theme.line))
            }
            .buttonStyle(.plain)

            if model.country != "BH" {
                Text("The simulation drives the Bahrain pack. A GPS test works anywhere in the Gulf.")
                    .font(.system(size: 11)).foregroundStyle(theme.muted)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
    }

    private var statement: some View {
        VStack(alignment: .leading, spacing: 7) {
            Text("AWARE, NOT ALARMED")
                .font(.system(size: 10, weight: .semibold, design: .monospaced)).tracking(2.4)
                .foregroundStyle(theme.accent)
            Text("Know what’s ahead.\nKeep your calm.")
                .font(.system(size: 27, weight: .bold)).tracking(-0.6)
                .foregroundStyle(theme.ink)
            Text("اعرف ما أمامك.").font(.system(size: 14)).foregroundStyle(theme.muted)
            Text("قُد بهدوء.").font(.system(size: 14)).foregroundStyle(theme.muted)
            Rectangle().fill(theme.line).frame(height: 1).padding(.vertical, 4)
            Text("FICTIONAL ROAD DATA · NOT FOR DRIVING GUIDANCE")
                .font(.system(size: 10, design: .monospaced)).tracking(1.1)
                .foregroundStyle(theme.caution)
        }
    }

    private var mapCard: some View {
        VStack(spacing: 0) {
            ZStack(alignment: .topLeading) {
                Map(position: $camera) {
                    ForEach(cameras) { hazard in
                        Annotation("", coordinate: CLLocationCoordinate2D(latitude: hazard.point.lat, longitude: hazard.point.lon)) {
                            // Approximate sites are hollow: a filled dot reads as certainty.
                            Image(systemName: "camera.fill")
                                .font(.system(size: 10))
                                .foregroundStyle(Color.warn)
                                .padding(6)
                                .background(Color.nightGround, in: Circle())
                                .overlay(Circle().stroke(Color.warn, lineWidth: hazard.approximate ? 2 : 0))
                        }
                    }
                    if let sample = model.fix {
                        Annotation("", coordinate: CLLocationCoordinate2D(latitude: sample.point.lat, longitude: sample.point.lon)) {
                            Image(systemName: "location.north.fill")
                                .font(.system(size: 12))
                                .foregroundStyle(Color.nightGround)
                                .padding(9)
                                .background(Color.signal, in: Circle())
                        }
                    }
                }
                .mapControls { MapCompass() }
                .frame(height: 300)

                Text(model.fix == nil ? "MANAMA · NO FIX" : "YOUR POSITION")
                    .font(.system(size: 10, design: .monospaced)).tracking(1.8)
                    .foregroundStyle(Color.signal)
                    .padding(12)
            }
            .clipShape(RoundedRectangle(cornerRadius: 8))

            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(model.fix.map { "\(Int($0.speed * 3.6))" } ?? "0")
                        .font(.system(size: 34, weight: .bold, design: .monospaced))
                        .foregroundStyle(model.acquired || model.mode == .demo ? theme.ink : theme.muted)
                    Text("KM/H · \(model.mode == .demo ? "SIMULATED" : "DEVICE GPS")")
                        .font(.system(size: 10, design: .monospaced)).tracking(1)
                        .foregroundStyle(theme.muted)
                }
                Spacer()
                Toggle("", isOn: $model.voice).labelsHidden().tint(theme.accent)
            }
            .padding(.top, 12)
        }
    }

    private var metrics: some View {
        HStack(spacing: 0) {
            metric("STATE", model.mode == .idle ? "IDLE" : model.mode == .demo ? "SIM" : "GPS")
            Rectangle().fill(theme.line).frame(width: 1, height: 44)
            metric("PACK", "\(model.hazards.count)")
            Rectangle().fill(theme.line).frame(width: 1, height: 44)
            metric("LIVE", "\(model.liveCameras.count)")
        }
        .background(theme.surface, in: RoundedRectangle(cornerRadius: 6))
        .overlay(RoundedRectangle(cornerRadius: 6).stroke(theme.line))
    }

    private func metric(_ label: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(label).font(.system(size: 9, design: .monospaced)).tracking(1.6).foregroundStyle(theme.muted)
            Text(value).font(.system(size: 17, weight: .bold, design: .monospaced)).foregroundStyle(theme.ink)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 12).padding(.vertical, 11)
    }

    private var acquiring: some View {
        VStack(alignment: .leading, spacing: 9) {
            Text("ACQUIRING SATELLITES")
                .font(.system(size: 10, design: .monospaced)).tracking(1.8).foregroundStyle(theme.accent)
            HStack(alignment: .lastTextBaseline, spacing: 8) {
                Text("\(model.seconds)").font(.system(size: 30, weight: .bold, design: .monospaced)).foregroundStyle(theme.ink)
                Text("s elapsed").font(.system(size: 12)).foregroundStyle(theme.muted)
            }
            GeometryReader { proxy in
                ZStack(alignment: .leading) {
                    Rectangle().fill(theme.line)
                    Rectangle().fill(Color.signal)
                        .frame(width: proxy.size.width * min(1, max(0.02, Double(model.seconds) / 60)))
                }
            }
            .frame(height: 3)
            Text("A cold fix can take 30–60 seconds outdoors. Indoors, move near a window.")
                .font(.system(size: 11)).foregroundStyle(theme.muted)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(theme.surface, in: RoundedRectangle(cornerRadius: 6))
        .overlay(RoundedRectangle(cornerRadius: 6).stroke(theme.line))
    }

    private func alertBanner(_ match: AlertMatch) -> some View {
        HStack(spacing: 12) {
            Rectangle().fill(Color.warn).frame(width: 3)
            Text("\(Int(match.meters))").font(.system(size: 26, weight: .bold, design: .monospaced)).foregroundStyle(theme.caution)
            VStack(alignment: .leading, spacing: 2) {
                Text("METRES · \(match.hazard.title.uppercased())")
                    .font(.system(size: 10, design: .monospaced)).tracking(1.2).foregroundStyle(theme.muted)
                Text(match.hazard.road).font(.system(size: 13)).foregroundStyle(theme.ink)
            }
            Spacer()
        }
        .padding(.vertical, 12).padding(.trailing, 12)
        .background(theme.surface)
        .overlay(RoundedRectangle(cornerRadius: 6).stroke(Color.warn))
    }

    private func alertRow(_ title: String, _ subtitle: String, camera: String?) -> some View {
        HStack(spacing: 12) {
            Rectangle().fill(Color.warn).frame(width: 3)
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(.system(size: 14, weight: .semibold)).foregroundStyle(theme.ink)
                Text(subtitle).font(.system(size: 12)).foregroundStyle(theme.muted)
            }
            Spacer()
            if let camera {
                Text(camera).font(.system(size: 11, design: .monospaced)).foregroundStyle(theme.caution)
            }
        }
        .padding(.vertical, 10).padding(.trailing, 12)
        .background(theme.surface)
        .overlay(RoundedRectangle(cornerRadius: 4).stroke(theme.line))
    }

    private func sectionLabel(_ text: String) -> some View {
        Text(text)
            .font(.system(size: 10, weight: .semibold, design: .monospaced)).tracking(2)
            .foregroundStyle(theme.accent)
    }
}

/// Full-screen drive view: map first, numbers as overlay.
struct DriveScreen: View {
    @EnvironmentObject var model: DriveModel
    let theme: Theme
    @Binding var minimised: Bool
    @State private var camera = MapCameraPosition.region(
        MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: 26.223, longitude: 50.565),
                           span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)))

    var body: some View {
        ZStack {
            Map(position: $camera) {
                ForEach(model.hazards.filter(\.isCamera)) { hazard in
                    Annotation("", coordinate: CLLocationCoordinate2D(latitude: hazard.point.lat, longitude: hazard.point.lon)) {
                        Image(systemName: "camera.fill")
                            .font(.system(size: 10))
                            .foregroundStyle(Color.warn)
                            .padding(6)
                            .background(Color.nightGround, in: Circle())
                    }
                }
                if let sample = model.fix {
                    Annotation("", coordinate: CLLocationCoordinate2D(latitude: sample.point.lat, longitude: sample.point.lon)) {
                        Image(systemName: "location.north.fill")
                            .font(.system(size: 13))
                            .foregroundStyle(Color.nightGround)
                            .padding(10)
                            .background(Color.signal, in: Circle())
                    }
                }
            }
            .ignoresSafeArea()
            .mapStyle(.standard(elevation: .flat))
            .onChange(of: model.fix?.point) { _, point in
                guard let point else { return }
                withAnimation(.easeInOut(duration: 0.4)) {
                    camera = .region(MKCoordinateRegion(
                        center: CLLocationCoordinate2D(latitude: point.lat, longitude: point.lon),
                        span: MKCoordinateSpan(latitudeDelta: 0.006, longitudeDelta: 0.006)))
                }
            }

            VStack(spacing: 0) {
                LinearGradient(colors: [Color.nightGround.opacity(0.9), .clear], startPoint: .top, endPoint: .bottom)
                    .frame(height: 150).ignoresSafeArea().allowsHitTesting(false)
                Spacer()
                LinearGradient(colors: [.clear, Color.nightGround.opacity(0.9)], startPoint: .top, endPoint: .bottom)
                    .frame(height: 200).ignoresSafeArea().allowsHitTesting(false)
            }

            VStack(alignment: .leading, spacing: 10) {
                HStack(spacing: 4) {
                    VStack(alignment: .leading, spacing: 1) {
                        Text(model.mode == .demo ? "SIMULATED DRIVE" : "GPS TEST")
                            .font(.system(size: 10, design: .monospaced)).tracking(2).foregroundStyle(Color.signal)
                        Text(model.mode == .demo ? "Fictional route · no device GPS" : model.status)
                            .font(.system(size: 11)).foregroundStyle(Color.nightMuted).lineLimit(1)
                    }
                    Spacer()
                    Button { model.voice.toggle() } label: {
                        Image(systemName: model.voice ? "speaker.wave.2.fill" : "speaker.slash.fill")
                            .foregroundStyle(Color.nightInk).padding(10)
                    }
                    Button { minimised = true } label: {
                        Image(systemName: "chevron.down").foregroundStyle(Color.nightInk).padding(10)
                    }
                    Button { model.stop() } label: {
                        Text("END")
                            .font(.system(size: 12, weight: .bold, design: .monospaced)).tracking(0.8)
                            .foregroundStyle(Color(red: 0.1, green: 0.02, blue: 0.01))
                            .padding(.horizontal, 16).padding(.vertical, 9)
                            .background(Color.danger, in: RoundedRectangle(cornerRadius: 6))
                    }
                }
                .padding(.horizontal, 12).padding(.top, 6)

                if model.mode == .gps && !model.acquired {
                    Text("ACQUIRING GPS · \(model.seconds)s")
                        .font(.system(size: 11, design: .monospaced))
                        .foregroundStyle(Color.nightMuted)
                        .padding(.horizontal, 14)
                }
                if let match = model.warning {
                    HStack(spacing: 12) {
                        Text("\(Int(match.meters))").font(.system(size: 28, weight: .bold, design: .monospaced)).foregroundStyle(Color.warn)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("METRES · \(match.hazard.title.uppercased())")
                                .font(.system(size: 10, design: .monospaced)).tracking(1).foregroundStyle(Color.nightMuted)
                            Text(match.hazard.road).font(.system(size: 13)).foregroundStyle(Color.nightInk)
                        }
                        Spacer()
                    }
                    .padding(12)
                    .background(Color.nightSurface, in: RoundedRectangle(cornerRadius: 6))
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(Color.warn))
                    .padding(.horizontal, 14)
                }

                Spacer()

                HStack(alignment: .lastTextBaseline, spacing: 10) {
                    Text(model.fix.map { "\(Int($0.speed * 3.6))" } ?? "0")
                        .font(.system(size: 84, weight: .bold, design: .monospaced))
                        .tracking(-3)
                        .foregroundStyle(model.acquired || model.mode == .demo ? Color.nightInk : Color.nightMuted)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("KM/H").font(.system(size: 13, design: .monospaced)).tracking(1.6).foregroundStyle(Color.signal)
                        Text("\(model.seconds / 60):\(String(format: "%02d", model.seconds % 60))")
                            .font(.system(size: 14, design: .monospaced)).foregroundStyle(Color.nightMuted)
                    }
                    .padding(.bottom, 12)
                }
                .padding(.horizontal, 20)

                Text("CAMERAS © OPENSTREETMAP CONTRIBUTORS · ALWAYS CHECK POSTED SIGNS")
                    .font(.system(size: 9, design: .monospaced))
                    .foregroundStyle(Color.nightMuted)
                    .padding(.horizontal, 20).padding(.bottom, 8)
            }
        }
    }
}

struct TripsView: View {
    @EnvironmentObject var model: DriveModel
    @Environment(\.colorScheme) private var scheme
    @State private var clear = false
    var body: some View {
        let theme = Theme(model.appearance, system: scheme)
        List {
            Text("Summaries remain on this device. Precise routes are not saved.")
                .font(.caption).foregroundStyle(theme.muted)
            if model.trips.isEmpty {
                ContentUnavailableView("Your next journey starts here", systemImage: "car",
                                       description: Text("Start and finish a simulated drive."))
            }
            ForEach(model.trips) { trip in
                VStack(alignment: .leading, spacing: 6) {
                    Text(trip.interrupted ? "INTERRUPTED" : trip.demo ? "SIMULATED" : "GPS TEST")
                        .font(.system(size: 10, design: .monospaced)).tracking(1.2).foregroundStyle(theme.accent)
                    Text(trip.at.formatted()).font(.caption).foregroundStyle(theme.muted)
                    if !trip.interrupted {
                        Text("\(trip.seconds / 60)m \(trip.seconds % 60)s · \(trip.alerts) alerts")
                            .font(.system(size: 13, design: .monospaced))
                    }
                }
            }
            if !model.trips.isEmpty { Button("Delete local history", role: .destructive) { clear = true } }
        }
        .navigationTitle("Trips")
        .confirmationDialog("Delete local trip history?", isPresented: $clear, titleVisibility: .visible) {
            Button("Delete", role: .destructive) { model.clearTrips() }
        }
    }
}

struct CommunityView: View {
    @EnvironmentObject var model: DriveModel
    let theme: Theme
    @State private var road = ""
    @State private var kind = "Road hazard"
    var body: some View {
        Form {
            Section {
                Text("Only report when safely parked. These are local drafts, not published or verified community alerts.")
                    .font(.caption)
            }
            Section("Share a heads-up") {
                Picker("Type", selection: $kind) {
                    // Speed cameras are warned about from mapped data, not self-reported:
                    // a miscounted user report is a false alert a driver could act on.
                    ForEach(["Road hazard", "Roadworks", "Traffic congestion", "Road bump"], id: \.self) { Text($0).tag($0) }
                }
                TextField("Road or location", text: $road)
                Button("Save local draft") { model.addDraft(road: road, kind: kind); road = "" }
                    .disabled(road.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
            .disabled(model.mode != .idle)
            Section("Your drafts") {
                ForEach(model.drafts) { draft in
                    VStack(alignment: .leading) {
                        Text(draft.kind)
                        Text(draft.road).font(.caption).foregroundStyle(theme.muted)
                    }
                }
                .onDelete(perform: model.deleteDrafts)
            }
        }
        .navigationTitle("Community")
    }
}

struct SettingsView: View {
    @EnvironmentObject var model: DriveModel
    let theme: Theme
    var body: some View {
        Form {
            Section("Appearance") {
                Picker("Theme", selection: $model.appearance) {
                    Text("System").tag("system")
                    Text("Light").tag("light")
                    Text("Dark").tag("dark")
                }
                .pickerStyle(.segmented)
            }
            Section("Alerts") {
                Toggle("Voice alerts", isOn: $model.voice)
                Toggle("Alert tone", isOn: $model.tone)
                Text(model.voice && model.tone ? "Chime, then the spoken warning."
                     : model.voice ? "Spoken warning only."
                     : model.tone ? "Chime only."
                     : "Both off — alerts arrive as a notification only.")
                    .font(.caption).foregroundStyle(theme.muted)
            }
            Section("Country") {
                Picker("Country", selection: Binding(get: { model.country }, set: { model.selectCountry($0) })) {
                    ForEach(DemoData.countries, id: \.self) { Text($0).tag($0) }
                }
                .disabled(model.mode != .idle)
                Text("The bundled pack covers Bahrain. For the rest of the Gulf, every camera comes from OpenStreetMap for the area around you.")
                    .font(.caption).foregroundStyle(theme.muted)
            }
            Section("Data") {
                Text(model.feed).font(.caption)
                Button("Reload pack and cameras") { Task { await model.reload() } }
                Text("Camera positions come from OpenStreetMap, fetched for the area around you and cached on the device. The query carries no identifier. No route is uploaded.")
                    .font(.caption).foregroundStyle(theme.muted)
            }
            Section("Permissions") {
                Button("Open system settings") {
                    if let url = URL(string: UIApplication.openSettingsURLString) { UIApplication.shared.open(url) }
                }
                Text("GPS testing requires precise location. Ending a session stops location updates and releases audio.")
                    .font(.caption).foregroundStyle(theme.muted)
            }
            Section("Privacy") { NavigationLink("Read privacy notice") { PrivacyNotice() } }
            Section("Release status") {
                Text("CarPlay, watchOS, vehicle-triggered startup, subscriptions and internal 3D navigation are not enabled. No account or advertising SDK is active. In an emergency in Bahrain, call 999.")
                    .font(.caption).foregroundStyle(theme.muted)
            }
        }
        .navigationTitle("Settings")
    }
}
