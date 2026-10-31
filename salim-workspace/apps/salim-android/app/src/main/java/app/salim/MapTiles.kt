package app.salim

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.LruCache
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.PI
import kotlin.math.atan
import kotlin.math.cos
import kotlin.math.exp
import kotlin.math.ln
import kotlin.math.tan

/**
 * Web Mercator, the projection every slippy map uses. Tiles are 256px squares addressed
 * by z/x/y, so a latitude and longitude become a pixel inside a world image of
 * 256 * 2^zoom on each side.
 */
object Mercator {
    const val TILE = 256.0
    private const val MAX_LAT = 85.05112878

    fun worldSize(zoom: Int): Double = TILE * (1 shl zoom)

    fun x(lon: Double, zoom: Int): Double = (lon + 180.0) / 360.0 * worldSize(zoom)

    fun y(lat: Double, zoom: Int): Double {
        val clamped = lat.coerceIn(-MAX_LAT, MAX_LAT)
        val rad = Math.toRadians(clamped)
        val n = ln(tan(rad) + 1.0 / cos(rad))
        return (1.0 - n / PI) / 2.0 * worldSize(zoom)
    }

    fun latOf(y: Double, zoom: Int): Double {
        val n = PI - 2.0 * PI * y / worldSize(zoom)
        return Math.toDegrees(atan(0.5 * (exp(n) - exp(-n))))
    }

    fun lonOf(x: Double, zoom: Int): Double = x / worldSize(zoom) * 360.0 - 180.0
}

/**
 * Raster tile loader.
 *
 * Deliberately the OpenStreetMap raster scheme rather than a vector SDK. A vector map
 * engine is a large native dependency whose exact coordinates could not be verified
 * from the environment that wrote this code, and every unverified dependency so far has
 * cost a failed build. Raster tiles need no library at all: they are PNGs, and Compose
 * can draw a PNG. The trade is zoom quality, not correctness.
 *
 * OSM's tile policy requires an identifying User-Agent and modest use. Both are
 * respected: a descriptive agent, an in-memory cache, and at most four parallel fetches.
 */
object MapTiles {
    const val ATTRIBUTION = "© OpenStreetMap contributors"

    private const val USER_AGENT = "Salim/0.7 (Android; road-awareness; support@salimdrive.com)"
    private val semaphore = Semaphore(4)

    // Bounded by bytes rather than entries: tiles are 256x256 of 4 bytes per pixel,
    // so 24 MB holds roughly 100 tiles, which is a few screenfuls either side.
    private val cache = object : LruCache<String, Bitmap>(24 * 1024 * 1024) {
        override fun sizeOf(key: String, value: Bitmap): Int = value.byteCount
    }

    fun cached(zoom: Int, x: Int, y: Int): ImageBitmap? {
        val key = "$zoom/$x/$y"
        return cache.get(key)?.takeUnless { it.isRecycled }?.asImageBitmap()
    }

    /** Fetches one tile, or returns null. Never throws: a missing tile is a blank square. */
    suspend fun load(zoom: Int, x: Int, y: Int): ImageBitmap? {
        val n = 1 shl zoom
        if (x !in 0 until n || y !in 0 until n) return null
        val key = "$zoom/$x/$y"
        cache.get(key)?.takeUnless { it.isRecycled }?.let { return it.asImageBitmap() }
        return semaphore.withPermit {
            // Another coroutine may have filled the cache while this one waited.
            val cached = cache.get(key)?.takeUnless { it.isRecycled }
            if (cached != null) {
                cached.asImageBitmap()
            } else {
                withContext(Dispatchers.IO) {
                    val bytes = fetch(BuildConfig.TILE_URL.replace("{z}", "$zoom").replace("{x}", "$x").replace("{y}", "$y"))
                    val bitmap = if (bytes == null) null
                                 else runCatching { BitmapFactory.decodeByteArray(bytes, 0, bytes.size) }.getOrNull()
                    if (bitmap == null) {
                        null
                    } else {
                        cache.put(key, bitmap)
                        bitmap.asImageBitmap()
                    }
                }
            }
        }
    }

    private fun fetch(url: String): ByteArray? {
        var connection: HttpURLConnection? = null
        return try {
            connection = (URL(url).openConnection() as HttpURLConnection).apply {
                connectTimeout = 8_000
                readTimeout = 8_000
                instanceFollowRedirects = true
                setRequestProperty("User-Agent", USER_AGENT)
                setRequestProperty("Accept", "image/png")
            }
            if (connection.responseCode == HttpURLConnection.HTTP_OK) connection.inputStream.use { it.readBytes() } else null
        } catch (_: Exception) {
            null
        } finally {
            runCatching { connection?.disconnect() }
        }
    }

    /**
     * Last known position from the system. Used to centre the map before a drive starts,
     * so the app opens on the driver's street instead of a hard-coded city centre.
     * Returns null when permission has not been granted or the device has no cache.
     */
    fun lastKnown(context: Context): Pair<Double, Double>? {
        return try {
            val manager = context.getSystemService(android.location.LocationManager::class.java)
            if (manager == null) {
                null
            } else {
                val providers = listOf(
                    android.location.LocationManager.GPS_PROVIDER,
                    android.location.LocationManager.NETWORK_PROVIDER,
                    android.location.LocationManager.PASSIVE_PROVIDER
                )
                val candidates = providers.mapNotNull { provider ->
                    try {
                        if (manager.isProviderEnabled(provider)) manager.getLastKnownLocation(provider) else null
                    } catch (_: SecurityException) {
                        null
                    }
                }
                candidates.maxByOrNull { it.time }?.let { it.latitude to it.longitude }
            }
        } catch (_: Exception) {
            null
        }
    }
}
