package app.salim

import android.content.Context
import app.salim.core.Hazard
import app.salim.core.Kind
import app.salim.core.Point
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

/** One downloaded country pack. */
data class PackInfo(val country: String, val count: Int, val updatedAt: Long)

/**
 * Premium: every mapped camera in a GCC country, downloaded once over Wi-Fi or data and kept
 * on the phone, so alerts keep working with no signal (tunnels, desert roads, roaming).
 * Built from OpenStreetMap's own country boundary in a single request; refresh any time.
 */
object OfflinePacks {
    val countries = listOf("BH" to "Bahrain", "SA" to "Saudi Arabia", "AE" to "United Arab Emirates", "QA" to "Qatar", "KW" to "Kuwait", "OM" to "Oman")
    private val state = MutableStateFlow<Map<String, PackInfo>>(emptyMap())
    val packs: StateFlow<Map<String, PackInfo>> = state.asStateFlow()
    private val busyState = MutableStateFlow<Set<String>>(emptySet())
    val busy: StateFlow<Set<String>> = busyState.asStateFlow()
    private val loaded = HashMap<String, List<Hazard>>()
    private var dir: File? = null

    fun init(context: Context) {
        if (dir != null) return
        val d = File(context.filesDir, "packs").apply { mkdirs() }
        dir = d
        val info = HashMap<String, PackInfo>()
        countries.forEach { (code, _) ->
            val file = File(d, "$code.json")
            if (!file.exists()) return@forEach
            runCatching {
                val o = JSONObject(file.readText())
                val list = rows(o.getJSONArray("cameras"))
                loaded[code] = list
                info[code] = PackInfo(code, list.size, o.optLong("updatedAt"))
            }
        }
        state.value = info
    }

    /** Cameras from the downloaded pack for this country (empty when none). */
    fun cameras(country: String?): List<Hazard> = country?.let { loaded[it] }.orEmpty()

    suspend fun download(context: Context, code: String): Result<Int> = withContext(Dispatchers.IO) {
        init(context)
        busyState.update { it + code }
        try {
            runCatching {
                val q = "[out:json][timeout:90];area[\"ISO3166-1\"=\"$code\"][\"admin_level\"=\"2\"]->.c;(" +
                    "node[\"highway\"=\"speed_camera\"](area.c);" +
                    "node[\"highway\"=\"enforcement\"][\"enforcement\"~\"^(maxspeed|average_speed|traffic_signals|red_light|seatbelt|seat_belt)$\"](area.c););out body;"
                val c = (URL(BuildConfig.OVERPASS_URL).openConnection() as HttpURLConnection).apply {
                    requestMethod = "POST"; connectTimeout = 15_000; readTimeout = 95_000; doOutput = true
                    setRequestProperty("User-Agent", "Salim/0.8 (offline pack; support@salimdrive.com)")
                    setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
                }
                try {
                    c.outputStream.use { it.write(("data=" + URLEncoder.encode(q, "UTF-8")).toByteArray()) }
                    check(c.responseCode == HttpURLConnection.HTTP_OK) { "HTTP ${c.responseCode}" }
                    val text = c.inputStream.bufferedReader().use { it.readText() }
                    val far = System.currentTimeMillis() + 120L * 24 * 60 * 60 * 1000
                    val list = CameraFeed.parse(text, Point(0.0, 0.0)).map { it.copy(country = code, expiresAt = far) }
                    val now = System.currentTimeMillis()
                    val a = JSONArray()
                    list.forEach { h ->
                        a.put(JSONObject().put("id", h.id).put("kind", h.kind.name).put("lat", h.point.lat).put("lon", h.point.lon)
                            .put("heading", h.heading ?: JSONObject.NULL).put("road", h.road).put("expiresAt", h.expiresAt)
                            .put("limit", h.limit ?: JSONObject.NULL).put("country", code))
                    }
                    File(dir, "$code.json").writeText(JSONObject().put("updatedAt", now).put("cameras", a).toString())
                    loaded[code] = list
                    state.update { it + (code to PackInfo(code, list.size, now)) }
                    list.size
                } finally { runCatching { c.disconnect() } }
            }
        } finally { busyState.update { it - code } }
    }

    fun remove(code: String) {
        dir?.let { File(it, "$code.json").delete() }
        loaded.remove(code)
        state.update { it - code }
    }

    private fun rows(a: JSONArray): List<Hazard> = (0 until a.length()).mapNotNull { i ->
        val o = a.optJSONObject(i) ?: return@mapNotNull null
        runCatching {
            Hazard(
                id = o.getString("id"), country = o.getString("country"), kind = Kind.valueOf(o.getString("kind")),
                point = Point(o.getDouble("lat"), o.getDouble("lon")),
                heading = if (o.isNull("heading")) null else o.getDouble("heading"),
                road = o.getString("road"), expiresAt = o.getLong("expiresAt"), demo = false, revision = 0,
                limit = if (o.isNull("limit")) null else o.getInt("limit")
            )
        }.getOrNull()
    }
}
