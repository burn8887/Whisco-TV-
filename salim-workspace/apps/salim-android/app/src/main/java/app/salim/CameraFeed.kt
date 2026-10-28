package app.salim

import android.content.Context
import app.salim.core.COUNTRIES
import app.salim.core.Hazard
import app.salim.core.Kind
import app.salim.core.Point
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

/**
 * Live camera data from OpenStreetMap, fetched on the device.
 *
 * Why here rather than baked into the APK: a camera list inside a binary is a snapshot, and
 * a snapshot of enforcement infrastructure is wrong within months. The phone always has a
 * current network, so it asks for the cameras near it and caches the answer.
 *
 * Source is OpenStreetMap, licensed ODbL. Two taggings are read, because OSM has moved:
 *
 *   highway=speed_camera                     the original tagging, still the most common
 *   highway=enforcement + enforcement=maxspeed   the newer scheme
 *
 * Coverage is what volunteer mappers have surveyed — dense on motorways in the UAE and
 * Bahrain, patchier elsewhere. The app never claims more certainty than the coordinate it
 * was given, and a camera is only ever reported where OSM says one exists.
 *
 * Overpass usage policy is respected: one identifying User-Agent, at most one query per
 * area per 30 minutes, a 12 km window, and results cached on disk so a second drive costs
 * nothing.
 */
object CameraFeed {

    private const val ENDPOINT = "https://overpass-api.de/api/interpreter"
    private const val USER_AGENT = "Salim/0.7 (Android; road-awareness; support@salimdrive.com)"

    /** Metres around the driver to ask about. Wider than the alert radius, narrower than a country. */
    private const val RADIUS_M = 12_000.0

    /** Minimum gap between live queries for the same area. Overpass is a shared resource. */
    private const val MIN_INTERVAL_MS = 30 * 60 * 1000L

    private const val PREF = "salim_cameras"
    private const val KEY_LAST = "last_fetch"
    private const val KEY_DATA = "cached"
    private const val AREA_LAT_STEP = 0.12
    private const val AREA_LON_STEP = 0.15

    /**
     * Country boxes as (code, south, west, north, east). Small states are tested before
     * Saudi Arabia, which would otherwise swallow Qatar, Bahrain and the UAE coast.
     */
    private val BOXES = listOf(
        "BH" to doubleArrayOf(25.50, 50.20, 26.40, 50.90),
        "QA" to doubleArrayOf(24.40, 50.70, 26.20, 51.70),
        "KW" to doubleArrayOf(28.50, 46.50, 30.10, 48.50),
        "AE" to doubleArrayOf(22.60, 51.50, 26.10, 56.40),
        "OM" to doubleArrayOf(16.60, 52.00, 26.40, 59.90),
        "SA" to doubleArrayOf(16.00, 34.50, 32.20, 55.70),
    )

    fun countryAt(point: Point): String? = BOXES.firstOrNull { (_, b) ->
        point.lat in b[0]..b[2] && point.lon in b[1]..b[3]
    }?.first?.takeIf { it in COUNTRIES }

    /** Cached OSM rows from all queried GCC areas, with expired entries discarded. */
    fun cached(context: Context, now: Long = System.currentTimeMillis()): List<Hazard> {
        val raw = runCatching { context.getSharedPreferences(PREF, 0).getString(KEY_DATA, null) }.getOrNull()
            ?: return emptyList()
        return runCatching { decode(raw).filter { it.expiresAt > now } }.getOrDefault(emptyList())
    }

    /** Small spatial cells keep throttling local to an area instead of blocking a whole country. */
    fun areaKey(point: Point, country: String = countryAt(point) ?: "outside"): String =
        "$country:${kotlin.math.floor(point.lat / AREA_LAT_STEP).toInt()}:${kotlin.math.floor(point.lon / AREA_LON_STEP).toInt()}"

    /**
     * Cached rows close enough to be about *this* area. The cache persists across drives, and
     * a drive from Manama to Dubai would otherwise keep showing Manama's cameras — caching
     * must not turn yesterday's city into today's false alert.
     */
    fun cachedNear(context: Context, point: Point): List<Hazard> = near(cached(context), point)

    /** The same 25 km bound, applied to rows already held in memory. */
    fun near(rows: List<Hazard>, point: Point, now: Long = System.currentTimeMillis()): List<Hazard> =
        rows.filter { it.expiresAt > now && haversine(point, it.point) <= 25_000 }

    private fun haversine(a: Point, b: Point): Double {
        val r = Math.PI / 180
        val dLat = (b.lat - a.lat) * r
        val dLon = (b.lon - a.lon) * r
        val h = Math.pow(Math.sin(dLat / 2), 2.0) +
            Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.pow(Math.sin(dLon / 2), 2.0)
        return 2 * 6_371_008.8 * Math.asin(Math.sqrt(minOf(1.0, maxOf(0.0, h))))
    }

    private fun decode(raw: String): List<Hazard> {
        val array = org.json.JSONArray(raw)
        return buildList {
            for (i in 0 until array.length()) {
                val o = array.getJSONObject(i)
                runCatching {
                    add(
                        Hazard(
                            id = o.getString("id"),
                            country = o.getString("country"),
                            kind = Kind.valueOf(o.getString("kind")),
                            point = Point(o.getDouble("lat"), o.getDouble("lon")),
                            heading = if (o.has("heading") && !o.isNull("heading")) o.getDouble("heading") else null,
                            road = o.getString("road"),
                            expiresAt = o.getLong("expiresAt"),
                            demo = false,
                            revision = 0,
                        )
                    )
                }
            }
        }
    }

    private fun encode(hazards: List<Hazard>): String {
        val array = org.json.JSONArray()
        hazards.forEach { h ->
            array.put(
                JSONObject()
                    .put("id", h.id).put("country", h.country).put("kind", h.kind.name)
                    .put("lat", h.point.lat).put("lon", h.point.lon)
                    .put("heading", h.heading ?: JSONObject.NULL)
                    .put("road", h.road).put("expiresAt", h.expiresAt)
            )
        }
        return array.toString()
    }

    /**
     * Cameras near a point. Returns cached data when the last query is still fresh, when
     * the device is offline, or when Overpass is unavailable — a missing network must never
     * cost the driver an alert they already had.
     */
    suspend fun fetch(context: Context, point: Point, now: Long = System.currentTimeMillis()): List<Hazard> {
        val country = countryAt(point) ?: return cachedNear(context, point)
        val prefs = context.getSharedPreferences(PREF, 0)
        val area = areaKey(point, country)
        val areaLastKey = "${KEY_LAST}_$area"
        val retryKey = "retry_after_$area"
        val last = prefs.getLong(areaLastKey, 0L)
        if (now - last in 0 until MIN_INTERVAL_MS || now < prefs.getLong(retryKey, 0L)) {
            return cachedNear(context, point)
        }

        val fresh = query(point)
        if (fresh == null) {
            prefs.edit().putLong(retryKey, now + 60_000L).apply()
            return cachedNear(context, point)
        }
        val expiry = now + 30L * 24 * 60 * 60 * 1000
        val mergedById = cached(context, now).associateBy { it.id }.toMutableMap()
        fresh.map { it.copy(expiresAt = expiry) }.forEach { mergedById[it.id] = it }
        val merged = mergedById.values.sortedByDescending { it.expiresAt }.take(5_000)
        // Cache even an empty successful query so the same area is not repeatedly sent to Overpass.
        prefs.edit().putLong(areaLastKey, now).remove(retryKey).putString(KEY_DATA, encode(merged)).apply()
        return near(merged, point)
    }

    private fun box(point: Point): DoubleArray {
        val dLat = RADIUS_M / 111_574.0
        val dLon = RADIUS_M / (111_320.0 * kotlin.math.cos(Math.toRadians(point.lat)).coerceAtLeast(0.05))
        return doubleArrayOf(point.lat - dLat, point.lon - dLon, point.lat + dLat, point.lon + dLon)
    }

    private fun query(point: Point): List<Hazard>? = runCatching {
        val b = box(point)
        // Two taggings, one request. `out body` keeps the payload to the tags we read.
        val body = "[out:json][timeout:25];" +
            "(" +
            "node[\"highway\"=\"speed_camera\"](${b[0]},${b[1]},${b[2]},${b[3]});" +
            "node[\"highway\"=\"enforcement\"][\"enforcement\"~\"^(maxspeed|average_speed|traffic_signals|red_light|seatbelt|seat_belt)$\"](${b[0]},${b[1]},${b[2]},${b[3]});" +
            ");out body;"

        var connection: HttpURLConnection? = null
        try {
            connection = (URL(ENDPOINT).openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                connectTimeout = 12_000
                readTimeout = 25_000
                doOutput = true
                setRequestProperty("User-Agent", USER_AGENT)
                setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
            }
            val payload = "data=" + URLEncoder.encode(body, "UTF-8")
            connection.outputStream.use { it.write(payload.toByteArray()) }
            if (connection.responseCode != HttpURLConnection.HTTP_OK) return@runCatching null
            val text = connection.inputStream.bufferedReader().use { it.readText() }
            parse(text, point)
        } finally {
            runCatching { connection?.disconnect() }
        }
    }.getOrNull()

    /** Also used by the offline importer, so the parsing rules exist in exactly one place. */
    fun parse(text: String, near: Point): List<Hazard> {
        val root = JSONObject(text)
        val elements = root.optJSONArray("elements") ?: return emptyList()
        val out = LinkedHashMap<String, Hazard>()
        for (i in 0 until elements.length()) {
            val element = elements.optJSONObject(i) ?: continue
            if (element.optString("type") != "node") continue
            val id = element.optLong("id", 0L)
            if (id == 0L) continue
            val lat = element.optDouble("lat", Double.NaN)
            val lon = element.optDouble("lon", Double.NaN)
            if (!lat.isFinite() || !lon.isFinite()) continue
            val p = Point(lat, lon)
            if (!p.valid()) continue
            val country = countryAt(p) ?: continue
            val tags = element.optJSONObject("tags") ?: JSONObject()
            val highway = tags.optString("highway")
            val enforcement = tags.optString("enforcement")
            val supportedEnforcement = setOf("maxspeed", "average_speed", "traffic_signals", "red_light", "seatbelt", "seat_belt")
            if (!(highway == "speed_camera" || (highway == "enforcement" && enforcement in supportedEnforcement))) continue
            val road = (tags.optString("name").takeIf { it.isNotBlank() }
                ?: tags.optString("ref").takeIf { it.isNotBlank() }
                ?: "Mapped camera").take(200)
            val heading = tags.optString("direction").toDoubleOrNull()?.takeIf { it in 0.0..359.0 }
            val kind = when {
                enforcement in setOf("traffic_signals", "red_light") -> Kind.RED_LIGHT
                enforcement in setOf("seatbelt", "seat_belt") -> Kind.SEATBELT
                else -> Kind.CAMERA
            }
            val hazard = runCatching {
                Hazard(
                    id = "osm:node/$id",
                    country = country,
                    kind = kind,
                    point = p,
                    heading = heading,
                    road = road,
                    // A live row is refreshed by the next query; this bounds the cache.
                    expiresAt = System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000,
                    demo = false,
                    revision = 0,
                )
            }.getOrNull() ?: continue
            out[hazard.id] = hazard
        }
        return out.values.toList()
    }
}
