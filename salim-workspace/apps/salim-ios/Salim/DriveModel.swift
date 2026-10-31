import SwiftUI
import CoreLocation
import UserNotifications

enum DriveMode {case idle,demo,gps}
/// Disclosed bundled camera records, resolved once outside the main-actor class.
enum BundledPack {
    static let rows:[Hazard] = CameraPack.load()
}
struct Trip:Codable,Identifiable {let id:UUID;let at:Date;let seconds:Int;let alerts:Int;let demo:Bool;let interrupted:Bool}
struct Draft:Codable,Identifiable {let id:UUID;let kind:String;let road:String}
@MainActor final class DriveModel:NSObject,ObservableObject,CLLocationManagerDelegate {
    @Published var mode:DriveMode = .idle
    @Published var country="BH"
    @Published var status="Ready to start a drive"
    @Published var feed="Waiting for nearby camera data"
    @Published var hazards:[Hazard]=BundledPack.rows
    @Published var fix:Fix?
    @Published var warning:AlertMatch?
    @Published var average:Average?
    @Published var seconds=0
    @Published var trips:[Trip]=[]
    private var premiumEntitlementResolved=false
    private var premiumEntitled=false
    @Published var drafts:[Draft]=[]
    @Published var voice=UserDefaults.standard.object(forKey:"voice") as? Bool ?? true {didSet{UserDefaults.standard.set(voice,forKey:"voice");if !voice {audio.stop()}}}
    @Published var tone=UserDefaults.standard.object(forKey:"tone") as? Bool ?? true {didSet{UserDefaults.standard.set(tone,forKey:"tone")}}
    @Published var appearance=UserDefaults.standard.string(forKey:"appearance") ?? "system" {didSet{UserDefaults.standard.set(appearance,forKey:"appearance")}}
    /// Live cameras from OpenStreetMap for the current area.
    @Published var liveCameras:[Hazard]=[]
    /// False until the first valid fix arrives. Without it the app could only say "stale",
    /// never "still looking", so a cold start read as a failure.
    @Published var acquired=false
    /// True while recent fixes are alert-grade (±50 m). `acquired` means "position known";
    /// this means "alerts are live".
    @Published var alertReady=false
    private let manager=CLLocationManager()
    private let engine=AlertEngine()
    private let sections=SectionEngine([]) // No verified average-speed zones are bundled.
    private let audio=AudioAlerts()
    private let database:OfflineStore?
    private var demoTask:Task<Void,Never>?
    private var ticker:Task<Void,Never>?
    private var generation=0
    private var started=0.0
    private var lastGood=0.0
    private var lastPosition=0.0
    private var previousLocation:CLLocation?
    private var lastCourse:Double?
    private var localAt=0.0
    private var feedAt=0.0
    private var alertCount=0
    private var pendingStart=false
    override init() {
        database=try? OfflineStore()
        super.init()
        manager.delegate=self;manager.activityType = .automotiveNavigation
        manager.desiredAccuracy=kCLLocationAccuracyBestForNavigation;manager.distanceFilter=kCLDistanceFilterNone
        manager.pausesLocationUpdatesAutomatically=false;manager.showsBackgroundLocationIndicator=true
        let savedTrips:[Trip]=Self.load("trips",fallback:[])
        #if DEBUG
        trips=savedTrips
        #else
        trips=savedTrips.filter { !$0.demo }
        #endif
        drafts=Self.load("drafts",fallback:[])
        if let date=UserDefaults.standard.object(forKey:"running") as? Date {
            trips.insert(Trip(id:UUID(),at:date,seconds:0,alerts:0,demo:UserDefaults.standard.bool(forKey:"runningDemo"),interrupted:true),at:0)
            UserDefaults.standard.removeObject(forKey:"running");saveTrips();status="Previous session interrupted · Start a new drive"
        }
        engine.replace(hazards)
        if let last=manager.location?.coordinate {
            liveCameras=CameraFeed.cachedNear(Point(lat:last.latitude,lon:last.longitude))
        }
        Task { [weak self] in
            guard let self else {return}
            if let database {
                try? await database.removeSyntheticDemoRows()
                try? await database.seed(BundledPack.rows)
            }
            await self.reload()
            if let last=self.manager.location?.coordinate {
                self.refreshCameras(Point(lat:last.latitude,lon:last.longitude))
            }
        }
    }
    /// Pack rows plus live cameras. Appended rather than replacing: losing signal between
    /// drives must not cost an alert already held.
    private func merged(_ pack:[Hazard])->[Hazard] {
        var seen=Set<String>();var out:[Hazard]=[]
        // The demo's fictional camera survives the periodic reloads while a simulation runs.
        for hazard in pack+liveCameras+(mode == .demo ? DemoData.cameras : []) where seen.insert(hazard.id).inserted {out.append(hazard)}
        return out
    }
    /// Fetches live cameras without blocking the UI; the list updates on success only.
    func refreshCameras(_ point:Point) {
        let token=generation
        Task { [weak self] in
            guard let self else {return}
            let fetched=await CameraFeed.fetch(near:point)
            guard token==self.generation else {return}
            // A failed fetch keeps what we hold — but only what is still about this area.
            // Keeping last night's city would be a false alert, not a saved one.
            self.liveCameras=fetched.isEmpty
                ? self.liveCameras.filter { $0.expiresAt > Date().timeIntervalSince1970 && Geo.distance($0.point, point) <= 25_000 }
                : fetched
            let combined=self.merged(self.hazards.filter{!$0.id.hasPrefix("osm:")})
            self.hazards=combined;self.engine.replace(combined)
        }
    }
    private static func load<T:Decodable>(_ key:String,fallback:T)->T {guard let data=UserDefaults.standard.data(forKey:key),let result=try? JSONDecoder().decode(T.self,from:data) else{return fallback};return result}
    func selectCountry(_ code:String) {guard mode == .idle,DemoData.countries.contains(code) else{return};generation+=1;country=code;hazards=[];engine.reset();engine.replace([]);Task{await reload()}}
    func reload(point:Point?=nil) async {
        let token=generation,code=country
        guard let database else {feed="SQLite unavailable · Bundled demo memory fallback";return}
        do {let values=try await database.nearby(country:code,point:point ?? DemoData.center,now:Date().timeIntervalSince1970);guard token==generation else{return};let combined=merged(values);hazards=combined;engine.replace(combined)
            let live=liveCameras.count
            feed=code=="BH" ? (live>0 ? "OpenStreetMap · \(live) mapped cameras · coverage varies" : "Live camera coverage varies") : (live>0 ? "OpenStreetMap · \(live) mapped cameras · coverage may be incomplete" : "No bundled pack for \(code) · live coverage may be incomplete")}
        catch {if token==generation {feed="Local read failed · Previous alerts retained"}}
    }
    func startGPS() {
        guard mode == .idle else{return}
        pendingStart=true
        switch manager.authorizationStatus {
        case .notDetermined:manager.requestWhenInUseAuthorization()
        case .authorizedAlways,.authorizedWhenInUse:
            pendingStart=false
            guard manager.accuracyAuthorization == .fullAccuracy else {
                // Approximate location (~3-5 km) can never produce an alert-grade fix, so
                // a drive with it would sit on "Acquiring" forever. Ask for precise
                // location for this session; Info.plist explains why under "Drive".
                status="Precise Location needed for this drive…"
                manager.requestTemporaryFullAccuracyAuthorization(withPurposeKey:"Drive") { [weak self] _ in
                    Task { @MainActor in
                        guard let self else {return}
                        if self.manager.accuracyAuthorization == .fullAccuracy {self.startGPS()}
                        else {self.status="Precise Location is off · Turn it on in Settings › Salim › Location"}
                    }
                }
                return
            }
            begin(.gps);manager.allowsBackgroundLocationUpdates=true;manager.startUpdatingLocation()
        default:pendingStart=false;status="Location denied. Enable location before a drive."
        }
    }
    func startDemo() {
        #if DEBUG
        guard mode == .idle,country=="BH" else{return}
        begin(.demo)
        hazards=merged(hazards);engine.replace(hazards)
        demoTask=Task { [weak self] in
            for step in 0..<75 {
                guard !Task.isCancelled,let self else{return}
                // Synthetic route past DemoData.cameras (debug builds only).
                self.receive(Fix(point:Point(lat:26.2312+Double(step)*0.000145,lon:50.5330+Double(step)*0.00007975),speed:18,course:25,accuracy:5,time:Date().timeIntervalSince1970,elapsed:ProcessInfo.processInfo.systemUptime))
                try? await Task.sleep(for:.seconds(1))
            }
            self?.stop()
        }
        #else
        status="Simulation is unavailable in the store build. Start a live drive instead."
        #endif
    }
    private func begin(_ value:DriveMode) {
        generation+=1;mode=value;started=ProcessInfo.processInfo.systemUptime;lastGood=started;lastPosition=started;previousLocation=nil;lastCourse=nil;localAt=0;feedAt=started-601;seconds=0;alertCount=0;warning=nil;average=nil;engine.reset();sections.reset()
        acquired = value == .demo
        alertReady = value == .demo
        status=value == .demo ? "Test simulation · No device GPS" : "Acquiring GPS…"
        UserDefaults.standard.set(Date(),forKey:"running");UserDefaults.standard.set(value == .demo,forKey:"runningDemo")
        Task {_ = try? await UNUserNotificationCenter.current().requestAuthorization(options:[.alert,.sound])}
        ticker=Task { [weak self] in
            while !Task.isCancelled {
                try? await Task.sleep(for:.seconds(1));guard !Task.isCancelled,let self else{return}
                let now=ProcessInfo.processInfo.systemUptime
                self.seconds=Int(max(0,now-self.started))
                if let warning=self.warning,now-warning.elapsed>30 {self.warning=nil}
                if !self.acquired {
                    // Cold fixes legitimately take 30-60 seconds outdoors; saying "stale"
                    // before the first fix was the bug that made GPS look broken.
                    self.status=self.seconds<25 ? "Acquiring GPS… \(self.seconds)s" : "No fix yet · move near a window or outdoors"
                } else if self.mode == .gps && now-self.lastPosition>15 {
                    // No position of any quality for 15 s: the signal is genuinely gone.
                    self.fix=nil;self.warning=nil;self.average=nil;self.alertReady=false;self.sections.reset();self.audio.stop();self.status="GPS signal lost · Alerts paused"
                } else if self.mode == .gps && self.alertReady && now-self.lastGood>15 {
                    self.alertReady=false;self.average=nil;self.sections.reset()
                    self.status="Weak GPS · ±\(Int(self.fix?.accuracy ?? 0)) m · Alerts paused"
                }
            }
        }
    }
    func stop() {
        guard mode != .idle else{return}
        let trip=Trip(id:UUID(),at:Date(),seconds:Int(max(0,ProcessInfo.processInfo.systemUptime-started)),alerts:alertCount,demo:mode == .demo,interrupted:false)
        generation+=1;manager.stopUpdatingLocation();manager.allowsBackgroundLocationUpdates=false;demoTask?.cancel();ticker?.cancel();demoTask=nil;ticker=nil;audio.stop();sections.reset();engine.reset()
        hazards.removeAll { $0.id.hasPrefix("demo:") };engine.replace(hazards)
        mode = .idle;pendingStart=false;fix=nil;warning=nil;average=nil;acquired=false;alertReady=false;previousLocation=nil;lastCourse=nil;status="Drive ended · Saved on this device"
        trips.insert(trip,at:0);saveTrips();UserDefaults.standard.removeObject(forKey:"running")
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers:["salim.road"])
        UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers:["salim.road"])
    }
    private func receive(_ sample:Fix) {
        guard mode != .idle else{return}
        let now=Date().timeIntervalSince1970,elapsed=ProcessInfo.processInfo.systemUptime
        // Unplaceable samples are ignored; the ticker reports "signal lost" after 15 s.
        guard Geo.positioned(sample,elapsed:elapsed) else {return}
        let precise=Geo.usable(sample,now:now,elapsed:elapsed)
        lastPosition=elapsed;fix=sample;acquired=true;alertReady=precise
        if precise {lastGood=elapsed}
        if let detected=CameraFeed.country(at:sample.point),detected != country {
            country=detected
            hazards=hazards.filter { $0.country==detected }
            engine.replace(hazards)
            localAt=elapsed
            Task { await reload(point:sample.point) }
        }
        status=mode == .demo ? "Simulation · Demo alerts only"
            : !precise ? "Locating · ±\(Int(sample.accuracy)) m · Alerts start when GPS sharpens"
            : sample.speed>=2 && sample.course==nil ? "Heading unavailable · Proximity alerts paused"
            : "GPS locked · ±\(Int(sample.accuracy)) m · Camera coverage varies"
        let result=sections.evaluate(sample,now:now,elapsed:elapsed,country:country);average=result.active.first ?? result.completed.first
        if elapsed-localAt>10 {localAt=elapsed;Task{await reload(point:sample.point)}}
        // One query per area per half hour, run off the drive loop: the next stretch of road
        // may be covered and this is the only moment the app knows where the driver is.
        if elapsed-feedAt>600 {feedAt=elapsed;refreshCameras(sample.point)}
        guard let match=engine.evaluate(sample,now:now,elapsed:elapsed,country:country) else{return}
        warning=match;alertCount+=1
        let message=AudioAlerts.alertText(match.hazard,meters:match.meters,demo:mode == .demo)
        if tone {audio.beep()}
        if voice {audio.speak(message)}
        if UIApplication.shared.applicationState != .active {
            let content=UNMutableNotificationContent();content.title=(mode == .demo ? "Salim Demo · " : "Salim · ")+Ar.t(match.hazard.title);content.body=message;content.sound = .default
            UNUserNotificationCenter.current().add(UNNotificationRequest(identifier:"salim.road",content:content,trigger:nil))
        }
    }
    func locationManagerDidChangeAuthorization(_ manager:CLLocationManager) {
        if mode == .gps && (manager.accuracyAuthorization != .fullAccuracy || [.denied,.restricted].contains(manager.authorizationStatus)) {stop();status="Location permission changed · GPS test stopped"}
        if pendingStart && [.authorizedAlways,.authorizedWhenInUse].contains(manager.authorizationStatus) {startGPS()}
        else if [.denied,.restricted].contains(manager.authorizationStatus) {pendingStart=false;status="Location permission unavailable · Review Settings"}
    }
    func locationManager(_ manager:CLLocationManager,didUpdateLocations locations:[CLLocation]) {
        guard mode == .gps else{return}
        for value in locations where value.horizontalAccuracy > 0 {
            let now=Date().timeIntervalSince1970
            // Core Location reports speed and course as -1 when it has none: always for
            // Wi-Fi/cell fixes, often for the first satellite fixes and when stationary.
            // Forwarding -1 made Geo.usable reject every such fix, so a parked iPhone with
            // a perfectly good position sat on "Acquiring GPS…". Unknown speed is derived
            // from the previous fix, else treated as 0 (stationary).
            let from=previousLocation
            previousLocation=value
            let dt=from.map { value.timestamp.timeIntervalSince($0.timestamp) } ?? 0
            let moved=from.map { value.distance(from:$0) } ?? 0
            let speed:Double
            if value.speed >= 0 {speed=min(value.speed,70)}
            else if dt>=0.5,dt<=10,moved>0,value.horizontalAccuracy<=50 {speed=min(moved/dt,70)}
            else {speed=0}
            var course:Double?=nil
            if value.course >= 0, speed >= 1 {course=value.course}
            else if let from,moved>3,dt<=10,value.horizontalAccuracy<=50 {
                course=Geo.bearing(Point(lat:from.coordinate.latitude,lon:from.coordinate.longitude),Point(lat:value.coordinate.latitude,lon:value.coordinate.longitude))
            } else if speed >= 1 {course=lastCourse}
            if let c=course,!(c.isFinite && (0..<360).contains(c)) {course=nil}
            if course != nil {lastCourse=course}
            // Core Location exposes epoch timestamps, so bridge sample age to the monotonic clock.
            receive(Fix(point:Point(lat:value.coordinate.latitude,lon:value.coordinate.longitude),speed:speed,course:course,accuracy:value.horizontalAccuracy,time:value.timestamp.timeIntervalSince1970,elapsed:ProcessInfo.processInfo.systemUptime-(now-value.timestamp.timeIntervalSince1970)))
        }
    }
    func locationManager(_ manager:CLLocationManager,didFailWithError error:Error) {
        // kCLErrorLocationUnknown is transient ("no fix yet, still trying"); Core Location
        // keeps going. Treating it as a failure is what flashed "GPS unavailable".
        if let code=(error as? CLError)?.code,code == .locationUnknown {return}
        if let code=(error as? CLError)?.code,code == .denied {stop();status="Location permission unavailable · Review Settings";return}
        warning=nil;audio.stop();status="GPS error · Retrying"
    }
    func applyPremiumEntitlement(_ active:Bool) {
        premiumEntitlementResolved=true
        premiumEntitled=active
        if !active { trips=Array(trips.prefix(20));saveTrips() }
    }
    func clearTrips() {trips=[];saveTrips()}
    private func saveTrips() {
        let limit = premiumEntitlementResolved ? (premiumEntitled ? Int.max : 20) : 200
        trips=Array(trips.prefix(limit))
        if let data=try? JSONEncoder().encode(trips) {UserDefaults.standard.set(data,forKey:"trips")}
    }
    func addDraft(road:String,kind:String) {guard mode == .idle,!road.trimmingCharacters(in:.whitespacesAndNewlines).isEmpty else{return};drafts.insert(Draft(id:UUID(),kind:kind,road:String(road.prefix(120))),at:0);saveDrafts()}
    func deleteDrafts(at offsets:IndexSet) {drafts.remove(atOffsets:offsets);saveDrafts()}
    private func saveDrafts() {drafts=Array(drafts.prefix(100));if let data=try? JSONEncoder().encode(drafts) {UserDefaults.standard.set(data,forKey:"drafts")}}
}
