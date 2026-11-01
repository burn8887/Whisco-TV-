package app.salim

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import org.json.JSONArray

/** Alert sound. Each is synthesised on the device by [ToneSynth]; no audio files ship. */
enum class TonePreset(val label: String) { CHIME("Chime"), PULSE("Pulse"), SONAR("Sonar"), CLASSIC("Classic beep") }

/** How early a camera is announced: speed × seconds, clamped to a distance window. */
enum class Lead(val label: String, val seconds: Double, val min: Double, val max: Double) {
    EARLY("Early", 40.0, 500.0, 1300.0),
    STANDARD("Standard", 30.0, 400.0, 1000.0),
    LATE("Late", 20.0, 300.0, 700.0)
}

/** Which navigation app "Drive & navigate" opens. */
enum class NavApp(val label: String) { GOOGLE_MAPS("Google Maps"), WAZE("Waze"), ASK("Ask each time") }

data class Options(
    val tone: TonePreset = TonePreset.CHIME,
    val voiceName: String? = null,
    val speechRate: Float = 1.0f,
    val countdown: Boolean = true,
    val vibration: Boolean = true,
    val lead: Lead = Lead.STANDARD,
    val overlay: Boolean = false,
    val navApp: NavApp = NavApp.GOOGLE_MAPS,
    val keepScreenOn: Boolean = true,
    val home: String = "",
    val work: String = "",
    val recents: List<String> = emptyList()
)

/** Driver options: alerts, drive view, integrations, saved places. Stored on this device only. */
object AlertPrefs {
    private val state = MutableStateFlow(Options())
    val options: StateFlow<Options> = state.asStateFlow()
    private var store: SharedPreferences? = null

    private inline fun <reified T : Enum<T>> enumOr(name: String?, fallback: T): T =
        runCatching { enumValueOf<T>(name!!) }.getOrDefault(fallback)

    fun init(context: Context) {
        if (store != null) return
        val p = context.applicationContext.getSharedPreferences("salim_options", Context.MODE_PRIVATE)
        store = p
        val recents = runCatching { JSONArray(p.getString("recents", "[]")) }.getOrNull()
            ?.let { a -> (0 until a.length()).mapNotNull { a.optString(it).takeIf { s -> s.isNotBlank() } } } ?: emptyList()
        state.value = Options(
            tone = enumOr(p.getString("tone", null), TonePreset.CHIME),
            voiceName = p.getString("voice", null),
            speechRate = p.getFloat("rate", 1.0f).coerceIn(0.7f, 1.4f),
            countdown = p.getBoolean("countdown", true),
            vibration = p.getBoolean("vibration", true),
            lead = enumOr(p.getString("lead", null), Lead.STANDARD),
            overlay = p.getBoolean("overlay", false),
            navApp = enumOr(p.getString("nav", null), NavApp.GOOGLE_MAPS),
            keepScreenOn = p.getBoolean("screen_on", true),
            home = p.getString("home", "").orEmpty(),
            work = p.getString("work", "").orEmpty(),
            recents = recents.take(5)
        )
    }

    fun update(change: (Options) -> Options) {
        state.update(change)
        val o = state.value
        store?.edit()
            ?.putString("tone", o.tone.name)?.putString("voice", o.voiceName)?.putFloat("rate", o.speechRate)
            ?.putBoolean("countdown", o.countdown)?.putBoolean("vibration", o.vibration)?.putString("lead", o.lead.name)
            ?.putBoolean("overlay", o.overlay)?.putString("nav", o.navApp.name)?.putBoolean("screen_on", o.keepScreenOn)
            ?.putString("home", o.home)?.putString("work", o.work)?.putString("recents", JSONArray(o.recents).toString())
            ?.apply()
    }

    fun remember(destination: String) {
        val d = destination.trim().take(120)
        if (d.isBlank()) return
        update { it.copy(recents = (listOf(d) + it.recents.filterNot { r -> r.equals(d, ignoreCase = true) }).take(5)) }
    }
}
