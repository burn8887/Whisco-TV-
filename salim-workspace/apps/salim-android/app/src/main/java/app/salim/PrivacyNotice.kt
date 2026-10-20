package app.salim

object PrivacyNotice {
    val text="""
        Salim Demo uses fictional Bahrain alert data. This build has no account, advertising, analytics SDK, billing or connected live feed.

        LOCATION
        Simulation needs no location permission. A device GPS test uses precise location, speed and heading in memory to calculate nearby demo alerts and section averages. Updates continue while the explicitly started GPS test is active, including in the background. End the test in Overview or its notification to stop location and speech. OS restrictions or force-stop can interrupt a test. Precise routes are not saved or uploaded by Salim.

        LOCAL STORAGE AND DELETION
        Voice preferences, demo alert packs, trip times/durations/alert counts and the report drafts you type are stored locally. Delete trip summaries in My trips and drafts in Community. Android app backup is disabled. There is no Salim server copy.

        SYSTEM SERVICES
        Opening an external map passes the destination you enter to the selected maps app. The installed text-to-speech engine handles alert speech according to its settings and may use its own network services. Notifications use Android system services. Those services have their own privacy policies.

        NO LIVE COVERAGE
        Do not use demo alerts for road-safety decisions. No community draft is published. If a regional feed is enabled in a later build it will expose a coarse query area to that provider and will require updated disclosures before release.
    """.trimIndent()
}
