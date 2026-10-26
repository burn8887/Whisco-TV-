package app.salim

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import kotlin.math.floor
import kotlin.math.pow

/** A camera or other point rendered on the map. `exact=false` draws a hollow ring. */
data class MapPin(val lat: Double, val lon: Double, val label: String, val exact: Boolean = true)

/**
 * A slippy map drawn directly into a Compose canvas.
 *
 * Tiles are fetched for the integer zoom below the current camera, then scaled, which
 * keeps one code path for every zoom and avoids re-fetching during a pinch. When a tile
 * is missing the road-grid fallback shows through, so an offline phone degrades to the
 * illustration rather than to a blank rectangle.
 */
@Composable
fun OsmMap(
    centerLat: Double,
    centerLon: Double,
    zoom: Float,
    modifier: Modifier = Modifier,
    markerLat: Double? = null,
    markerLon: Double? = null,
    accent: Color = Color(0xFF4ADE9B),
    surface: Color = Color(0xFF0A0D0B),
    grid: Color = Color(0xFF1E2A23),
    interactive: Boolean = true,
    pins: List<MapPin> = emptyList(),
    onCameraMove: (Double, Double, Float) -> Unit = { _, _, _ -> },
) {
    val scope = rememberCoroutineScope()
    val tiles = remember { mutableStateMapOf<String, ImageBitmap>() }
    val failed = remember { mutableStateMapOf<String, Boolean>() }

    // The camera. Seeded from the caller and updated by gestures, then reported back so
    // a "follow me" caller can choose to stop following once the user pans away.
    var lat by remember { mutableStateOf(centerLat) }
    var lon by remember { mutableStateOf(centerLon) }
    var camZoom by remember { mutableStateOf(zoom) }
    var width by remember { mutableStateOf(0) }
    var height by remember { mutableStateOf(0) }

    // Re-centre when the caller's centre genuinely moves, but not on every recomposition.
    LaunchedEffect(centerLat, centerLon) {
        if (markerLat != null && markerLon != null) {
            val dLat = kotlin.math.abs(centerLat - lat)
            val dLon = kotlin.math.abs(centerLon - lon)
            if (dLat > 1e-6 || dLon > 1e-6) { lat = centerLat; lon = centerLon }
        } else {
            lat = centerLat; lon = centerLon
        }
    }
    LaunchedEffect(zoom) { camZoom = zoom }

    val tileZoom = camZoom.toInt().coerceIn(3, 18)
    val scale = 2.0.pow((camZoom - tileZoom).toDouble())
    val tileSize = (Mercator.TILE * scale).toFloat()

    // Which tiles the viewport covers, recomputed whenever the camera or the size moves.
    LaunchedEffect(lat, lon, camZoom, width, height) {
        if (width == 0 || height == 0) return@LaunchedEffect
        val worldX = Mercator.x(lon, tileZoom)
        val worldY = Mercator.y(lat, tileZoom)
        val halfW = width / 2.0 / scale
        val halfH = height / 2.0 / scale
        val minX = floor((worldX - halfW) / Mercator.TILE).toInt()
        val maxX = floor((worldX + halfW) / Mercator.TILE).toInt()
        val minY = floor((worldY - halfH) / Mercator.TILE).toInt()
        val maxY = floor((worldY + halfH) / Mercator.TILE).toInt()
        val limit = (1 shl tileZoom) - 1
        for (x in minX..maxX) for (y in minY..maxY) {
            if (y < 0 || y > limit) continue
            val wrapped = ((x % (limit + 1)) + (limit + 1)) % (limit + 1)
            val key = "$tileZoom/$wrapped/$y"
            if (tiles.containsKey(key) || failed.containsKey(key)) continue
            scope.launch {
                val bitmap = MapTiles.load(tileZoom, wrapped, y)
                if (bitmap != null) tiles[key] = bitmap else failed[key] = true
            }
        }
    }

    Box(modifier.fillMaxSize()) {
        Canvas(
            Modifier.fillMaxSize()
                .onSizeChanged { width = it.width; height = it.height }
                .then(
                    if (interactive) Modifier.pointerInput(Unit) {
                        detectTransformGestures { _, pan, gestureZoom, _ ->
                            val newZoom = (camZoom + kotlin.math.log2(gestureZoom)).coerceIn(3f, 18f)
                            // Pan is in screen pixels; convert to world pixels at the
                            // current scale so dragging tracks the finger exactly.
                            val effective = 2.0.pow((newZoom - tileZoom).toDouble())
                            val worldX = Mercator.x(lon, tileZoom) + pan.x / effective
                            val worldY = Mercator.y(lat, tileZoom) + pan.y / effective
                            camZoom = newZoom
                            lat = Mercator.latOf(worldY, tileZoom)
                            lon = Mercator.lonOf(worldX, tileZoom)
                            onCameraMove(lat, lon, newZoom)
                        }
                    } else Modifier
                )
        ) {
            drawRect(surface)
            drawFallbackGrid(grid)
            if (width == 0 || height == 0) return@Canvas
            val centerWorldX = Mercator.x(lon, tileZoom)
            val centerWorldY = Mercator.y(lat, tileZoom)
            val originX = (width / 2.0 - centerWorldX * scale).toFloat()
            val originY = (height / 2.0 - centerWorldY * scale).toFloat()
            val limit = 1 shl tileZoom

            val firstX = floor((-originX) / tileSize).toInt()
            val lastX = floor((width - originX) / tileSize).toInt()
            val firstY = floor((-originY) / tileSize).toInt()
            val lastY = floor((height - originY) / tileSize).toInt()
            for (tx in firstX..lastX) for (ty in firstY..lastY) {
                if (ty < 0 || ty >= limit) continue
                val wrapped = ((tx % limit) + limit) % limit
                val bitmap = tiles["$tileZoom/$wrapped/$ty"] ?: continue
                val left = (originX + tx * tileSize).toInt()
                val top = (originY + ty * tileSize).toInt()
                val size = (tileSize + 1).toInt()
                drawImage(
                    image = bitmap,
                    srcOffset = IntOffset.Zero,
                    srcSize = IntSize(bitmap.width, bitmap.height),
                    dstOffset = IntOffset(left, top),
                    dstSize = IntSize(size, size)
                )
            }
            for (pin in pins) {
                val px = (width / 2.0 + (Mercator.x(pin.lon, tileZoom) - centerWorldX) * scale).toFloat()
                val py = (height / 2.0 + (Mercator.y(pin.lat, tileZoom) - centerWorldY) * scale).toFloat()
                if (px < -40f || py < -40f || px > width + 40f || py > height + 40f) continue
                drawPin(px, py, pin.exact)
            }
            if (markerLat != null && markerLon != null) {
                val markerX = (width / 2.0 + (Mercator.x(markerLon, tileZoom) - centerWorldX) * scale).toFloat()
                val markerY = (height / 2.0 + (Mercator.y(markerLat, tileZoom) - centerWorldY) * scale).toFloat()
                drawLocationMarker(markerX, markerY, accent)
            }
        }
    }
}

/** The offline state: the same road grid the previous illustration used, so no blank screen. */
private fun DrawScope.drawFallbackGrid(grid: Color) {
    for (i in 0..9) {
        val y = size.height * (.14f + i * .1f)
        drawLine(grid, Offset(0f, y), Offset(size.width, y - size.height * .06f), 1.5f)
    }
    for (i in 0..6) {
        val x = i * size.width / 6f
        drawLine(grid, Offset(x, 0f), Offset(x + size.width * .12f, size.height), 1.5f)
    }
}

/**
 * Camera marker. Approximate sites are hollow: a filled dot claims a precision the data
 * does not have, and a driver reads markers as certainty.
 */
private fun DrawScope.drawPin(x: Float, y: Float, exact: Boolean) {
    val halo = Color(0xFFFFC24B)
    val ring = Color(0xFF0A0D0B)
    drawCircle(ring, 13f, Offset(x, y))
    if (exact) {
        drawCircle(halo, 9.5f, Offset(x, y))
        drawCircle(ring, 4f, Offset(x, y))
    } else {
        drawCircle(halo, 9.5f, Offset(x, y), style = Stroke(2.5f))
        drawCircle(halo, 2.5f, Offset(x, y))
    }
}

private fun DrawScope.drawLocationMarker(x: Float, y: Float, accent: Color) {
    // A bearing-less dot: honest about not knowing which way the car points.
    drawCircle(Color(0x33101813), 30f, Offset(x, y))
    drawCircle(Color.White, 13f, Offset(x, y))
    drawCircle(accent, 9f, Offset(x, y))
    val pulse = Path().apply {
        moveTo(x, y - 30f); lineTo(x - 8f, y - 44f); lineTo(x + 8f, y - 44f); close()
    }
    drawPath(pulse, accent)
    drawPath(pulse, Color(0xFF0A0D0B), style = Stroke(1.5f, cap = StrokeCap.Round))
}
