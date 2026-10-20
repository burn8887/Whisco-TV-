import SwiftUI
import MapKit

extension Color {
    static let salim=Color(red:0.122,green:0.361,blue:0.278)
    static let canvas=Color(red:0.96,green:0.97,blue:0.94)
}
@main struct SalimApp:App {
    @StateObject private var model=DriveModel()
    @Environment(\.scenePhase) private var phase
    var body:some Scene {
        WindowGroup {
            TabView {
                NavigationStack {Dashboard()}.tabItem{Label("Overview",systemImage:"square.grid.2x2")}
                NavigationStack {TripsView()}.tabItem{Label("My trips",systemImage:"point.bottomleft.forward.to.point.topright.scurvepath")}
                NavigationStack {CommunityView()}.tabItem{Label("Community",systemImage:"person.2")}
                NavigationStack {SettingsView()}.tabItem{Label("Settings",systemImage:"slider.horizontal.3")}
            }.environmentObject(model).tint(.salim)
            .onChange(of:phase) { _,value in if value == .background && model.mode == .demo {model.stop()} }
        }
    }
}
struct Dashboard:View {
    @EnvironmentObject var model:DriveModel
    @State private var camera=MapCameraPosition.region(MKCoordinateRegion(center:CLLocationCoordinate2D(latitude:26.223,longitude:50.565),span:MKCoordinateSpan(latitudeDelta:0.07,longitudeDelta:0.07)))
    @State private var consent=false
    @State private var destination=""
    var body:some View {
        ScrollView {
            VStack(alignment:.leading,spacing:18) {
                Text("AWARE, NOT ALARMED").font(.system(size:9,weight:.semibold)).tracking(1.5).foregroundStyle(Color.salim)
                Text("Know what’s ahead.\nKeep your calm.").font(.system(size:31,weight:.semibold,design:.rounded)).tracking(-1)
                Text("اعرف ما أمامك. قُد بهدوء.").font(.system(size:15)).foregroundStyle(.secondary)
                Text("Fictional alert data · Not for real driving guidance").font(.caption).foregroundStyle(.orange)
                HStack(spacing:12) {metric("AWARENESS",model.mode == .idle ? "Ready to go" : "Test active");metric("LOCAL PACK","\(model.hazards.count) alerts")}
                VStack(spacing:0) {
                    HStack {Label("Your surroundings",systemImage:"map");Spacer();Text("Bahrain demo").font(.caption2).foregroundStyle(.secondary)}.font(.subheadline).padding()
                    Map(position:$camera) {
                        ForEach(model.hazards) {hazard in Annotation(hazard.title,coordinate:CLLocationCoordinate2D(latitude:hazard.point.lat,longitude:hazard.point.lon)) {Image(systemName:hazard.kind == "CAMERA" ? "camera.fill" : "exclamationmark.triangle.fill").font(.caption).padding(9).foregroundStyle(.brown).background(.yellow.opacity(0.3),in:Circle()).overlay(Circle().stroke(.white,lineWidth:3))}}
                        if let sample=model.fix {Annotation(model.mode == .demo ? "Simulated position" : "Device position",coordinate:CLLocationCoordinate2D(latitude:sample.point.lat,longitude:sample.point.lon)) {Image(systemName:"location.north.fill").foregroundStyle(.white).padding(10).background(Color.salim,in:Circle())}}
                    }.mapControls{MapCompass();MapScaleView()}.frame(height:280)
                    HStack {
                        VStack(alignment:.leading) {Text(model.fix.map{"\(Int($0.speed*3.6)) km/h"} ?? "— km/h").font(.title2.weight(.semibold));Text(model.mode == .demo ? "SIMULATED SPEED" : "DEVICE GPS").font(.system(size:8)).foregroundStyle(.secondary)}
                        Spacer();Toggle("Voice alerts",isOn:$model.voice).labelsHidden().accessibilityLabel("Voice alerts")
                    }.padding()
                    Text("MapKit tiles may need internet. Demo camera detection uses local SQLite.").font(.caption2).foregroundStyle(.secondary).padding([.horizontal,.bottom])
                }.background(.white,in:RoundedRectangle(cornerRadius:16))
                if let average=model.average {
                    VStack(alignment:.leading,spacing:8) {Label("DEMO SECTION CONTROL",systemImage:"speedometer").font(.caption2);Text(String(format:"%.1f km/h",average.kmh)).font(.largeTitle.weight(.semibold));Text(average.estimated ? "Estimated GPS average · Includes stopped time" : "Completed · Sample surveyed-length average").font(.caption);Text("Sample limit \(average.limit) km/h. Not an enforcement measurement.").font(.caption2).foregroundStyle(.secondary)}.frame(maxWidth:.infinity,alignment:.leading).padding().background(Color.green.opacity(0.07),in:RoundedRectangle(cornerRadius:14))
                }
                if let match=model.warning {
                    VStack(alignment:.leading,spacing:8) {Text("ON YOUR RADAR · DEMO").font(.caption2);Text(match.hazard.title).font(.title2.weight(.semibold));Text(match.hazard.road).font(.caption);Text("\(Int(match.meters)) m at alert time").font(.headline);Text("Follow actual posted signs.").font(.caption2).foregroundStyle(.secondary)}.frame(maxWidth:.infinity,alignment:.leading).padding().background(Color.yellow.opacity(0.12),in:RoundedRectangle(cornerRadius:14))
                }
                Text(model.status).font(.caption).foregroundStyle(Color.salim)
                Text(model.feed).font(.caption2).foregroundStyle(.secondary)
                if model.mode == .idle {
                    Button {model.startDemo()} label:{Label("Run a simulated drive",systemImage:"play.fill").frame(maxWidth:.infinity).padding(6)}.buttonStyle(.borderedProminent).disabled(model.country != "BH")
                    Button("Start device GPS test") {consent=true}.buttonStyle(.bordered).frame(maxWidth:.infinity)
                } else {Button {model.stop()} label:{Label("End test · \(model.seconds/60)m \(model.seconds%60)s",systemImage:"stop.fill").frame(maxWidth:.infinity).padding(6)}.buttonStyle(.borderedProminent)}
                TextField("Where are you heading?",text:$destination).textFieldStyle(.roundedBorder).disabled(model.mode != .idle)
                Button("Open destination in Apple Maps") {
                    var url=URLComponents(string:"https://maps.apple.com")!;url.queryItems=[URLQueryItem(name:"q",value:destination)]
                    if let value=url.url {UIApplication.shared.open(value)}
                }.disabled(destination.trimmingCharacters(in:.whitespaces).isEmpty || model.mode != .idle)
                Text("Simulation is foreground-only. GPS tests may continue in the background until ended, subject to OS restrictions. This is not a navigation or emergency service.").font(.caption2).foregroundStyle(.secondary).lineSpacing(3)
            }.padding(20)
        }.background(Color.canvas).navigationTitle("salim.").toolbar {Text("DEMO · \(model.country)").font(.caption2).foregroundStyle(Color.salim)}
        .alert("Start a GPS test?",isPresented:$consent) {
            Button("Start GPS test") {model.startGPS()};Button("Not now",role:.cancel){}
        } message:{Text("Set up while safely parked. Salim will use precise location during this test, including in the background, until you end it. Alert data is fictional. Do not use it for road-safety decisions. Precise routes are not uploaded.")}
    }
    private func metric(_ label:String,_ value:String)->some View {VStack(alignment:.leading,spacing:12){Text(label).font(.system(size:9)).foregroundStyle(.secondary);Text(value).font(.system(size:18,weight:.semibold,design:.rounded))}.frame(maxWidth:.infinity,alignment:.leading).padding(16).background(.white,in:RoundedRectangle(cornerRadius:13))}
}
struct TripsView:View {
    @EnvironmentObject var model:DriveModel
    @State private var clear=false
    var body:some View {
        List {
            Text("Summaries remain on this device. Precise routes are not saved.").font(.caption).foregroundStyle(.secondary)
            if model.trips.isEmpty {ContentUnavailableView("Your next journey starts here",systemImage:"car",description:Text("Start and finish a simulated drive."))}
            ForEach(model.trips) {trip in VStack(alignment:.leading,spacing:8){Text(trip.interrupted ? "Interrupted session · Duration unknown" : trip.demo ? "Simulated drive" : "Device GPS test").font(.headline);Text(trip.at.formatted()).font(.caption).foregroundStyle(.secondary);if !trip.interrupted {Text("\(trip.seconds/60)m \(trip.seconds%60)s · \(trip.alerts) alerts").font(.caption)}}}
            if !model.trips.isEmpty {Button("Delete trip history",role:.destructive){clear=true}}
        }.navigationTitle("My trips").confirmationDialog("Delete local trip history?",isPresented:$clear,titleVisibility:.visible){Button("Delete",role:.destructive){model.clearTrips()}}
    }
}
struct CommunityView:View {
    @EnvironmentObject var model:DriveModel
    @State private var road=""
    @State private var kind="Road hazard"
    var body:some View {
        Form {
            Section {Text("Only report when safely parked. These are local drafts, not published or verified community alerts.").font(.caption)}
            Section("Share a heads-up") {Picker("Type",selection:$kind){ForEach(["Road hazard","Roadworks","Speed camera","Traffic congestion"],id:\.self){Text($0).tag($0)}};TextField("Road or location",text:$road);Button("Save local draft"){model.addDraft(road:road,kind:kind);road=""}.disabled(road.trimmingCharacters(in:.whitespacesAndNewlines).isEmpty)}.disabled(model.mode != .idle)
            Section("Your drafts") {ForEach(model.drafts){draft in VStack(alignment:.leading){Text(draft.kind);Text(draft.road).font(.caption).foregroundStyle(.secondary)}}.onDelete(perform:model.deleteDrafts)}
        }.navigationTitle("Community")
    }
}
struct SettingsView:View {
    @EnvironmentObject var model:DriveModel
    var body:some View {
        Form {
            Section("Awareness") {Toggle("Spoken road alerts",isOn:$model.voice);Picker("Country",selection:Binding(get:{model.country},set:{model.selectCountry($0)})){ForEach(DemoData.countries,id:\.self){Text($0).tag($0)}}.disabled(model.mode != .idle);Text("Only Bahrain has a bundled fictional pack. No country has verified coverage in this build.").font(.caption).foregroundStyle(.secondary)}
            Section("Offline pack") {Text(model.feed).font(.caption);Button("Reload local pack"){Task{await model.reload()}};Text("This iOS build is offline demo-only. Live delta-feed integration is not enabled.").font(.caption)}
            Section("Permissions") {Button("Open system settings"){if let url=URL(string:UIApplication.openSettingsURLString){UIApplication.shared.open(url)}};Text("GPS testing requires precise location. Ending a session stops location updates and releases audio. OS force-quit can stop background awareness.").font(.caption)}
            Section("Privacy") {NavigationLink("Read privacy notice") {PrivacyNotice()}}
            Section("Release status") {Text("CarPlay, watchOS, vehicle-triggered startup, subscriptions and internal 3D navigation are not enabled in this build. No account or advertising SDK is active. In an emergency in Bahrain, call 999.").font(.caption).foregroundStyle(.secondary)}
        }.navigationTitle("Settings")
    }
}
