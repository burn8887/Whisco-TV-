package app.salim

import android.content.Context
import app.salim.core.Hazard

/** No country-level camera dataset with verified coordinates and redistribution rights is bundled yet. */
data class CameraRecord(val id: String, val label: String, val precision: Precision) {
    enum class Precision { EXACT, APPROXIMATE }
}

object CameraPack {
    private var loaded = false
    private val records = linkedMapOf<String, CameraRecord>()

    @Synchronized
    fun load(@Suppress("UNUSED_PARAMETER") context: Context) {
        if (loaded) return
        // Deliberately empty: importing unverified or guessed coordinates as alerts is unsafe.
        loaded = true
    }

    @Synchronized
    fun hazards(): List<Hazard> = emptyList()

    @Synchronized
    fun info(id: String): CameraRecord? = records[id]
}
