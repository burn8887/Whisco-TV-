import SwiftUI

struct PrivacyNotice: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("Salim · Privacy notice").font(.title2.bold())
                Text("Salim has no account or Salim server. It uses locally stored preferences and trip summaries, a small approximate Bahrain camera pack, and live OpenStreetMap data for nearby mapped cameras. Camera coverage is not complete or official.")

                Text("Location").font(.headline)
                Text("Location is used during a drive session that you start. Salim uses precise location, speed and heading in memory to calculate nearby alerts. It does not save or upload your route. When requesting nearby OpenStreetMap camera data, Salim sends a coarse rectangular search area, not a route. Overpass is a shared volunteer service and may log requests under its own policy. End the session to stop location updates and speech; OS restrictions can interrupt a session.")

                Text("Advertising and consent").font(.headline)
                Text("Google Mobile Ads (AdMob) serves banner ads on Overview and Settings only while no drive is active. Ads never appear on the drive screen. Google's User Messaging Platform (UMP) obtains and stores consent choices where required, and Salim provides Google's privacy-options form when required. Salim requests ads only when UMP permits it. The Google Mobile Ads SDK may process device identifiers, IP address, diagnostics and ad interactions under Google's privacy policy. Salim does not provide AdMob with your route or use your precise location for ad targeting.")

                Text("Purchases").font(.headline)
                Text("Salim Premium is an optional auto-renewing subscription handled by Apple. Salim does not receive or store your payment card number. No safety or camera warning is paywalled. Current Premium benefits are unlimited trip history and ad removal; this build does not include a complete verified GCC offline camera pack. Apple's payment and subscription privacy terms apply.")

                Text("Local storage and deletion").font(.headline)
                Text("Voice preferences, the approximate camera pack, trip times/durations/alert counts and report drafts are stored on this device. The free tier retains the latest 20 trip summaries; Premium retains trip history without a product-based limit. Drafts are capped at 100. Delete trip summaries in My trips and drafts in Community. Device backups may include local records under your operating-system settings. There is no Salim server copy.")

                Text("Camera data and limitations").font(.headline)
                Text("Mapped camera data © OpenStreetMap contributors, available under the Open Database Licence. Live queries are limited to a nearby area and cached on this device. Known approximate Bahrain sites are marked with ≈ and a hollow marker. Mapped and approximate positions may be wrong, missing or out of date. Salim is not an official source; follow posted signs and local law. No police or patrol detection is provided.")

                Text("System services").font(.headline)
                Text("Apple MapKit may request map tiles and related content from Apple. Opening Apple Maps passes the destination you enter. Notifications and text-to-speech use system services and device settings; their network behavior and privacy policies are separate from Salim.")
            }
            .font(.body)
            .padding(20)
        }
        .navigationTitle("Privacy")
        .navigationBarTitleDisplayMode(.inline)
    }
}
