package app.salim

object PrivacyNotice {
    val text="""
        Salim uses a small, explicitly approximate Bahrain camera pack plus live OpenStreetMap data. Coverage varies; mapped data can be incomplete or out of date. There is no Salim account, analytics SDK or Salim server. Google Play handles subscriptions.

        LOCATION
        Location is used only during a driver-started session. Salim uses precise location, speed and heading in memory to calculate proximity alerts and section averages. Updates continue while the explicitly started GPS test is active, including in the background. End the drive in Overview or its notification to stop location and speech. OS restrictions or force-stop can interrupt a test. Precise routes are not saved or uploaded by Salim.

        LOCAL STORAGE AND DELETION
        Voice preferences, the camera pack, trip times/durations/alert counts and report drafts are stored locally. Free accounts retain the latest 20 trip summaries; Premium retains trip history without a product-based limit. Report drafts are capped at 100. Delete trip summaries in My trips and drafts in Community. Android app backup is disabled. There is no Salim server copy.

        ADVERTISING
        Google Mobile Ads (AdMob) serves banner ads on Overview and Settings while no drive is active. Ads never appear on the drive screen. Google’s User Messaging Platform (UMP) requests consent where required and provides an advertising privacy-options form. Ad requests are sent only when UMP says they are permitted. Google may process device identifiers, IP address and ad interactions under its own privacy policy. Salim does not receive a route or precise GPS coordinates for advertising.

        PURCHASES
        Salim Premium is an optional subscription sold through Google Play. Google processes the payment; Salim never receives or stores a card number, and no purchase is needed for any camera or hazard warning. The app checks the store’s signed subscription entitlement on-device to decide whether to keep unlimited trip history; it does not keep a server-side purchase record. This build does not include a complete verified GCC offline camera pack. Google Play's own privacy policy governs the payment.

        SYSTEM SERVICES
        Opening an external map passes the destination you enter to the selected maps app. The installed text-to-speech engine handles alert speech according to its settings and may use its own network services. Notifications use Android system services. Those services have their own privacy policies.

        COVERAGE AND LIMITATIONS
        Camera records are drawn from OpenStreetMap and the disclosed approximate Bahrain pack; neither source guarantees completeness or current operation. No police or patrol detection is provided. No community draft is published. Do not treat Salim as an official source or as a substitute for posted signs and local law.
    """.trimIndent()
}
