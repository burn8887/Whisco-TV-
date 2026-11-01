package app.salim

import android.content.Context
import app.salim.core.Geo
import app.salim.core.Hazard
import app.salim.core.Kind
import app.salim.core.Point
import android.os.SystemClock
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.util.UUID

data class CommunityReport(
    val id: String,
    val reportType: String,
    val cameraId: String?,
    val country: String,
    val kind: String?,
    val lat: Double?,
    val lon: Double?,
    val road: String,
    val status: String,
    val createdAt: Long,
    val confirmations: Int,
    val disputes: Int
)

object CommunityReports {
    private data class Override(val status: String, val kind: Kind?, val point: Point?, val heading: Double?, val road: String?)
    private data class Overlay(val added: List<Hazard>, val overrides: Map<String, Override>, val fetchedAt: Long)
    private val overlayMutex = Mutex()
    private var overlays = mutableMapOf<String, Overlay>()
    private const val OVERLAY_CACHE_MS = 15 * 60 * 1000L
    private const val INSTALLATION_PREFS = "salim_community"
    private const val INSTALLATION_KEY = "installation_id"

    private fun api(path: String): URL {
        val base = BuildConfig.REPORT_API_URL.trimEnd('/')
        require(base.startsWith("https://") && !base.contains('@')) { "Shared report service is not configured for this build." }
        return URL(base + path)
    }

    private fun installationId(context: Context): String {
        val prefs = context.getSharedPreferences(INSTALLATION_PREFS, Context.MODE_PRIVATE)
        val existing = prefs.getString(INSTALLATION_KEY, null)
        if (existing != null) return existing
        val created = UUID.randomUUID().toString()
        prefs.edit().putString(INSTALLATION_KEY, created).apply()
        return created
    }

    private suspend fun request(context: Context, path: String, method: String = "GET", payload: JSONObject? = null): JSONObject =
        withContext(Dispatchers.IO) {
            val connection = api(path).openConnection() as HttpURLConnection
            try {
                connection.connectTimeout = 8_000
                connection.readTimeout = 8_000
                connection.instanceFollowRedirects = false
                connection.requestMethod = method
                connection.setRequestProperty("Accept", "application/json")
                if (payload != null) {
                    connection.doOutput = true
                    connection.setRequestProperty("Content-Type", "application/json; charset=utf-8")
                    connection.outputStream.use { it.write(payload.toString().toByteArray(Charsets.UTF_8)) }
                }
                val code = connection.responseCode
                val stream = if (code in 200..299) connection.inputStream else connection.errorStream
                val raw = stream?.use { input ->
                    val output = ByteArrayOutputStream()
                    val buffer = ByteArray(4096)
                    while (true) {
                        val count = input.read(buffer)
                        if (count < 0) break
                        require(output.size() + count <= 1_000_000) { "Report response too large" }
                        output.write(buffer, 0, count)
                    }
                    output.toString("UTF-8")
                }.orEmpty()
                val result = if (raw.isBlank()) JSONObject() else JSONObject(raw)
                if (code !in 200..299) throw IllegalStateException(result.optString("error", "Report service returned HTTP $code"))
                result
            } finally {
                connection.disconnect()
            }
        }

    suspend fun pending(context: Context, country: String): List<CommunityReport> {
        require(country in setOf("BH", "SA", "AE", "QA", "KW", "OM"))
        val result = request(context, "/reports?country=$country")
        val rows = result.optJSONArray("reports") ?: return emptyList()
        return (0 until rows.length()).mapNotNull { index ->
            val row = rows.optJSONObject(index) ?: return@mapNotNull null
            CommunityReport(
                id = row.optString("id"),
                reportType = row.optString("report_type"),
                cameraId = row.optString("camera_id").takeUnless { it.isBlank() || it == "null" },
                country = row.optString("country"),
                kind = row.optString("kind").takeUnless { it.isBlank() || it == "null" },
                lat = if (row.isNull("lat")) null else row.optDouble("lat"),
                lon = if (row.isNull("lon")) null else row.optDouble("lon"),
                road = row.optString("road"),
                status = row.optString("status"),
                createdAt = row.optLong("created_at"),
                confirmations = row.optInt("confirmations"),
                disputes = row.optInt("disputes")
            )
        }
    }

    suspend fun applyApproved(context: Context, country: String, baseline: List<Hazard>, around: Point): List<Hazard> {
        if (BuildConfig.REPORT_API_URL.isBlank()) return baseline
        val cached = overlayMutex.withLock { overlays[country]?.takeIf { SystemClock.elapsedRealtime() - it.fetchedAt < OVERLAY_CACHE_MS } }
        val overlay = cached ?: runCatching { fetchOverlay(context, country) }.getOrNull()?.also { fresh ->
            overlayMutex.withLock { overlays[country] = fresh }
        } ?: return baseline
        val adjusted = baseline.mapNotNull { hazard ->
            val change = overlay.overrides[hazard.id] ?: return@mapNotNull hazard
            if (change.status == "REMOVED") return@mapNotNull null
            hazard.copy(kind=change.kind ?: hazard.kind, point=change.point ?: hazard.point,
                heading=change.heading ?: hazard.heading, road=change.road ?: hazard.road,
                expiresAt=Long.MAX_VALUE, demo=false)
        }
        return (adjusted + overlay.added.filter { it.country == country && Geo.distance(it.point, around) <= 25_000 }).distinctBy { it.id }
    }

    private suspend fun fetchOverlay(context: Context, country: String): Overlay {
        val accepted = request(context, "/cameras?country=$country").optJSONArray("cameras")
        val added = (0 until (accepted?.length() ?: 0)).mapNotNull { index ->
            val row = accepted?.optJSONObject(index) ?: return@mapNotNull null
            val kind = kindFrom(row.optString("kind")) ?: return@mapNotNull null
            val point = Point(row.optDouble("lat", Double.NaN), row.optDouble("lon", Double.NaN))
            if (!point.valid()) return@mapNotNull null
            val road = row.optString("road").takeIf { it.isNotBlank() } ?: "Human-reviewed community camera"
            Hazard(row.optString("id"), country, kind, point,
                if (row.isNull("heading")) null else row.optDouble("heading"), road.take(200), Long.MAX_VALUE,
                demo=false, revision=row.optLong("updated_at").coerceAtLeast(0))
        }
        val overrides = run {
            val rows = request(context, "/camera-overrides?country=$country").optJSONArray("overrides")
            (0 until (rows?.length() ?: 0)).mapNotNull { index ->
                val row = rows?.optJSONObject(index) ?: return@mapNotNull null
                val id = row.optString("camera_id")
                if (id.isBlank()) return@mapNotNull null
                val point = if (row.isNull("lat") || row.isNull("lon")) null else Point(row.optDouble("lat"), row.optDouble("lon")).takeIf { it.valid() }
                id to Override(row.optString("status"), kindFrom(row.optString("kind")), point,
                    if (row.isNull("heading")) null else row.optDouble("heading"), row.optString("road").takeIf { it.isNotBlank() })
            }.toMap()
        }
        return Overlay(added, overrides, SystemClock.elapsedRealtime())
    }

    private fun kindFrom(value: String): Kind? = when (value) {
        "SPEED" -> Kind.CAMERA
        "RED_LIGHT" -> Kind.RED_LIGHT
        "SEATBELT" -> Kind.SEATBELT
        else -> null
    }

    suspend fun submitCamera(context: Context, hazard: Hazard, reportType: String): String {
        require(reportType in setOf("VERIFY_PRESENT", "FLAG_REMOVED"))
        require(hazard.kind != Kind.MOBILE_CAMERA) { "Mobile and patrol camera reports are not supported." }
        val body = JSONObject()
            .put("installation_id", installationId(context))
            .put("report_type", reportType)
            .put("camera_id", hazard.id)
            .put("country", hazard.country)
            .put("kind", serverKind(hazard.kind))
            .put("lat", hazard.point.lat)
            .put("lon", hazard.point.lon)
            .put("heading", hazard.heading ?: JSONObject.NULL)
            .put("road", hazard.road)
        return request(context, "/reports", "POST", body).optString("id")
            .also { check(it.isNotBlank()) { "The report service returned no report ID" } }
    }

    suspend fun proposeCamera(context: Context, country: String, kind: String, lat: Double, lon: Double, accuracyM: Double, road: String): String {
        require(country in setOf("BH", "SA", "AE", "QA", "KW", "OM"))
        require(kind in setOf("SPEED", "RED_LIGHT", "SEATBELT"))
        require(lat.isFinite() && lon.isFinite() && lat in -90.0..90.0 && lon in -180.0..180.0)
        require(accuracyM.isFinite() && accuracyM in 1.0..50.0)
        val body = JSONObject()
            .put("installation_id", installationId(context))
            .put("report_type", "ADD_CAMERA")
            .put("country", country)
            .put("kind", kind)
            .put("lat", lat)
            .put("lon", lon)
            .put("accuracy_m", accuracyM)
            .put("road", road.take(120))
        return request(context, "/reports", "POST", body).optString("id")
            .also { check(it.isNotBlank()) { "The report service returned no report ID" } }
    }

    suspend fun vote(context: Context, reportId: String, vote: String) {
        require(reportId.matches(Regex("^[0-9a-fA-F-]{36}$")))
        require(vote in setOf("CONFIRM", "DISPUTE"))
        val body = JSONObject().put("installation_id", installationId(context)).put("vote", vote)
        request(context, "/reports/$reportId/votes", "POST", body)
    }

    private fun serverKind(kind: Kind): String = when (kind) {
        Kind.CAMERA -> "SPEED"
        Kind.RED_LIGHT -> "RED_LIGHT"
        Kind.SEATBELT -> "SEATBELT"
        else -> error("Only fixed camera records can be submitted.")
    }
}
