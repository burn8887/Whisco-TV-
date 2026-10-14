import SwiftUI

struct PrivacyNotice:View {
    var body:some View {
        ScrollView {
            VStack(alignment:.leading,spacing:20) {
                Text("Sahm Demo · Privacy notice").font(.title2.bold())
                Text("This build uses fictional Bahrain alert data. It has no account, advertising, analytics SDK, billing or connected live feed.")
                Text("Location").font(.headline)
                Text("Simulation needs no location permission. A device GPS test uses precise location, speed and heading in memory to calculate nearby demo alerts and section averages. Updates may continue while the test is active in the background. End the test in Overview to stop location and speech. Force-quitting or OS restrictions can interrupt a test. Precise routes are not saved or uploaded by Sahm.")
                Text("Local storage and deletion").font(.headline)
                Text("Sahm saves voice preferences, the demo alert pack, trip times/durations/alert counts and the report drafts you type on this device. Delete trip summaries in My trips and drafts in Community. Device backups may include these local records, subject to your OS settings. There is no Sahm server copy.")
                Text("System services").font(.headline)
                Text("Apple MapKit may request map tiles and related content from Apple. Opening Apple Maps passes the destination you enter. Notifications and text-to-speech use system services and device settings. Their network behavior and privacy policies are separate from Sahm's local alert engine.")
                Text("No live coverage").font(.headline)
                Text("Do not use demo alerts for road-safety decisions. No community draft is published. Adding accounts, verified feeds or subscriptions will require revised disclosures before those integrations are enabled.")
            }.font(.body).padding(20)
        }.navigationTitle("Privacy").navigationBarTitleDisplayMode(.inline)
    }
}
