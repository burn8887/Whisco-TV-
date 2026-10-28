package app.salim

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.location.Location
import android.location.LocationManager
import android.util.LruCache
import androidx.core.content.ContextCompat
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.pow

object MapTiles {
    const val ATTRIBUTION = "© OpenStreetMap contributors"
    private const val TILE_SIZE = 256
    private val memory = object : LruCache<String, Bitmap>(12 * 1024) {
        override fun sizeOf(key: String, value: Bitmap): Int = maxOf(1, value.byteCount / 1024)
    }

    fun lastKnown(context: Context): Pair<Double, Double>? {
        val fine = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
        val coarse = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
        if (!fine && !coarse) return null
        return runCatching {
            val manager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
            val locations = listOf(LocationManager.GPS_PROVIDER, LocationManager.NETWORK_PROVIDER, LocationManager.PASSIVE_PROVIDER)
                .mapNotNull { provider -> runCatching { manager.getLastKnownLocation(provider) }.getOrNull() }
                .filter { it.time > 0 && System.currentTimeMillis() - it.time in 0..(6 * 60 * 60 * 1000L) && it.accuracy <= 1000f }
            locations.maxByOrNull(Location::getTime)?.let { it.latitude to it.longitude }
        }.getOrNull()
    }

    fun loadTile(zoom: Int, x: Int, y: Int): Bitmap? {
        val limit = 1 shl zoom
        if (zoom !in 1..19 || y !in 0 until limit) return null
        val wrappedX = ((x % limit) + limit) % limit
        val key = "$zoom/$wrappedX/$y"
        synchronized(memory) { memory.get(key)?.let { return it } }
        val connection = URL("https://tile.openstreetmap.org/$zoom/$wrappedX/$y.png").openConnection() as HttpURLConnection
        return try {
            connection.connectTimeout = 4_000
            connection.readTimeout = 6_000
            connection.instanceFollowRedirects = false
            connection.setRequestProperty("User-Agent", "Salim/0.7 (https://www.salimdrive.com; support@salimdrive.com)")
            connection.setRequestProperty("Accept", "image/png")
            if (connection.responseCode != 200 || connection.contentLengthLong > 600_000) return null
            val bytes = connection.inputStream.use { input ->
                val out = java.io.ByteArrayOutputStream()
                val buffer = ByteArray(8192)
                while (true) { val count = input.read(buffer); if (count < 0) break; if (out.size() + count > 600_000) return null; out.write(buffer, 0, count) }
                out.toByteArray()
            }
            val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size) ?: return null
            if (bitmap.width != TILE_SIZE || bitmap.height != TILE_SIZE) { bitmap.recycle(); return null }
            synchronized(memory) { memory.put(key, bitmap) }
            bitmap
        } catch (_: Exception) { null }
        finally { connection.disconnect() }
    }

    fun worldSize(zoom: Double): Double = TILE_SIZE * 2.0.pow(zoom)
}
