import XCTest
@testable import Salim

final class PackTests: XCTestCase {
    func testNoUnverifiedStaticCameraPackIsShipped() {
        XCTAssertTrue(CameraPack.load().isEmpty,
                      "Do not bundle guessed camera coordinates or data without verified redistribution rights.")
    }
}
