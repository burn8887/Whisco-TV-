import SwiftUI

enum WhiscoTheme {
    static let bg = Color(red: 0.039, green: 0.039, blue: 0.059) // #0a0a0f
    static let surface = Color(red: 0.071, green: 0.071, blue: 0.102)
    static let elevated = Color(red: 0.102, green: 0.102, blue: 0.141)
    static let fg = Color(red: 0.957, green: 0.941, blue: 0.918)
    static let muted = Color(red: 0.604, green: 0.580, blue: 0.549)
    static let accent = Color(red: 0.976, green: 0.451, blue: 0.086) // #f97316
    static let accent2 = Color(red: 0.859, green: 0.153, blue: 0.467) // #db2777
    static let live = Color(red: 0.984, green: 0.443, blue: 0.522)
}

extension View {
    func whiscoScreen() -> some View {
        self.background(WhiscoTheme.bg.ignoresSafeArea())
            .foregroundStyle(WhiscoTheme.fg)
    }
}
