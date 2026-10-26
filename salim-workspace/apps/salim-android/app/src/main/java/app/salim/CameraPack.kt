package app.salim

import android.content.Context
import app.salim.core.Hazard
import app.salim.core.Kind
import app.salim.core.Point

/**
 * One camera site.
 *
 * `precision` is the honest part of this record. A camera known to a metre and a camera
 * known only to "somewhere on this highway" produce the same alert but not the same
 * claim, so the UI shows the difference rather than flattening it.
 */
data class CameraRecord(
    val id: String,
    val kind: Kind,
    val road: String,
    val point: Point,
    val speedLimit: Int?,
    val heading: Double?,
    val precision: Precision,
    val source: String,
) {
    enum class Precision { EXACT, APPROXIMATE }

    /** Alert copy. Says what it is and how sure we are, in one line. */
    val label: String
        get() {
            val speed = speedLimit?.let { " · $it km/h" } ?: ""
            val prefix = if (precision == Precision.APPROXIMATE) "≈ " else ""
            return "$prefix$road$speed"
        }
}

/**
 * Camera sites loaded from `assets/cameras.csv`.
 *
 * The file is the product's entire camera dataset, deliberately separated from the code:
 * a dataset that can be inspected, corrected and replaced without a rebuild is the only
 * kind that can be kept honest. Rows are validated on load and a malformed row is skipped
 * rather than crashing the drive.
 *
 * Columns: id,kind,lat,lon,road,speed_limit,heading,precision,source
 */
object CameraPack {

    const val ASSET = "cameras.csv"

    /** Bahrain and its immediate approaches. Anything outside is a typo, not a camera. */
    private const val MIN_LAT = 25.60
    private const val MAX_LAT = 26.40
    private const val MIN_LON = 50.20
    private const val MAX_LON = 50.85

    private val records = LinkedHashMap<String, CameraRecord>()
    private var loaded = false

    val all: List<CameraRecord> get() = records.values.toList()
    val count: Int get() = records.size

    /** Metadata for a hazard that came from this pack, or null for the bundled demo pack. */
    fun info(hazardId: String): CameraRecord? = records[hazardId.removePrefix(STATIC_PREFIX)]

    /** The database only accepts seeded rows whose ids begin with this. */
    private const val STATIC_PREFIX = "static:"

    fun load(context: Context) {
        if (loaded) return
        loaded = true
        val text = runCatching {
            context.assets.open(ASSET).bufferedReader().use { it.readText() }
        }.getOrNull() ?: return
        text.lineSequence().forEach { line ->
            parseRow(line)?.let { records[it.id] = it }
        }
    }

    /** Returns null for the header, blank lines, comments and anything malformed. */
    private fun parseRow(line: String): CameraRecord? {
        val trimmed = line.trim()
        if (trimmed.isEmpty() || trimmed.startsWith("#") || trimmed.startsWith("id,")) return null
        val cells = splitCsv(trimmed)
        if (cells.size < 9) return null
        val id = cells[0].trim()
        if (id.isEmpty() || !id.startsWith("camera:")) return null
        val kind = runCatching { Kind.valueOf(cells[1].trim().uppercase()) }.getOrNull() ?: return null
        if (!kind.isCamera) return null
        val lat = cells[2].trim().toDoubleOrNull() ?: return null
        val lon = cells[3].trim().toDoubleOrNull() ?: return null
        if (lat !in MIN_LAT..MAX_LAT || lon !in MIN_LON..MAX_LON) return null
        val road = cells[4].trim().ifEmpty { "Unnamed road" }.take(200)
        val limit = cells[5].trim().toIntOrNull()?.takeIf { it in 30..160 }
        val heading = cells[6].trim().toDoubleOrNull()?.takeIf { it.isFinite() && it >= 0 && it < 360 }
        val precision = when (cells[7].trim().lowercase()) {
            "exact" -> CameraRecord.Precision.EXACT
            else -> CameraRecord.Precision.APPROXIMATE
        }
        val source = cells[8].trim().ifEmpty { "unspecified" }.take(200)
        return CameraRecord(id, kind, road, Point(lat, lon), limit, heading, precision, source)
    }

    /** Minimal CSV split: comma separated, double quotes honoured, no embedded newlines. */
    private fun splitCsv(line: String): List<String> {
        val out = mutableListOf<String>()
        val cell = StringBuilder()
        var quoted = false
        for (ch in line) {
            when {
                ch == '"' -> quoted = !quoted
                ch == ',' && !quoted -> { out.add(cell.toString()); cell.clear() }
                else -> cell.append(ch)
            }
        }
        out.add(cell.toString())
        return out
    }

    /**
     * The same sites as engine hazards, so the existing alert machine handles them with no
     * special case. Ids carry the `static:` prefix the database requires for pack rows.
     */
    fun hazards(): List<Hazard> = records.values.mapNotNull { record ->
        runCatching {
            Hazard(
                id = STATIC_PREFIX + record.id,
                country = "BH",
                kind = record.kind,
                point = record.point,
                heading = record.heading,
                road = record.road,
                expiresAt = DemoData.EXPIRY,
                demo = false,
                revision = 1,
            )
        }.getOrNull()
    }
}
