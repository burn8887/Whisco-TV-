import Foundation

/// No verified, redistribution-cleared static GCC camera dataset is bundled.
enum CameraPack {
    static func load() -> [Hazard] {
        // Deliberately empty rather than filling safety alerts with guessed coordinates.
        []
    }
}
