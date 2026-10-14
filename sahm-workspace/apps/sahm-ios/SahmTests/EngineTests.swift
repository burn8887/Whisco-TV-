import XCTest
@testable import Sahm
final class EngineTests:XCTestCase {
    let now=1_800_000_000.0
    func fix(lat:Double=26.21,course:Double?=0,speed:Double=20,accuracy:Double=5,time:Double?=nil,elapsed:Double=100)->Fix {Fix(point:Point(lat:lat,lon:50.54),speed:speed,course:course,accuracy:accuracy,time:time ?? now,elapsed:elapsed)}
    func hazard(lat:Double=26.214,heading:Double?=0,expires:Double=1_800_003_600)->Hazard {Hazard(id:"test",country:"BH",kind:"CAMERA",point:Point(lat:lat,lon:50.54),heading:heading,road:"Test road",expiresAt:expires)}
    func testDistanceAndHeading() {XCTAssertEqual(Geo.distance(fix().point,hazard().point),444.8,accuracy:1);XCTAssertEqual(Geo.angle(359,1),2)}
    func testWarnsOnce() {let e=AlertEngine();e.replace([hazard()]);XCTAssertNotNil(e.evaluate(fix(),now:now,elapsed:100,country:"BH"));XCTAssertNil(e.evaluate(fix(elapsed:101),now:now,elapsed:101,country:"BH"))}
    func testBadFixesRejected() {for f in [fix(accuracy:51),fix(accuracy:-1),fix(accuracy:.nan),fix(speed:0),fix(course:nil),fix(course:.nan),fix(time:now-16),fix(time:now+3),fix(elapsed:80)] {let e=AlertEngine();e.replace([hazard()]);XCTAssertNil(e.evaluate(f,now:now,elapsed:100,country:"BH"))}}
    func testOppositeBehindExpiry() {for h in [hazard(heading:180),hazard(lat:26.208),hazard(expires:now)] {let e=AlertEngine();e.replace([h]);XCTAssertNil(e.evaluate(fix(),now:now,elapsed:100,country:"BH"))}}
    func testRearmRequiresExitAndCooldown() {let e=AlertEngine();e.replace([hazard()]);XCTAssertNotNil(e.evaluate(fix(),now:now,elapsed:100,country:"BH"));XCTAssertNil(e.evaluate(fix(time:now+200,elapsed:300),now:now+200,elapsed:300,country:"BH"));_ = e.evaluate(fix(lat:26.18,time:now+201,elapsed:301),now:now+201,elapsed:301,country:"BH");XCTAssertNotNil(e.evaluate(fix(time:now+202,elapsed:302),now:now+202,elapsed:302,country:"BH"))}
    func testSectionStoppedTimeAndGap() {
        let entry=Gate(point:Point(lat:26,lon:50),heading:0,halfWidth:15)
        let zone=SectionZone(id:"s",country:"BH",entry:entry,exit:Gate(point:Point(lat:26.001,lon:50),heading:0,halfWidth:15),meters:111.195,limit:80,expiresAt:now+3600)
        func sample(_ m:Double,_ t:Double,_ speed:Double=10,_ course:Double?=0)->Fix {Fix(point:Point(lat:26+m/111195,lon:50),speed:speed,course:course,accuracy:3,time:now+t,elapsed:100+t)}
        let e=SectionEngine([zone]);_ = e.evaluate(sample(-10,0),now:now,elapsed:100,country:"BH")
        XCTAssertEqual(e.evaluate(sample(10,2),now:now+2,elapsed:102,country:"BH").active.first!.kmh,36,accuracy:0.01)
        XCTAssertLessThan(e.evaluate(sample(10,4,0,nil),now:now+4,elapsed:104,country:"BH").active.first!.kmh,36)
        XCTAssertEqual(e.evaluate(sample(20,30),now:now+30,elapsed:130,country:"BH").invalidated,Set(["s"]))
    }
    func testSQLiteRoundTripAndExpiry() async throws {
        let url=FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString+".sqlite")
        defer {try? FileManager.default.removeItem(at:url)}
        let store=try OfflineStore(url:url)
        try await store.seed(DemoData.hazards)
        let values=try await store.nearby(country:"BH",point:DemoData.center,now:now)
        XCTAssertEqual(values.count,4)
        try await store.seed(DemoData.hazards)
        let repeated=try await store.nearby(country:"BH",point:DemoData.center,now:now)
        XCTAssertEqual(repeated.count,4)
        let expired=try await store.nearby(country:"BH",point:DemoData.center,now:DemoData.expiry+1)
        XCTAssertTrue(expired.isEmpty)
    }
}
