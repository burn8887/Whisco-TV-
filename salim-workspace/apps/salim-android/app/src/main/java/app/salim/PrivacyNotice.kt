package app.salim

object PrivacyNotice {
    val text="""
        Salim uses camera records from OpenStreetMap and any clearly labelled approximate local pack; coverage varies and is not official. Salim has no account or analytics SDK. The approved shared camera-report service is not yet deployed or configured in this build; Community reports and confirmations cannot currently be sent. When enabled after hosting and privacy checks, the service will require human review.

        LOCATION
        Location is used only during a driver-started session. Salim uses precise location, speed and heading in memory to calculate proximity alerts and section averages. Updates continue while the explicitly started GPS test is active, including in the background. End the drive in Overview or its notification to stop location and speech. OS restrictions or force-stop can interrupt a test. Precise routes are not saved or uploaded by Salim.

        CAMERA REPORTS AND COMMUNITY VERIFICATION
        Reports are optional and can only be sent while the drive is idle. A submission may include the camera's identifier, country, camera type, camera pin, claimed location accuracy and optional road label; it never sends your route or current location as a route. Salim creates a random app-installation identifier so the service can limit duplicate reports and one vote per report; it is pseudonymous and is not proof of your legal identity, device integrity or physical presence. The service stores only a keyed hash of this identifier, not the raw value. Pending camera pins and aggregate confirmations/disputes are visible to other Community users and are clearly marked unverified. They do not affect alerts until a human moderator reviews them. Reports, votes and review history are retained for up to 365 days. Human-approved camera records and overrides may remain until a later reviewed change or removal. The service does not request names, phone numbers or email addresses. The hosting/network provider may process connection metadata such as IP address to deliver or secure the service; Salim's report application does not retain request IPs. If the service is unavailable or not configured, Salim sends no report.

        LOCAL STORAGE AND DELETION
        Voice preferences, the camera pack, trip times/durations/alert counts, report drafts and a random installation identifier are stored locally. Free retains the latest 20 trip summaries; Premium retains trip history without a product-based limit. Report drafts are capped at 100. Delete trip summaries in My trips and drafts in Community. Android app backup is disabled. Unsubmitted local records remain on this device.

        ADVERTISING
        Google Mobile Ads (AdMob) serves banner ads on Overview and Settings while no drive is active. Ads never appear on the drive screen. Google’s User Messaging Platform (UMP) requests consent where required and provides an advertising privacy-options form. Ad requests are sent only when UMP says they are permitted. Google may process device identifiers, IP address and ad interactions under its own privacy policy. Salim does not receive a route or precise GPS coordinates for advertising.

        PURCHASES
        Salim Premium is an optional subscription sold through Google Play. Google processes the payment; Salim never receives or stores a card number, and no purchase is needed for any camera or hazard warning. The app checks the store’s signed subscription entitlement on-device to decide whether to keep unlimited trip history; it does not keep a server-side purchase record. This build does not include a complete verified GCC offline camera pack. Google Play's own privacy policy governs the payment.

        SYSTEM SERVICES
        Opening an external map passes the destination you enter to the selected maps app. The installed text-to-speech engine handles alert speech according to its settings and may use its own network services. Notifications use Android system services. Those services have their own privacy policies.

        COVERAGE AND LIMITATIONS
        Camera records are drawn from OpenStreetMap and any disclosed approximate pack; neither source guarantees completeness or current operation. No police or patrol detection is provided. Unreviewed community reports are not alerts. Do not treat Salim as an official source or as a substitute for posted signs and local law.
    """.trimIndent()
}
