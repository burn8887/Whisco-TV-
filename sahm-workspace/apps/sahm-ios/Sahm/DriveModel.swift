import SwiftUI
import CoreLocation
import UserNotifications

enum DriveMode {case idle,demo,gps}
struct Trip:Codable,Identifiable {let id:UUID;let at:Date;let seconds:Int;let alerts:Int;let demo:Bool;let interrupted:Bool}
struct Draft:Codable,Identifiable {let id:UUID;let kind:String;let road:String}
@MainActor final class DriveModel:NSObject,ObservableObject,CLLocationManagerDelegate {
    @Published var mode:DriveMode = .idle
    @Published var country="BH"
    @Published var status="Ready for a simulated drive"
    @Published var feed="Demo data only · Offline pack"
    @Published var hazards:[Hazard]=DemoData.hazards
    @Published var fix:Fix?
    @Published var warning:AlertMatch?
    @Published var average:Average?
    @Published var seconds=0
    @Published var trips:[Trip]=[]
    @Published var drafts:[Draft]=[]
    @Published var voice=UserDefaults.standard.object(forKey:"voice") as? Bool ?? true {didSet{UserDefaults.standard.set(voice,forKey:"voice");if !voice {audio.stop()}}}
    private let manager=CLLocationManager()
    private let engine=AlertEngine()
    private let sections=SectionEngine(DemoData.sections)
    private let audio=AudioAlerts()
    private let database:OfflineStore?
    private var demoTask:Task<Void,Never>?
    private var ticker:Task<Void,Never>?
    private var generation=0
    private var started=0.0
    private var lastGood=0.0
    private var localAt=0.0
    private var alertCount=0
    private var pendingStart=false
    override init() {
        database=try? OfflineStore()
        super.init()
        manager.delegate=self;manager.activityType = .automotiveNavigation
        manager.desiredAccuracy=kCLLocationAccuracyBestForNavigation;manager.distanceFilter=kCLDistanceFilterNone
        manager.pausesLocationUpdatesAutomatically=false;manager.showsBackgroundLocationIndicator=true
        trips=Self.load("trips",fallback:[]);drafts=Self.load("drafts",fallback:[])
        if let date=UserDefaults.standard.object(forKey:"running") as? Date {
            trips.insert(Trip(id:UUID(),at:date,seconds:0,alerts:0,demo:UserDefaults.standard.bool(forKey:"runningDemo"),interrupted:true),at:0)
            UserDefaults.standard.removeObject(forKey:"running");saveTrips();status="Previous session interrupted · Start a new test"
        }
        engine.replace(hazards)
        Task {if let database {try? await database.seed(DemoData.hazards)};await reload()}
    }
    private static func load<T:Decodable>(_ key:String,fallback:T)->T {guard let data=UserDefaults.standard.data(forKey:key),let result=try? JSONDecoder().decode(T.self,from:data) else{return fallback};return result}
    func selectCountry(_ code:String) {guard mode == .idle,DemoData.countries.contains(code) else{return};generation+=1;country=code;hazards=[];engine.reset();engine.replace([]);Task{await reload()}}
    func reload(point:Point?=nil) async {
        let token=generation,code=country
        guard let database else {feed="SQLite unavailable · Bundled demo memory fallback";return}
        do {let values=try await database.nearby(country:code,point:point ?? DemoData.center,now:Date().timeIntervalSince1970);guard token==generation else{return};hazards=values;engine.replace(values);feed=code=="BH" ? "SQLite demo pack · No live feed connected" : "No verified coverage for \(code)"}
        catch {if token==generation {feed="Local read failed · Previous alerts retained"}}
    }
    func startGPS() {
        guard mode == .idle else{return}
        pendingStart=true
        switch manager.authorizationStatus {
        case .notDetermined:manager.requestWhenInUseAuthorization()
        case .authorizedAlways,.authorizedWhenInUse:
            pendingStart=false
            guard manager.accuracyAuthorization == .fullAccuracy else {status="Enable Precise Location before a GPS test";return}
            begin(.gps);manager.allowsBackgroundLocationUpdates=true;manager.startUpdatingLocation()
        default:pendingStart=false;status="Location denied. Demo mode still works; check system permissions for GPS."
        }
    }
    func startDemo() {
        guard mode == .idle,country=="BH" else{return}
        begin(.demo)
        demoTask=Task { [weak self] in
            for step in 0..<75 {
                guard !Task.isCancelled,let self else{return}
                self.receive(Fix(point:Point(lat:26.213+Double(step)*0.000145,lon:50.5433+Double(step)*0.00007975),speed:18,course:25,accuracy:5,time:Date().timeIntervalSince1970,elapsed:ProcessInfo.processInfo.systemUptime))
                try? await Task.sleep(for:.seconds(1))
            }
            self?.stop()
        }
    }
    private func begin(_ value:DriveMode) {
        generation+=1;mode=value;started=ProcessInfo.processInfo.systemUptime;lastGood=started;localAt=0;seconds=0;alertCount=0;warning=nil;average=nil;engine.reset();sections.reset()
        status=value == .demo ? "Simulation · No device GPS" : "Waiting for an accurate GPS fix"
        UserDefaults.standard.set(Date(),forKey:"running");UserDefaults.standard.set(value == .demo,forKey:"runningDemo")
        Task {_ = try? await UNUserNotificationCenter.current().requestAuthorization(options:[.alert,.sound])}
        ticker=Task { [weak self] in
            while !Task.isCancelled {
                try? await Task.sleep(for:.seconds(1));guard !Task.isCancelled,let self else{return}
                let now=ProcessInfo.processInfo.systemUptime
                self.seconds=Int(max(0,now-self.started))
                if let warning=self.warning,now-warning.elapsed>30 {self.warning=nil}
                if now-self.lastGood>15 {self.fix=nil;self.warning=nil;self.average=nil;self.sections.reset();self.audio.stop();self.status="GPS stale · Alerts paused"}
            }
        }
    }
    func stop() {
        guard mode != .idle else{return}
        let trip=Trip(id:UUID(),at:Date(),seconds:Int(max(0,ProcessInfo.processInfo.systemUptime-started)),alerts:alertCount,demo:mode == .demo,interrupted:false)
        generation+=1;manager.stopUpdatingLocation();manager.allowsBackgroundLocationUpdates=false;demoTask?.cancel();ticker?.cancel();demoTask=nil;ticker=nil;audio.stop();sections.reset();engine.reset()
        mode = .idle;pendingStart=false;fix=nil;warning=nil;average=nil;status="Test ended · Saved on this device"
        trips.insert(trip,at:0);saveTrips();UserDefaults.standard.removeObject(forKey:"running")
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers:["sahm.road"])
        UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers:["sahm.road"])
    }
    private func receive(_ sample:Fix) {
        guard mode != .idle else{return}
        let now=Date().timeIntervalSince1970,elapsed=ProcessInfo.processInfo.systemUptime
        guard Geo.usable(sample,now:now,elapsed:elapsed) else {fix=nil;warning=nil;average=nil;sections.reset();audio.stop();status="Weak or stale GPS · Alerts paused";return}
        lastGood=elapsed;fix=sample
        status=mode == .demo ? "Simulation · Demo alerts only" : sample.speed>=2 && sample.course==nil ? "Heading unavailable · Proximity alerts paused" : "GPS test active · Demo data only"
        let result=sections.evaluate(sample,now:now,elapsed:elapsed,country:country);average=result.active.first ?? result.completed.first
        if elapsed-localAt>10 {localAt=elapsed;Task{await reload(point:sample.point)}}
        guard let match=engine.evaluate(sample,now:now,elapsed:elapsed,country:country) else{return}
        warning=match;alertCount+=1
        let message="Demo alert. \(match.hazard.title) in \(Int(match.meters)) meters. Follow actual posted signs."
        if voice {audio.speak(message)}
        if UIApplication.shared.applicationState != .active {
            let content=UNMutableNotificationContent();content.title="Sahm Demo · \(match.hazard.title)";content.body=message;content.sound = .default
            UNUserNotificationCenter.current().add(UNNotificationRequest(identifier:"sahm.road",content:content,trigger:nil))
        }
    }
    func locationManagerDidChangeAuthorization(_ manager:CLLocationManager) {
        if mode == .gps && (manager.accuracyAuthorization != .fullAccuracy || [.denied,.restricted].contains(manager.authorizationStatus)) {stop();status="Location permission changed · GPS test stopped"}
        if pendingStart && [.authorizedAlways,.authorizedWhenInUse].contains(manager.authorizationStatus) {startGPS()}
        else if [.denied,.restricted].contains(manager.authorizationStatus) {pendingStart=false;status="Location permission unavailable · Demo remains available"}
    }
    func locationManager(_ manager:CLLocationManager,didUpdateLocations locations:[CLLocation]) {
        guard mode == .gps,let value=locations.last else{return}
        let now=Date().timeIntervalSince1970
        // Core Location exposes epoch timestamps, so bridge sample age to the monotonic clock.
        receive(Fix(point:Point(lat:value.coordinate.latitude,lon:value.coordinate.longitude),speed:value.speed,course:value.course>=0 ? value.course : nil,accuracy:value.horizontalAccuracy,time:value.timestamp.timeIntervalSince1970,elapsed:ProcessInfo.processInfo.systemUptime-(now-value.timestamp.timeIntervalSince1970)))
    }
    func locationManager(_ manager:CLLocationManager,didFailWithError error:Error) {fix=nil;warning=nil;average=nil;sections.reset();audio.stop();status="GPS unavailable · Alerts paused"}
    func clearTrips() {trips=[];saveTrips()}
    private func saveTrips() {trips=Array(trips.prefix(200));if let data=try? JSONEncoder().encode(trips) {UserDefaults.standard.set(data,forKey:"trips")}}
    func addDraft(road:String,kind:String) {guard mode == .idle,!road.trimmingCharacters(in:.whitespacesAndNewlines).isEmpty else{return};drafts.insert(Draft(id:UUID(),kind:kind,road:String(road.prefix(120))),at:0);saveDrafts()}
    func deleteDrafts(at offsets:IndexSet) {drafts.remove(atOffsets:offsets);saveDrafts()}
    private func saveDrafts() {drafts=Array(drafts.prefix(100));if let data=try? JSONEncoder().encode(drafts) {UserDefaults.standard.set(data,forKey:"drafts")}}
}
