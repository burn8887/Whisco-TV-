import SwiftUI
import AVFoundation

@main
struct WhiscoTVApp: App {
    @State private var store = LocalStore()

    init() {
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .moviePlayback, options: [.allowAirPlay, .allowBluetooth])
        try? AVAudioSession.sharedInstance().setActive(true)
    }

    var body: some Scene {
        WindowGroup {
            Group {
                if store.onboarded {
                    RootTabView()
                } else {
                    OnboardingView()
                }
            }
            .environment(store)
            .preferredColorScheme(.dark)
            .tint(WhiscoTheme.fg)
        }
    }
}
