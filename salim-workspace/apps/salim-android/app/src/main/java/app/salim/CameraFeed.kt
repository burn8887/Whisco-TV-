package app.salim

import android.content.Context
import android.os.SystemClock
import app.salim.core.Geo
import app.salim.core.Hazard
import app.salim.core.Kind
import app.salim.core.Point
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.util.concurrent.ConcurrentHashMap
import kotlin.math.floor

/**
 * On-demand OpenStreetMap Overpass lookup. This is mapped community data, not an
 * official or complete GCC register; every returned node is marked approximate.
 */
object CameraFeed {
    private const val ENDPOINT = "https://overpass-api.de/api/interpreter"
    private const val RADIUS_METERS = 15_000
    private const val TILE = 20.0 // Coarsen the query centre to ~5.5 km to avoid sending a precise fix.
    private const val CACHE_MS = 15 * 60 * 1000L
    private const val EXPIRY_MS = 6 * 60 * 60 * 1000L
    private data class AreaKey(val z: Int, val y: Int, val country: String)
    private data class Cached(val at: Long, val rows: List<Hazard>)
    private val cache = ConcurrentHashMap<AreaKey, Cached>()
    private val requestedAt = ConcurrentHashMap<AreaKey, Long>()

    suspend fun fetch(@Suppress("UNUSED_PARAMETER") context: Context, point: Point, country: String): List<Hazard> = withContext(Dispatchers.IO) {
        if (!point.valid() || country !in setOf("BH", "SA", "AE", "QA", "KW", "OM")) return@withContext emptyList()
        val snappedLat = (floor(point.lat * TILE) + 0.5) / TILE
        val snappedLon = (floor(point.lon * TILE) + 0.5) / TILE
        val key = AreaKey((snappedLat * TILE).toInt(), (snappedLon * TILE).toInt(), country)
        val now = SystemClock.elapsedRealtime()
        val cached = cache[key]
        if (cached != null && now - cached.at < CACHE_MS) return@withContext near(cached.rows, point)
        val previous = requestedAt[key]
        if (previous != null && now - previous < CACHE_MS) return@withContext cached?.let { near(it.rows, point) }.orEmpty()
        requestedAt[key] = now
        val query = """
            [out:json][timeout:20];
            (
              node(around:$RADIUS_METERS,$snappedLat,$snappedLon)["highway"="speed_camera"];
              node(around:$RADIUS_METERS,$snappedLat,$snappedLon)["enforcement"="maxspeed"];
              node(around:$RADIUS_METERS,$snappedLat,$snappedLon)["camera:type"="red_light"];
              node(around:$RADIUS_METERS,$snappedLat,$snappedLon)["enforcement"="red_light"];
            );out body;
        """.trimIndent()
        try {
            val connection = URL(ENDPOINT).openConnection() as HttpURLConnection
            val rows = try {
                connection.connectTimeout = 10_000
                connection.readTimeout = 25_000
                connection.instanceFollowRedirects = false
                connection.requestMethod = "POST"
                connection.doOutput = true
                connection.setRequestProperty("User-Agent", "Salim/0.7 (https://www.salimdrive.com; support@salimdrive.com)")
                connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=utf-8")
                connection.setRequestProperty("Accept", "application/json")
                connection.outputStream.use { it.write(("data=" + URLEncoder.encode(query, "UTF-8")).toByteArray(Charsets.UTF_8)) }
                check(connection.responseCode == 200) { "Overpass HTTP ${connection.responseCode}" }
                val raw = connection.inputStream.use { input ->
                    val output = ByteArrayOutputStream(); val buffer = ByteArray(8192)
                    while (true) { val count = input.read(buffer); if (count < 0) break; require(output.size() + count <= 2_000_000); output.write(buffer, 0, count) }
                    output.toString("UTF-8")
                }
                decode(JSONObject(raw), country)
            } finally { connection.disconnect() }
            cache[key] = Cached(SystemClock.elapsedRealtime(), rows)
            near(rows, point)
        } catch (_: Exception) {
            cached?.let { near(it.rows, point) }.orEmpty()
        }
    }

    fun near(rows: List<Hazard>, point: Point): List<Hazard> = rows.filter {
        it.expiresAt > System.currentTimeMillis() && Geo.distance(it.point, point) <= 25_000
    }

    /** Country changes remain user-selected until a trusted boundary dataset is available. */
    fun countryAt(@Suppress("UNUSED_PARAMETER") point: Point): String? = null

    private fun decode(root: JSONObject, country: String): List<Hazard> {
        val elements = root.optJSONArray("elements") ?: return emptyList()
        val expiry = System.currentTimeMillis() + EXPIRY_MS
        return (0 until elements.length()).mapNotNull { index ->
            val node = elements.optJSONObject(index) ?: return@mapNotNull null
            if (node.optString("type") != "node") return@mapNotNull null
            val tags = node.optJSONObject("tags") ?: JSONObject()
            val highway = tags.optString("highway")
            val enforcement = tags.optString("enforcement")
            val cameraType = tags.optString("camera:type")
            if (tags.optString("mobile") == "yes" || tags.optString("deployment") == "mobile") return@mapNotNull null
            val kind = when {
                cameraType.equals("red_light", true) || enforcement == "red_light" -> Kind.RED_LIGHT
                cameraType.equals("seatbelt", true) || cameraType.equals("phone", true) -> Kind.SEATBELT
                highway == "speed_camera" || enforcement == "maxspeed" -> Kind.CAMERA
                else -> return@mapNotNull null
            }
            val lat = node.optDouble("lat", Double.NaN); val lon = node.optDouble("lon", Double.NaN)
            if (!lat.isFinite() || !lon.isFinite()) return@mapNotNull null
            val name = tags.optString("name").takeIf { it.isNotBlank() }
                ?: tags.optString("ref").takeIf { it.isNotBlank() }
                ?: "Mapped camera · OpenStreetMap"
            val heading = tags.optString("camera:direction").toDoubleOrNull()?.takeIf { it in 0.0..<360.0 }
            Hazard("osm:node/${node.optLong("id")}", country, kind, Point(lat, lon), heading, name.take(200), expiry, false)
        }
    }
}
