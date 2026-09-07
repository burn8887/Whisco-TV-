import SwiftUI

@main
struct WhiscoTVApp: App {
    @State private var store = LocalStore()

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
        }
    }
}
