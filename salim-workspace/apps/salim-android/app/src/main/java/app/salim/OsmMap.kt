package app.salim

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import app.salim.core.Point
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.coroutines.withContext
import kotlin.math.PI
import kotlin.math.atan
import kotlin.math.floor
import kotlin.math.ln
import kotlin.math.roundToInt
import kotlin.math.sinh
import kotlin.math.tan

internal data class MapPin(val lat: Double, val lon: Double, val label: String, val exact: Boolean)
private data class TileDraw(val zoom: Int, val x: Int, val y: Int, val left: Int, val top: Int)

@androidx.compose.runtime.Composable
internal fun OsmMap(
    centerLat: Double,
    centerLon: Double,
    zoom: Float,
    markerLat: Double?,
    markerLon: Double?,
    accent: Color,
    surface: Color,
    grid: Color,
    interactive: Boolean,
    pins: List<MapPin>
) {
    var center by remember { mutableStateOf(Point(centerLat, centerLon)) }
    var currentZoom by remember { mutableStateOf(zoom.coerceIn(3f, 18f)) }
    LaunchedEffect(centerLat, centerLon) {
        if (centerLat.isFinite() && centerLon.isFinite()) center = Point(centerLat.coerceIn(-85.0, 85.0), centerLon.coerceIn(-180.0, 180.0))
    }

    BoxWithConstraints(
        Modifier.fillMaxSize().background(surface)
            .pointerInput(interactive, currentZoom) {
                if (interactive) detectDragGestures { change, delta ->
                    change.consume()
                    val world = MapTiles.worldSize(currentZoom.roundToInt().toDouble())
                    val cx = worldX(center.lon, world) - delta.x
                    val cy = worldY(center.lat, world) - delta.y
                    center = worldPoint(cx, cy, world)
                }
            }
            .pointerInput(interactive) {
                if (interactive) detectTapGestures(onDoubleTap = {
                    currentZoom = (currentZoom + 1f).coerceAtMost(18f)
                })
            }
    ) {
        val widthPx = constraints.maxWidth.coerceAtLeast(1)
        val heightPx = constraints.maxHeight.coerceAtLeast(1)
        val world = MapTiles.worldSize(currentZoom.roundToInt().toDouble())
        val cx = worldX(center.lon, world)
        val cy = worldY(center.lat, world)
        val tileDraws = remember(center, currentZoom, widthPx, heightPx) {
            visibleTiles(center, currentZoom, widthPx, heightPx)
        }
        val images by produceState<Map<TileDraw, ImageBitmap>>(initialValue = emptyMap(), tileDraws) {
            value = withContext(Dispatchers.IO) {
                val semaphore = Semaphore(4)
                coroutineScope {
                    tileDraws.map { tile -> async {
                        semaphore.withPermit {
                            MapTiles.loadTile(tile.zoom, tile.x, tile.y)?.asImageBitmap()?.let { tile to it }
                        }
                    } }.awaitAll().filterNotNull().toMap()
                }
            }
        }

        Canvas(Modifier.fillMaxSize()) {
            drawRect(surface)
            val tileSize = 256
            tileDraws.forEach { tile ->
                images[tile]?.let { bitmap ->
                    drawImage(bitmap, dstOffset = IntOffset(tile.left, tile.top), dstSize = IntSize(tileSize, tileSize))
                }
            }
            if (images.isEmpty()) {
                val step = 56.dp.toPx()
                var x = 0f
                while (x < size.width) { drawLine(grid.copy(alpha = .6f), Offset(x, 0f), Offset(x, size.height), 1.dp.toPx()); x += step }
                var y = 0f
                while (y < size.height) { drawLine(grid.copy(alpha = .6f), Offset(0f, y), Offset(size.width, y), 1.dp.toPx()); y += step }
            }
            pins.take(100).forEach { pin ->
                if (!pin.lat.isFinite() || !pin.lon.isFinite()) return@forEach
                val p = screenPoint(pin.lat, pin.lon, cx, cy, size.width, size.height, world)
                if (p.x in -12f..(size.width + 12f) && p.y in -12f..(size.height + 12f)) {
                    val color = if (pin.exact) accent else Color(0xFFFFC24B)
                    drawCircle(Color(0xCC08110D), 9.dp.toPx(), p)
                    drawCircle(color, 6.dp.toPx(), p, style = if (pin.exact) androidx.compose.ui.graphics.drawscope.Fill else Stroke(2.dp.toPx()))
                }
            }
            if (markerLat != null && markerLon != null && markerLat.isFinite() && markerLon.isFinite()) {
                val p = screenPoint(markerLat, markerLon, cx, cy, size.width, size.height, world)
                drawCircle(Color.White, 9.dp.toPx(), p)
                drawCircle(Color(0xFF2A83F2), 6.dp.toPx(), p)
            }
        }
        if (images.isEmpty()) Text("MAP TILES LOADING OR UNAVAILABLE · DRAG TO PAN", color = Color.White.copy(alpha = .75f), modifier = Modifier.align(Alignment.Center))
    }
}

private fun visibleTiles(center: Point, zoomFloat: Float, width: Int, height: Int): List<TileDraw> {
    val zoom = zoomFloat.roundToInt().coerceIn(1, 19)
    val world = MapTiles.worldSize(zoom.toDouble())
    val cx = worldX(center.lon, world); val cy = worldY(center.lat, world)
    val left = cx - width / 2.0; val top = cy - height / 2.0
    val x0 = floor(left / 256).toInt(); val x1 = floor((left + width) / 256).toInt()
    val y0 = floor(top / 256).toInt(); val y1 = floor((top + height) / 256).toInt()
    val result = mutableListOf<TileDraw>()
    for (y in y0..y1) for (x in x0..x1) {
        val tileLeft = (width / 2.0 + x * 256 - cx).roundToInt()
        val tileTop = (height / 2.0 + y * 256 - cy).roundToInt()
        result += TileDraw(zoom, x, y, tileLeft, tileTop)
    }
    return result
}

private fun worldX(lon: Double, world: Double): Double = ((lon + 180.0) / 360.0) * world
private fun worldY(lat: Double, world: Double): Double {
    val latitude = lat.coerceIn(-85.05112878, 85.05112878) * PI / 180.0
    return (0.5 - ln((1 + kotlin.math.sin(latitude)) / (1 - kotlin.math.sin(latitude))) / (4 * PI)) * world
}
private fun worldPoint(x: Double, y: Double, world: Double): Point {
    val lon = (x / world) * 360.0 - 180.0
    val n = PI - 2 * PI * y / world
    val lat = 180.0 / PI * atan(sinh(n))
    return Point(lat.coerceIn(-85.0, 85.0), ((lon + 180.0) % 360.0 + 360.0) % 360.0 - 180.0)
}
private fun screenPoint(lat: Double, lon: Double, cx: Double, cy: Double, width: Float, height: Float, world: Double): Offset =
    Offset((width / 2.0 + worldX(lon, world) - cx).toFloat(), (height / 2.0 + worldY(lat, world) - cy).toFloat())
