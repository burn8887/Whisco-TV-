import SwiftUI

struct RootTabView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Tonight", systemImage: "house.fill") }
            LiveView()
                .tabItem { Label("Live", systemImage: "dot.radiowaves.left.and.right") }
            LibraryView()
                .tabItem { Label("Library", systemImage: "rectangle.stack.fill") }
            YouView()
                .tabItem { Label("You", systemImage: "person.fill") }
        }
        .tint(WhiscoTheme.fg)
        .whiscoScreen()
    }
}
