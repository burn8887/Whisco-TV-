import XCTest
@testable import Salim

/// The pack is data, so its reader is the one place where a mistaken row becomes a wrong
/// warning to a driver. These tests pin the rules that keep a bad row from doing that.
final class PackTests:XCTestCase {
    private let header="id,kind,lat,lon,road,speed_limit,heading,precision,source"
    private func row(_ id:String,kind:String,lat:Double=26.2166,lon:Double=50.5846,
                     road:String="Diplomatic Area",limit:String="50",heading:String="",
                     precision:String="approximate")->String {
        "\(id),\(kind),\(lat),\(lon),\(road),\(limit),\(heading),\(precision),test"
    }

    func testParsesApproximateRow() {
        let values=CameraPack.parse([header,row("camera:a","SEATBELT")].joined(separator:"\n"))
        XCTAssertEqual(values.count,1)
        let first=values[0]
        XCTAssertEqual(first.id,"camera:a")
        XCTAssertEqual(first.kind,"SEATBELT")
        XCTAssertEqual(first.country,"BH")
        XCTAssertEqual(first.limit,50)
        XCTAssertNil(first.heading)
        XCTAssertTrue(first.approximate)
        XCTAssertTrue(first.isCamera)
        XCTAssertEqual(first.subtitle,"Diplomatic Area · 50 km/h")
    }

    func testExactRowIsNotMarkedApproximate() {
        let values=CameraPack.parse([header,row("camera:b","CAMERA",heading:"90",precision:"exact")].joined(separator:"\n"))
        XCTAssertEqual(values.count,1)
        XCTAssertFalse(values[0].approximate)
        XCTAssertEqual(values[0].heading,90)
    }

    func testHeaderCommentsAndBlankLinesAreSkipped() {
        let text=["# a comment","",header,row("camera:c","RED_LIGHT"),""].joined(separator:"\n")
        XCTAssertEqual(CameraPack.parse(text).count,1)
    }

    func testMalformedRowsAreDroppedNotFatal() {
        let text=[header,
                  row("camera:d","CAMERA",lat:.nan),
                  "camera:e,CAMERA,not-a-number,50.5,Road,60,,exact,test",
                  "camera:f,CAMERA,26.21",
                  row("camera:g","ROADWORK"),
                  row("","CAMERA")].joined(separator:"\n")
        XCTAssertTrue(CameraPack.parse(text).isEmpty)
    }

    func testRowsOutsideTheGccAreRejected() {
        // London: a genuine camera coordinate, simply not one this product covers.
        let text=[header,row("camera:h","CAMERA",lat:51.5074,lon:-0.1278)].joined(separator:"\n")
        XCTAssertTrue(CameraPack.parse(text).isEmpty)
    }

    func testDuplicateIdsKeepTheFirst() {
        let text=[header,row("camera:i","CAMERA"),row("camera:i","SEATBELT")].joined(separator:"\n")
        let values=CameraPack.parse(text)
        XCTAssertEqual(values.count,1)
        XCTAssertEqual(values[0].kind,"CAMERA")
    }

    func testOutOfRangeLimitAndHeadingAreDiscarded() {
        let text=[header,row("camera:j","CAMERA",limit:"900",heading:"400")].joined(separator:"\n")
        let values=CameraPack.parse(text)
        XCTAssertEqual(values.count,1)
        XCTAssertNil(values[0].limit)
        XCTAssertNil(values[0].heading)
        XCTAssertEqual(values[0].subtitle,"Diplomatic Area")
    }

    /// The file that actually ships must parse, or the app quietly loses its whole pack.
    func testShippedPackParses() throws {
        let here=URL(fileURLWithPath:#filePath).deletingLastPathComponent()
        let file=here.deletingLastPathComponent().appendingPathComponent("Salim/Resources/cameras.csv")
        let text=try String(contentsOf:file,encoding:.utf8)
        let values=CameraPack.parse(text)
        XCTAssertFalse(values.isEmpty,"The shipped pack produced no rows")
        XCTAssertEqual(values.count,Set(values.map(\.id)).count,"Duplicate ids in the shipped pack")
        XCTAssertTrue(values.allSatisfy { $0.country=="BH" },"The bundled pack is Bahrain-only")
        XCTAssertTrue(values.allSatisfy { $0.isCamera })
        XCTAssertTrue(values.contains { $0.kind=="SEATBELT" },"Seatbelt cameras are a stated product requirement")
    }
}
