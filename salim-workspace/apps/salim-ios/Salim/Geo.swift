import Foundation

struct Point: Codable, Sendable, Equatable {
    let lat: Double
    let lon: Double
    var valid: Bool { lat.isFinite && lon.isFinite && (-90...90).contains(lat) && (-180...180).contains(lon) }
}
struct Fix: Sendable {
    let point: Point
    let speed: Double
    let course: Double?
    let accuracy: Double
    let time: Double
    let elapsed: Double
}
struct Hazard: Codable, Identifiable, Sendable {
    let id: String
    let country: String
    let kind: String
    let point: Point
    let heading: Double?
    let road: String
    let expiresAt: Double
    /// `exact` or `approximate` for pack rows; nil for live OSM nodes, which are mapped
    /// positions and therefore exact to the node.
    var precision: String? = nil
    /// Posted limit in km/h when the pack records one.
    var limit: Int? = nil
    /// Approximate sites are drawn hollow and marked ≈, because a filled dot claims a
    /// precision the underlying source does not have.
    var approximate: Bool { precision == "approximate" }
    var subtitle: String { limit.map { "\(road) · \($0) km/h" } ?? road }
    var title: String {
        ["CAMERA":"Speed camera","MOBILE_CAMERA":"Mobile camera","SEATBELT":"Seatbelt & phone camera",
         "RED_LIGHT":"Red light camera","ROADWORK":"Roadworks ahead","HAZARD":"Road hazard",
         "TRAFFIC":"Traffic congestion","BUMP":"Road bump"][kind] ?? "Road alert"
    }
    var isCamera: Bool { ["CAMERA","MOBILE_CAMERA","SEATBELT","RED_LIGHT"].contains(kind) }
    func validate() throws {
        guard !id.isEmpty,id.count<=120,DemoData.countries.contains(country),point.valid,expiresAt.isFinite,expiresAt>0,
              ["CAMERA","MOBILE_CAMERA","SEATBELT","RED_LIGHT","ROADWORK","HAZARD","TRAFFIC","BUMP"].contains(kind),!road.isEmpty,road.count<=200,
              heading == nil || (heading!.isFinite && (0..<360).contains(heading!)) else { throw URLError(.cannotParseResponse) }
    }
}
struct AlertMatch { let hazard: Hazard; let meters: Double; let elapsed: Double }
enum Geo {
    static func angle(_ a: Double,_ b: Double) -> Double { abs((a-b+540).truncatingRemainder(dividingBy:360)-180) }
    static func distance(_ a: Point,_ b: Point) -> Double {
        let r=Double.pi/180
        let h=pow(sin((b.lat-a.lat)*r/2),2)+cos(a.lat*r)*cos(b.lat*r)*pow(sin((b.lon-a.lon)*r/2),2)
        return 2*6_371_008.8*asin(sqrt(min(1,max(0,h))))
    }
    static func bearing(_ a: Point,_ b: Point) -> Double {
        let r=Double.pi/180,d=(b.lon-a.lon)*r
        return (atan2(sin(d)*cos(b.lat*r),cos(a.lat*r)*sin(b.lat*r)-sin(a.lat*r)*cos(b.lat*r)*cos(d))/r+360).truncatingRemainder(dividingBy:360)
    }
    /// Alert-grade fix: ±50 m or better, fresh on the monotonic clock, plausible motion.
    /// Freshness uses the monotonic clock only (`now` is kept for callers and expiry).
    static func usable(_ fix: Fix,now: Double,elapsed: Double,accuracy: Double=50) -> Bool {
        fix.point.valid && fix.accuracy.isFinite && fix.accuracy > 0 && fix.accuracy <= accuracy && fix.time.isFinite && fix.elapsed.isFinite &&
        (0...15).contains(elapsed-fix.elapsed) && fix.speed.isFinite && (0...70).contains(fix.speed) &&
        (fix.course == nil || (fix.course!.isFinite && (0..<360).contains(fix.course!)))
    }
    /// Position-grade fix: good enough to show where the driver is (a first satellite fix
    /// or a Wi-Fi/cell fix), never good enough to alert on. Requiring alert-grade accuracy
    /// before showing any position is why the app looked like it never got a fix.
    static func positioned(_ fix: Fix,elapsed: Double,accuracy: Double=1_000) -> Bool {
        fix.point.valid && fix.accuracy.isFinite && fix.accuracy > 0 && fix.accuracy <= accuracy && fix.elapsed.isFinite &&
        (0...30).contains(elapsed-fix.elapsed)
    }
}
final class AlertEngine {
    private var cells: [String:[Hazard]] = [:]
    private var all: [Hazard] = []
    private var seen: [String:(Double,Hazard)] = [:]
    private var previous = -Double.infinity
    func replace(_ hazards: [Hazard]) {
        all=hazards;cells.removeAll()
        for h in hazards { cells["\(Int(floor(h.point.lat*100))):\(Int(floor(h.point.lon*100)))",default:[]].append(h) }
    }
    func reset() { seen.removeAll();previous = -Double.infinity }
    func evaluate(_ fix: Fix,now: Double,elapsed: Double,country: String) -> AlertMatch? {
        guard Geo.usable(fix,now:now,elapsed:elapsed),fix.speed>=2,let course=fix.course,fix.elapsed>previous else { return nil }
        previous=fix.elapsed
        seen=seen.filter { elapsed-$0.value.0<=120 || Geo.distance(fix.point,$0.value.1.point)<=1500 }
        let radius=min(1000,max(400,fix.speed*30))
        var nearby:[Hazard]=[]
        if abs(fix.point.lat)>85 { nearby=all }
        else {
            let dy=radius/110574,dx=radius/(111320*cos(fix.point.lat * .pi/180))
            for lat in Int(floor((fix.point.lat-dy)*100))...Int(floor((fix.point.lat+dy)*100)) {
                for lon in Int(floor((fix.point.lon-dx)*100))...Int(floor((fix.point.lon+dx)*100)) {
                    let wrapped=((lon+18000)%36000+36000)%36000-18000
                    nearby += cells["\(lat):\(wrapped)"] ?? []
                }
            }
        }
        // A live OSM camera is a mapped position: one 500 m ahead is ahead whichever side of an
        // approximate border it sits on. Only non-live rows are country-scoped.
        let candidates=nearby.filter { h in (h.country==country || h.id.hasPrefix("osm:")) && h.expiresAt>now && seen[h.id]==nil && Geo.distance(fix.point,h.point)<=radius && Geo.angle(course,Geo.bearing(fix.point,h.point))<=55 && (h.heading == nil || Geo.angle(course,h.heading!)<=55) }
        guard let h=candidates.min(by:{Geo.distance(fix.point,$0.point)<Geo.distance(fix.point,$1.point)}) else { return nil }
        seen[h.id]=(elapsed,h)
        return AlertMatch(hazard:h,meters:Geo.distance(fix.point,h.point),elapsed:elapsed)
    }
}
struct Gate: Sendable { let point: Point;let heading: Double;let halfWidth: Double }
struct SectionZone: Sendable { let id: String;let country: String;let entry: Gate;let exit: Gate;let meters: Double;let limit: Int;let expiresAt: Double }
struct Average { let id: String;let seconds: Double;let kmh: Double;let limit: Int;let estimated: Bool }
struct SectionResult { var active:[Average]=[];var completed:[Average]=[];var invalidated:Set<String>=[] }
final class SectionEngine {
    private struct Track { let entered: Double;var meters: Double }
    private let zones:[SectionZone]
    private var tracks:[String:Track]=[:]
    private var previous:Fix?
    init(_ zones:[SectionZone]) { self.zones=zones }
    func reset() { tracks.removeAll();previous=nil }
    private func project(_ p: Point,_ g: Gate) -> (Double,Double) {
        let n=(p.lat-g.point.lat)*111195,e=(p.lon-g.point.lon)*111195*cos(g.point.lat * .pi/180),h=g.heading * .pi/180
        return (n*cos(h)+e*sin(h),e*cos(h)-n*sin(h))
    }
    private func crossing(_ a:Point,_ b:Point,_ gate:Gate) -> Double? {
        let p=project(a,gate),q=project(b,gate)
        guard p.0<0,q.0>=0,p.0 != q.0 else { return nil }
        let t = -p.0/(q.0-p.0)
        return abs(p.1+(q.1-p.1)*t)<=gate.halfWidth ? t : nil
    }
    func evaluate(_ fix:Fix,now:Double,elapsed:Double,country:String) -> SectionResult {
        func invalid() -> SectionResult { let ids=Set(tracks.keys);reset();return SectionResult(invalidated:ids) }
        guard Geo.usable(fix,now:now,elapsed:elapsed,accuracy:25) else { return invalid() }
        let prev=previous;previous=fix;guard let p=prev else { return SectionResult() }
        let dt=fix.elapsed-p.elapsed
        guard dt>0,dt<=15,Geo.distance(p.point,fix.point)<=max(100,dt*70) else { return invalid() }
        var result=SectionResult()
        for z in zones {
            var track=tracks[z.id]
            if z.country != country || z.expiresAt<=now || (fix.speed>2 && (fix.course == nil || Geo.angle(fix.course!,z.entry.heading)>100)) || (track != nil && fix.elapsed-track!.entered>7200) {
                if track != nil {result.invalidated.insert(z.id);tracks.removeValue(forKey:z.id)};continue
            }
            var from=0.0
            if track == nil {
                guard fix.speed>=2,let course=fix.course,Geo.angle(course,z.entry.heading)<=55,let entry=crossing(p.point,fix.point,z.entry) else {continue}
                track=Track(entered:p.elapsed+entry*dt,meters:0);from=entry
            }
            guard var active=track else {continue}
            let crossingExit=crossing(p.point,fix.point,z.exit)
            let exit=crossingExit.flatMap { $0>=from ? $0 : nil }
            let to=exit ?? 1
            let v0=p.speed+(fix.speed-p.speed)*from,v1=p.speed+(fix.speed-p.speed)*to
            active.meters+=(v0+v1)/2*dt*(to-from)
            let seconds=p.elapsed+to*dt-active.entered
            if seconds<=0 {tracks[z.id]=active;continue}
            if exit != nil {result.completed.append(Average(id:z.id,seconds:seconds,kmh:z.meters/seconds*3.6,limit:z.limit,estimated:false));tracks.removeValue(forKey:z.id)}
            else {tracks[z.id]=active;result.active.append(Average(id:z.id,seconds:seconds,kmh:active.meters/seconds*3.6,limit:z.limit,estimated:true))}
        }
        return result
    }
}
enum DemoData {
    static let countries=["BH","SA","AE","QA","KW","OM"]
    static let center=Point(lat:26.22,lon:50.55)
    static let expiry=1_893_456_000.0
    #if DEBUG
    static let hazards=[
        Hazard(id:"static:demo-roadwork",country:"BH",kind:"ROADWORK",point:Point(lat:26.2353,lon:50.5655),heading:90,road:"King Faisal Highway",expiresAt:expiry),
        Hazard(id:"static:demo-hazard",country:"BH",kind:"HAZARD",point:Point(lat:26.2003,lon:50.5768),heading:nil,road:"Shaikh Isa bin Salman Highway",expiresAt:expiry)
    ]
    /// Fictional camera on the simulated route, about 50 s in, so the demo fires a real camera alert.
    static let cameras=[Hazard(id:"demo:camera",country:"BH",kind:"CAMERA",point:Point(lat:26.23845,lon:50.53699),heading:25,road:"Demo route (fictional)",expiresAt:expiry,limit:80)]
    static let sections=[SectionZone(id:"demo-section",country:"BH",entry:Gate(point:Point(lat:26.231925,lon:50.533399),heading:26.3,halfWidth:18),exit:Gate(point:Point(lat:26.237725,lon:50.536589),heading:26.3,halfWidth:18),meters:720,limit:80,expiresAt:expiry)]
    #else
    static let hazards:[Hazard]=[]
    static let cameras:[Hazard]=[]
    static let sections:[SectionZone]=[]
    #endif
}
