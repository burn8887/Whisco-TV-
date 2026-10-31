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
    @StateObject private var store = Store()
    @StateObject private var adConsent = SalimAdConsent.shared
    @Environment(\.scenePhase) private var phase

    var body: some Scene {
        WindowGroup {
            RootView(appearance: model.appearance)
                .environmentObject(model)
                .environmentObject(store)
                .environmentObject(adConsent)
                .onAppear {
                    if SalimAdConsent.isEnabled { adConsent.refresh() }
                    if store.entitlementsLoaded { model.applyPremiumEntitlement(store.premium) }
                }
                .onChange(of: store.entitlementsLoaded) { _, loaded in
                    if loaded { model.applyPremiumEntitlement(store.premium) }
                }
                .onChange(of: store.premium) { _, active in
                    if store.entitlementsLoaded { model.applyPremiumEntitlement(active) }
                }
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
                        .tabItem { Label(Ar.t("Overview"), systemImage: "square.grid.2x2") }
                    NavigationStack { TripsView() }
                        .tabItem { Label(Ar.t("Trips"), systemImage: "clock.arrow.circlepath") }
                    NavigationStack { CommunityView(theme: theme) }
                        .tabItem { Label(Ar.t("Community"), systemImage: "person.2") }
                    NavigationStack { SettingsView(theme: theme) }
                        .tabItem { Label(Ar.t("Settings"), systemImage: "slider.horizontal.3") }
                }
                .tint(theme.accent)
            }
        }
        .onChange(of: model.mode) { _, value in if value == .idle { minimised = false } }
    }
}

/// The Salim mark, drawn in code so it is crisp at every size: a road receding to the
/// horizon with a camera dot ahead. Same geometry as docs/brand/salim-icon.svg (96-unit grid).
struct SalimMark: View {
    var size: CGFloat = 30
    var body: some View {
        Canvas { context, canvas in
            let s = canvas.width / 96
            func p(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x * s, y: y * s) }
            func line(_ a: CGPoint, _ b: CGPoint, _ width: CGFloat, _ color: Color) {
                var path = Path(); path.move(to: a); path.addLine(to: b)
                context.stroke(path, with: .color(color), style: StrokeStyle(lineWidth: width * s, lineCap: .round))
            }
            context.fill(Path(roundedRect: CGRect(origin: .zero, size: canvas), cornerRadius: 22 * s), with: .color(Color.nightGround))
            line(p(18, 86), p(43, 40), 4, Color(red: 0.957, green: 0.937, blue: 0.902))
            line(p(78, 86), p(53, 40), 4, Color(red: 0.957, green: 0.937, blue: 0.902))
            line(p(48, 82), p(48, 72), 3.5, .signal)
            line(p(48, 63), p(48, 56), 3, .signal)
            line(p(48, 49), p(48, 45), 2.5, .signal)
            context.stroke(Path(ellipseIn: CGRect(x: 37.5 * s, y: 11.5 * s, width: 21 * s, height: 21 * s)),
                           with: .color(Color.warn.opacity(0.55)), lineWidth: 2 * s)
            context.fill(Path(ellipseIn: CGRect(x: 42.5 * s, y: 16.5 * s, width: 11 * s, height: 11 * s)), with: .color(.warn))
        }
        .frame(width: size, height: size)
        .accessibilityHidden(true)
    }
}

/// The lockup: the Salim mark, SALIM in monospaced caps on a hairline.
struct BrandLockup: View {
    let theme: Theme
    var screen: String? = nil
    var body: some View {
        HStack(spacing: 10) {
            SalimMark(size: 30)
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
    @EnvironmentObject var store: Store
    @EnvironmentObject var adConsent: SalimAdConsent
    let theme: Theme
    // Opens on the simulated corridor, so the first frame contains the cameras the
    // demo is about. The first real fix re-centres this immediately.
    @State private var camera = MapCameraPosition.region(
        MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: 26.2335, longitude: 50.5360),
                           span: MKCoordinateSpan(latitudeDelta: 0.045, longitudeDelta: 0.045)))
    @State private var consent = false
    @State private var destination = ""
    @State private var centred = false

    private var cameras: [Hazard] { model.hazards.filter(\.isCamera) }
    private var others: [Hazard] { model.hazards.filter { !$0.isCamera } }

    var body: some View {
        GeometryReader { geometry in
            ScrollView {
                dashboardContent(width: geometry.size.width)
                    .frame(maxWidth: geometry.size.width >= 760 ? 1_280 : 680)
                    .padding(geometry.size.width >= 760 ? 24 : 18)
                    .frame(maxWidth: .infinity, alignment: .top)
            }
            .background(theme.ground)
        }
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
        .alert(Ar.t("Start a drive?"), isPresented: $consent) {
            Button(Ar.t("Start drive")) { model.startGPS() }
            Button(Ar.t("Not now"), role: .cancel) {}
        } message: {
            Text("Set up only while safely parked. Salim uses precise location, speed and heading during a drive, including in the background, until you end it. Camera coverage varies; mapped positions may be incomplete or out of date. No route is uploaded.")
        }
    }

    @ViewBuilder
    private func dashboardContent(width: CGFloat) -> some View {
        if width >= 760 {
            HStack(alignment: .top, spacing: 28) {
                VStack(alignment: .leading, spacing: 14) {
                    statement
                    mapCard(height: min(400, max(300, width * 0.34)))
                    metrics
                    statusAndFeed
                    if let match = model.warning { alertBanner(match) }
                }
                .frame(maxWidth: .infinity, alignment: .topLeading)

                VStack(alignment: .leading, spacing: 14) {
                    adBanner
                    if model.mode == .idle { startRow }
                    if model.mode == .gps && !model.acquired { acquiring }
                    hazardSections
                    destinationSection
                    safetyNote
                }
                .frame(maxWidth: .infinity, alignment: .topLeading)
            }
        } else {
            VStack(alignment: .leading, spacing: 14) {
                statement
                mapCard(height: min(340, max(240, width * 0.72)))
                metrics
                adBanner
                if model.mode == .idle { startRow }
                if model.mode == .gps && !model.acquired { acquiring }
                statusAndFeed
                if let match = model.warning { alertBanner(match) }
                hazardSections
                destinationSection
                safetyNote
            }
        }
    }

    private var adBanner: some View {
        Group {
            if model.mode == .idle && store.entitlementsLoaded && !store.premium && adConsent.canRequestAds {
                SalimAdBanner().frame(height: 50).frame(maxWidth: .infinity)
            }
        }
    }

    private var statusAndFeed: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(model.status).font(.system(size: 12, design: .monospaced)).foregroundStyle(theme.accent)
            Text(model.feed).font(.system(size: 12)).foregroundStyle(theme.muted)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    @ViewBuilder
    private var hazardSections: some View {
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
    }

    private var destinationSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            sectionLabel("DESTINATION")
            TextField(Ar.t("Where are you heading?"), text: $destination)
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
        }
    }

    private var safetyNote: some View {
        Text("Simulation is foreground-only. A GPS test may continue in the background until ended, subject to OS restrictions. This is not a navigation or emergency service.")
            .font(.system(size: 11)).foregroundStyle(theme.muted).lineSpacing(3)
    }

    /// The two ways in. Deliberately not a single "Go" button: a simulation and a real
    /// GPS test make different promises, and the driver should know which one they chose.
    private var startRow: some View {
        VStack(spacing: 8) {
            #if DEBUG
            Button { model.startDemo() } label: {
                Text("START SIMULATION · TEST ONLY")
                    .font(.system(size: 13, weight: .bold, design: .monospaced)).tracking(1)
                    .frame(maxWidth: .infinity).padding(.vertical, 13)
                    .background(theme.accent, in: RoundedRectangle(cornerRadius: 6))
                    .foregroundStyle(theme.onAccent)
            }
            .buttonStyle(.plain)
            .disabled(model.country != "BH")
            #endif

            Button { consent = true } label: {
                Text("START DRIVE")
                    .font(.system(size: 13, weight: .bold, design: .monospaced)).tracking(1)
                    .frame(maxWidth: .infinity).padding(.vertical, 13)
                    .foregroundStyle(theme.ink)
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(theme.line))
            }
            .buttonStyle(.plain)

            if model.country != "BH" {
                Text("Live camera coverage may be incomplete in this area. Follow posted signs.")
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
            Text("CAMERA COVERAGE VARIES · FOLLOW POSTED SIGNS")
                .font(.system(size: 10, design: .monospaced)).tracking(1.1)
                .foregroundStyle(theme.caution)
        }
    }

    private func mapCard(height: CGFloat) -> some View {
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
                .frame(height: height)

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
                Toggle(Ar.t(""), isOn: $model.voice).labelsHidden().tint(theme.accent)
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
        MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: 26.2312, longitude: 50.5330),
                           span: MKCoordinateSpan(latitudeDelta: 0.012, longitudeDelta: 0.012)))

    var body: some View {
        ZStack {
            Map(position: $camera) {
                ForEach(model.hazards.filter(\.isCamera)) { hazard in
                    Annotation("", coordinate: CLLocationCoordinate2D(latitude: hazard.point.lat, longitude: hazard.point.lon)) {
                        CameraMarker(kind: hazard.kind)
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
            // The drive screen is always dark; a bright map glares in a car at night.
            .environment(\.colorScheme, .dark)
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
                        HStack(spacing: 8) {
                            Text(model.mode == .demo ? "SIMULATED DRIVE" : "DRIVE")
                                .font(.system(size: 10, design: .monospaced)).tracking(2).foregroundStyle(Color.signal)
                            if model.mode == .gps { SignalBars(accuracy: model.fix?.accuracy, ready: model.alertReady) }
                        }
                        Text(model.mode == .demo ? "Fictional route · no device GPS" : model.status)
                            .font(.system(size: 11)).foregroundStyle(Color.nightMuted).lineLimit(1)
                    }
                    Spacer()
                    Button { model.voice.toggle() } label: {
                        // 56 pt targets: pressed in a phone holder, at arm's length.
                        Image(systemName: model.voice ? "speaker.wave.2.fill" : "speaker.slash.fill")
                            .foregroundStyle(Color.nightInk).frame(width: 56, height: 56).contentShape(Rectangle())
                    }
                    Button { minimised = true } label: {
                        Image(systemName: "chevron.down").foregroundStyle(Color.nightInk).frame(width: 56, height: 56).contentShape(Rectangle())
                    }
                    Button { model.stop() } label: {
                        Text("END")
                            .font(.system(size: 12, weight: .bold, design: .monospaced)).tracking(0.8)
                            .foregroundStyle(Color(red: 0.1, green: 0.02, blue: 0.01))
                            .padding(.horizontal, 20).frame(minHeight: 52)
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
                    AlertTakeover(match: match, fix: model.fix).padding(.horizontal, 14)
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

/// Full-width drive-screen alert: distance counts down from the live position, and the
/// panel turns red when the driver is over the camera's posted limit (when OSM records one).
struct AlertTakeover: View {
    let match: AlertMatch
    let fix: Fix?
    var body: some View {
        let meters: Double = fix.map { Geo.distance($0.point, match.hazard.point) } ?? match.meters
        let kmh: Int? = fix.map { Int($0.speed * 3.6) }
        let limit: Int? = match.hazard.limit
        let over: Bool = limit != nil && kmh != nil && kmh! > limit!
        let tint: Color = over ? Color.danger : Color.warn
        VStack(alignment: .leading, spacing: 6) {
            Text(match.hazard.title.uppercased())
                .font(.system(size: 13, weight: .bold, design: .monospaced)).tracking(1.6).foregroundStyle(tint)
            HStack(alignment: .center, spacing: 8) {
                Text("\(Int(meters))").font(.system(size: 64, weight: .bold, design: .monospaced)).foregroundStyle(Color.nightInk)
                Text("M").font(.system(size: 18, design: .monospaced)).foregroundStyle(Color.nightMuted)
                Spacer()
                if let limit {
                    Text("\(limit)").font(.system(size: 22, weight: .bold)).foregroundStyle(Color.black)
                        .frame(width: 64, height: 64)
                        .background(Circle().fill(Color.white))
                        .overlay(Circle().stroke(Color(red: 0.843, green: 0.149, blue: 0.118), lineWidth: 6))
                }
            }
            Text(match.hazard.road).font(.system(size: 14)).foregroundStyle(Color.nightInk).lineLimit(1)
            if over, let kmh, let limit {
                Text("SLOW DOWN · \(kmh) KM/H IN A \(limit) ZONE")
                    .font(.system(size: 12, weight: .bold, design: .monospaced)).tracking(1).foregroundStyle(Color.danger)
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.nightSurface.opacity(0.95), in: RoundedRectangle(cornerRadius: 6))
        .overlay(RoundedRectangle(cornerRadius: 6).stroke(tint, lineWidth: 2))
    }
}

/// GPS quality as four bars: ≤10 m, ≤25 m, ≤50 m (alerts live), anything coarser.
struct SignalBars: View {
    let accuracy: Double?
    let ready: Bool
    private var bars: Int {
        guard let a = accuracy else { return 0 }
        return a <= 10 ? 4 : a <= 25 ? 3 : a <= 50 ? 2 : 1
    }
    var body: some View {
        HStack(alignment: .bottom, spacing: 2) {
            ForEach(1...4, id: \.self) { i in
                Rectangle()
                    .fill(i <= bars ? (ready ? Color.signal : Color.warn) : Color.nightLine)
                    .frame(width: 4, height: CGFloat(4 + i * 3))
            }
            Text(accuracy.map { " ±\(Int($0)) m" } ?? " NO FIX")
                .font(.system(size: 10, design: .monospaced)).foregroundStyle(Color.nightMuted)
        }
    }
}

/// Camera marker whose shape carries the type, so it reads without colour: square =
/// seatbelt/phone, diamond = red light, ringed = mobile unit, round = speed camera.
struct CameraMarker: View {
    let kind: String
    var body: some View {
        switch kind {
        case "SEATBELT":
            Image(systemName: "camera.fill").font(.system(size: 10)).foregroundStyle(Color.nightGround)
                .padding(6).background(Color.warn, in: RoundedRectangle(cornerRadius: 2))
        case "RED_LIGHT":
            Image(systemName: "camera.fill").font(.system(size: 10)).foregroundStyle(Color.nightGround)
                .padding(9).background(Color.danger, in: Diamond())
        case "MOBILE_CAMERA":
            Image(systemName: "camera.fill").font(.system(size: 10)).foregroundStyle(Color.warn)
                .padding(6).background(Color.nightGround, in: Circle()).overlay(Circle().stroke(Color.warn, lineWidth: 2))
        default:
            Image(systemName: "camera.fill").font(.system(size: 10)).foregroundStyle(Color.warn)
                .padding(6).background(Color.nightGround, in: Circle())
        }
    }
}

struct Diamond: Shape {
    func path(in r: CGRect) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: r.midX, y: r.minY))
        p.addLine(to: CGPoint(x: r.maxX, y: r.midY))
        p.addLine(to: CGPoint(x: r.midX, y: r.maxY))
        p.addLine(to: CGPoint(x: r.minX, y: r.midY))
        p.closeSubpath()
        return p
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
                ContentUnavailableView(Ar.t("Your next journey starts here"), systemImage: "car",
                                       description: SwiftUI.Text(Ar.t("Start and finish a simulated drive.")))
            }
            ForEach(model.trips) { trip in
                VStack(alignment: .leading, spacing: 6) {
                    Text(trip.interrupted ? "INTERRUPTED" : trip.demo ? "SIMULATED" : "DRIVE")
                        .font(.system(size: 10, design: .monospaced)).tracking(1.2).foregroundStyle(theme.accent)
                    Text(trip.at.formatted()).font(.caption).foregroundStyle(theme.muted)
                    if !trip.interrupted {
                        Text("\(trip.seconds / 60)m \(trip.seconds % 60)s · \(trip.alerts) alerts")
                            .font(.system(size: 13, design: .monospaced))
                    }
                }
            }
            if !model.trips.isEmpty { Button(Ar.t("Delete local history"), role: .destructive) { clear = true } }
        }
        .navigationTitle(Ar.t("Trips"))
        .confirmationDialog(Ar.t("Delete local trip history?"), isPresented: $clear, titleVisibility: .visible) {
            Button(Ar.t("Delete"), role: .destructive) { model.clearTrips() }
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
            Section(Ar.t("Share a heads-up")) {
                Picker(Ar.t("Type"), selection: $kind) {
                    // Speed cameras are warned about from mapped data, not self-reported:
                    // a miscounted user report is a false alert a driver could act on.
                    ForEach(["Road hazard", "Roadworks", "Traffic congestion", "Road bump"], id: \.self) { Text($0).tag($0) }
                }
                TextField(Ar.t("Road or location"), text: $road)
                Button(Ar.t("Save local draft")) { model.addDraft(road: road, kind: kind); road = "" }
                    .disabled(road.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
            .disabled(model.mode != .idle)
            Section(Ar.t("Your drafts")) {
                ForEach(model.drafts) { draft in
                    VStack(alignment: .leading) {
                        Text(draft.kind)
                        Text(draft.road).font(.caption).foregroundStyle(theme.muted)
                    }
                }
                .onDelete(perform: model.deleteDrafts)
            }
        }
        .navigationTitle(Ar.t("Community"))
    }
}

struct SettingsView: View {
    @EnvironmentObject var model: DriveModel
    @EnvironmentObject var store: Store
    @EnvironmentObject var adConsent: SalimAdConsent
    let theme: Theme
    @State private var showPaywall = false

    var body: some View {
        Form {
            Section(Ar.t("Appearance")) {
                Picker(Ar.t("Theme"), selection: $model.appearance) {
                    Text("System").tag("system")
                    Text("Light").tag("light")
                    Text("Dark").tag("dark")
                }
                .pickerStyle(.segmented)
            }
            Section(Ar.t("Alerts")) {
                Toggle(Ar.t("Voice alerts"), isOn: $model.voice)
                Toggle(Ar.t("Alert tone"), isOn: $model.tone)
                Text(model.voice && model.tone ? "Chime, then the spoken warning."
                     : model.voice ? "Spoken warning only."
                     : model.tone ? "Chime only."
                     : "Both off — alerts arrive as a notification only.")
                    .font(.caption).foregroundStyle(theme.muted)
            }
            Section(Ar.t("Country")) {
                Picker(Ar.t("Country"), selection: Binding(get: { model.country }, set: { model.selectCountry($0) })) {
                    ForEach(DemoData.countries, id: \.self) { Text($0).tag($0) }
                }
                .disabled(model.mode != .idle)
                Text("OpenStreetMap volunteers provide mapped speed-camera data nearby; GCC coverage is incomplete and may be out of date. Always follow posted signs.")
                    .font(.caption).foregroundStyle(theme.muted)
            }
            Section(Ar.t("Data")) {
                Text(model.feed).font(.caption)
                Button(Ar.t("Reload pack and cameras")) { Task { await model.reload() } }
                Text("Camera positions come from OpenStreetMap, fetched for the area around you and cached on the device. The query carries no identifier. No route is uploaded.")
                    .font(.caption).foregroundStyle(theme.muted)
            }
            if SalimAdConsent.isEnabled { Section(Ar.t("Advertising")) {
                Text("Google AdMob may show banners on Overview and Settings while no drive is active. Ads never appear on the drive screen. Google's UMP consent flow controls ad requests and provides a privacy-options form where required. The SDK may process device identifiers, IP address and ad interactions under Google's policy; Salim does not provide AdMob with your route or precise GPS for targeting.")
                    .font(.caption).foregroundStyle(theme.muted)
                if store.entitlementsLoaded && !store.premium && adConsent.canRequestAds {
                    SalimAdBanner().frame(height: 50).frame(maxWidth: .infinity)
                }
                if adConsent.privacyOptionsRequired {
                    Button(Ar.t("Advertising privacy choices")) { adConsent.showPrivacyOptions() }
                }
            } }
            Section(Ar.t("Permissions")) {
                Button(Ar.t("Open system settings")) {
                    if let url = URL(string: UIApplication.openSettingsURLString) { UIApplication.shared.open(url) }
                }
                Text("A drive requires precise location. Ending a session stops location updates and releases audio.")
                    .font(.caption).foregroundStyle(theme.muted)
            }
            Section(Ar.t("Salim Premium")) {
                if store.premium {
                    Text("Active. Every warning stays free either way.").font(.caption)
                } else {
                    Button(Ar.t("See Salim Premium")) { showPaywall = true }
                    Text("Optional. Every camera and hazard warning works without it.").font(.caption).foregroundStyle(theme.muted)
                }
                Button(Ar.t("Restore purchases")) { Task { await store.restore() } }
            }
            Section(Ar.t("Privacy")) { NavigationLink(Ar.t("Read privacy notice")) { PrivacyNotice() } }
            Section(Ar.t("Release status")) {
                Text("CarPlay, watchOS, vehicle-triggered startup and internal 3D navigation are not enabled. Camera coverage varies by area; mapped sites can be missing or out of date. In an emergency in Bahrain, call 999.")
                    .font(.caption).foregroundStyle(theme.muted)
            }
        }
        .navigationTitle(Ar.t("Settings"))
        .sheet(isPresented: $showPaywall) { Paywall(theme: theme) }
    }
}
