package app.salim

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.speech.RecognizerIntent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Mic
import androidx.compose.material.icons.outlined.Navigation
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material.icons.outlined.Work
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import kotlinx.coroutines.flow.MutableStateFlow

internal val BrandGround = Color(0xFF0A0D0B)
internal val BrandSurface = Color(0xFF121715)
internal val BrandLine = Color(0xFF27332C)
internal val BrandInk = Color(0xFFE9F1EA)
internal val BrandMuted = Color(0xFF94A79B)
internal val BrandSignal = Color(0xFF4ADE9B)
internal val BrandAmber = Color(0xFFFFC24B)
private val Mono = FontFamily.Monospace
private val Card = RoundedCornerShape(10.dp)

/**
 * The Overview banner: a dark "windscreen" card in every theme. The logo's road runs through
 * the background at full scale; the lockup pairs SALIM with سالم at equal weight; the line in
 * the app's language is the headline and the other language answers it, set to the opposite
 * edge; a live status strip closes the card.
 */
@Composable
fun HeroBanner(state: DriveState) {
    val arabic = Ar.enabled
    val packs by OfflinePacks.packs.collectAsState()
    Box(Modifier.fillMaxWidth().clip(Card).background(BrandGround).border(1.dp, BrandLine, Card)) {
        Canvas(Modifier.matchParentSize()) {
            val w = size.width; val h = size.height
            val vx = w * 0.80f; val vy = h * 0.20f
            val faint = Color(0xFFF4EFE6).copy(alpha = 0.06f)
            drawLine(faint, Offset(w * 0.42f, h), Offset(vx - 14f, vy + 30f), 14f, StrokeCap.Round)
            drawLine(faint, Offset(w * 1.18f, h), Offset(vx + 14f, vy + 30f), 14f, StrokeCap.Round)
            listOf(0.95f to 0.80f, 0.70f to 0.60f, 0.50f to 0.44f).forEach { (a, b) ->
                drawLine(BrandSignal.copy(alpha = 0.09f), Offset(vx + (w * 0.80f - vx) * 0f, vy + (h - vy) * a), Offset(vx, vy + (h - vy) * b), 8f, StrokeCap.Round)
            }
            drawCircle(BrandAmber.copy(alpha = 0.10f), 34f, Offset(vx, vy))
            drawCircle(BrandAmber.copy(alpha = 0.28f), 11f, Offset(vx, vy))
        }
        Column(Modifier.padding(horizontal = 20.dp, vertical = 18.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                SalimMark(60.dp)
                Spacer(Modifier.width(14.dp))
                Column(Modifier.weight(1f)) {
                    Text("SALIM", translate = false, fontSize = 22.sp, fontWeight = FontWeight.Bold, letterSpacing = 5.sp, fontFamily = Mono, color = BrandInk)
                    Text("سالم", translate = false, fontSize = 28.sp, lineHeight = 32.sp, fontWeight = FontWeight.Bold, color = BrandSignal)
                }
                Text(
                    "AWARE, NOT ALARMED", fontSize = 9.sp, letterSpacing = 1.6.sp, fontFamily = Mono, color = BrandAmber,
                    modifier = Modifier.border(1.dp, BrandAmber.copy(alpha = 0.5f), RoundedCornerShape(4.dp)).padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
            Spacer(Modifier.height(20.dp))
            val first = if (arabic) "اعرف ما ينتظرك." else "Know what’s ahead."
            val second = if (arabic) "وقُد بهدوء." else "Keep your calm."
            val echo = if (arabic) "Know what’s ahead. Keep your calm." else "اعرف ما ينتظرك… وقُد بهدوء."
            Text(first, translate = false, fontSize = 30.sp, lineHeight = 36.sp, fontWeight = FontWeight.Bold, letterSpacing = (-0.5).sp, color = BrandInk)
            Text(second, translate = false, fontSize = 30.sp, lineHeight = 36.sp, fontWeight = FontWeight.Bold, letterSpacing = (-0.5).sp, color = BrandSignal)
            Spacer(Modifier.height(10.dp))
            Text(
                echo, translate = false, fontSize = if (arabic) 14.sp else 21.sp, lineHeight = 28.sp, fontWeight = FontWeight.Bold,
                color = BrandInk.copy(alpha = 0.72f), textAlign = TextAlign.End, modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(16.dp))
            Box(Modifier.fillMaxWidth().height(1.dp).background(BrandLine))
            Spacer(Modifier.height(10.dp))
            val cameras = state.hazards.count { it.kind.isCamera }
            val (dot, label) = when {
                state.mode == Mode.GPS && state.alertReady -> BrandSignal to "GPS LOCKED"
                state.mode == Mode.GPS -> BrandAmber to "LOCATING"
                state.mode == Mode.DEMO -> BrandAmber to "SIMULATION"
                else -> BrandMuted to "READY"
            }
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Box(Modifier.size(8.dp).clip(RoundedCornerShape(50)).background(dot))
                Text(label, fontSize = 11.sp, letterSpacing = 1.2.sp, fontFamily = Mono, color = BrandInk)
                Text("·", fontSize = 11.sp, color = BrandMuted)
                Text(state.country, fontSize = 11.sp, fontFamily = Mono, color = BrandMuted)
                Text("·", fontSize = 11.sp, color = BrandMuted)
                Text("$cameras CAMERAS NEARBY", fontSize = 11.sp, letterSpacing = 1.sp, fontFamily = Mono, color = BrandMuted, maxLines = 1)
                if (state.premium && packs.containsKey(state.country)) {
                    Spacer(Modifier.weight(1f))
                    Text("OFFLINE PACK", fontSize = 9.sp, letterSpacing = 1.sp, fontFamily = Mono, color = BrandSignal)
                }
            }
            Spacer(Modifier.height(6.dp))
            Text("COVERAGE VARIES · FOLLOW POSTED SIGNS", fontSize = 9.sp, letterSpacing = 1.1.sp, fontFamily = Mono, color = BrandAmber.copy(alpha = 0.85f))
        }
    }
}

/** Hands a destination to the driver's navigation app, and remembers one to open once a drive starts. */
object NavLauncher {
    /** Text shared into Salim from Google Maps or any app (Share › Salim). */
    val shared = MutableStateFlow<String?>(null)
    private var pending: String? = null
    private var pendingAt = 0L

    fun afterDriveStarts(destination: String) { pending = destination; pendingAt = System.currentTimeMillis() }

    /** Called when a GPS drive becomes active: opens navigation if it was asked for in the last minute. */
    fun onDriveStarted(context: Context) {
        val d = pending ?: return
        pending = null
        if (System.currentTimeMillis() - pendingAt < 60_000) launch(context, d)
    }

    fun launch(context: Context, destination: String, app: NavApp = AlertPrefs.options.value.navApp) {
        val target = destination.trim()
        if (target.isBlank()) return
        AlertPrefs.remember(target)
        val url = Regex("https?://\\S+").find(target)?.value
        val q = Uri.encode(url ?: target)
        val intent = when {
            url != null -> Intent(Intent.ACTION_VIEW, Uri.parse(url))
            app == NavApp.GOOGLE_MAPS -> Intent(Intent.ACTION_VIEW, Uri.parse("google.navigation:q=$q&mode=d")).setPackage("com.google.android.apps.maps")
            app == NavApp.WAZE -> Intent(Intent.ACTION_VIEW, Uri.parse("https://waze.com/ul?q=$q&navigate=yes"))
            else -> Intent.createChooser(Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q=$q")), Ar.t("Navigate with"))
        }.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        runCatching { context.startActivity(intent) }
            .recoverCatching {
                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com/maps/dir/?api=1&destination=$q&travelmode=driving&dir_action=navigate")).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
            }
            .onFailure { DriveStore.message("No compatible maps app is installed") }
    }

    /** Google Maps shares "Name\nAddress\nhttps://maps.app.goo.gl/…"; keep the readable part for display. */
    fun clean(text: String): String {
        val lines = text.lines().map { it.trim() }.filter { it.isNotBlank() }
        val words = lines.filterNot { it.startsWith("http") }
        return (if (words.isNotEmpty()) words.take(2).joinToString(", ") else lines.firstOrNull().orEmpty()).take(120)
    }
}

/**
 * "Drive to": one tap from a saved place or a recent destination starts Salim *and* opens
 * Google Maps or Waze already navigating, so camera alerts run underneath the driver's
 * favourite navigation app. Voice input, Home/Work, recents, and Share › Salim from Maps.
 */
@Composable
fun DriveTo(state: DriveState, onGPS: () -> Unit) {
    val context = LocalContext.current
    val options by AlertPrefs.options.collectAsState()
    val shared by NavLauncher.shared.collectAsState()
    var destination by remember { mutableStateOf("") }
    val active = state.mode != Mode.IDLE
    LaunchedEffect(shared) { shared?.let { destination = NavLauncher.clean(it) } }
    LaunchedEffect(state.mode) { if (state.mode == Mode.GPS) NavLauncher.onDriveStarted(context) }
    val voice = rememberLauncherForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        result.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.firstOrNull()?.let { destination = it.take(120) }
    }
    fun go(target: String) {
        if (target.isBlank()) return
        if (state.mode == Mode.GPS) NavLauncher.launch(context, target)
        else { NavLauncher.afterDriveStarts(target); onGPS() }
        NavLauncher.shared.value = null
    }
    val scheme = MaterialTheme.colorScheme
    Column(
        Modifier.fillMaxWidth().clip(Card).background(scheme.surface).border(1.dp, scheme.outline, Card).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("DRIVE TO", fontSize = 11.sp, letterSpacing = 2.sp, fontFamily = Mono, color = scheme.primary, modifier = Modifier.weight(1f))
            if (options.navApp != NavApp.ASK) Text("WITH ${options.navApp.label.uppercase()}", fontSize = 10.sp, letterSpacing = 1.sp, fontFamily = Mono, color = scheme.onSurfaceVariant)
        }
        if (shared != null) Text("Shared from another app · Tap Drive & navigate", fontSize = 12.sp, color = scheme.tertiary)
        OutlinedTextField(
            value = destination, onValueChange = { destination = it.take(120) },
            placeholder = { Text("Search or say a destination") }, singleLine = true,
            shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth(),
            trailingIcon = {
                IconButton(onClick = {
                    val ask = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
                        .putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                        .putExtra(RecognizerIntent.EXTRA_PROMPT, Ar.t("Where are you heading?"))
                    if (Ar.enabled) ask.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "ar")
                    runCatching { voice.launch(ask) }.onFailure { DriveStore.message("Voice input is not available on this phone") }
                }) { Icon(Icons.Outlined.Mic, Ar.t("Speak a destination")) }
            }
        )
        val chips = buildList {
            if (options.home.isNotBlank()) add(Triple(Icons.Outlined.Home, Ar.t("Home"), options.home))
            if (options.work.isNotBlank()) add(Triple(Icons.Outlined.Work, Ar.t("Work"), options.work))
            options.recents.take(4).forEach { add(Triple(Icons.Outlined.Schedule, it, it)) }
        }
        if (chips.isNotEmpty()) Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            chips.forEach { (icon, label, target) -> PlaceChip(icon, label) { go(target) } }
        }
        Button(
            onClick = { go(destination) }, enabled = destination.isNotBlank(),
            shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth().heightIn(min = 52.dp)
        ) {
            Icon(Icons.Outlined.Navigation, null); Spacer(Modifier.width(8.dp))
            Text(if (active) "NAVIGATE" else "DRIVE & NAVIGATE", fontFamily = Mono, letterSpacing = 1.sp, fontWeight = FontWeight.Bold)
        }
        if (destination.isNotBlank()) Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            TextButton(onClick = { AlertPrefs.update { it.copy(home = destination.trim()) } }) { Text("Save as Home", fontSize = 12.sp) }
            TextButton(onClick = { AlertPrefs.update { it.copy(work = destination.trim()) } }) { Text("Save as Work", fontSize = 12.sp) }
        }
        Text("Salim keeps alerting in the background while your navigation app guides you.", fontSize = 11.sp, lineHeight = 16.sp, color = scheme.onSurfaceVariant)
    }
}

@Composable
private fun PlaceChip(icon: ImageVector, label: String, onClick: () -> Unit) {
    val scheme = MaterialTheme.colorScheme
    Row(
        Modifier.clip(RoundedCornerShape(50)).border(1.dp, scheme.outline, RoundedCornerShape(50)).clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 9.dp),
        verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        Icon(icon, null, Modifier.size(16.dp), tint = scheme.primary)
        Text(label, fontSize = 13.sp, maxLines = 1, translate = false)
    }
}

/**
 * Drop a pin like in Google Maps: pan the map under the fixed centre marker, then confirm.
 * Opens on the driver's current position when one is known.
 */
@Composable
fun PinPicker(startLat: Double, startLon: Double, onPick: (Double, Double) -> Unit, onDismiss: () -> Unit) {
    var lat by remember { mutableStateOf(startLat) }
    var lon by remember { mutableStateOf(startLon) }
    Dialog(onDismissRequest = onDismiss) {
        Column(Modifier.clip(Card).background(BrandSurface).padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text("Move the map to place the pin", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = BrandInk)
            Box(Modifier.fillMaxWidth().height(340.dp).clip(RoundedCornerShape(8.dp))) {
                OsmMap(centerLat = startLat, centerLon = startLon, zoom = 16f, interactive = true, night = true,
                    onCameraMove = { la, lo, _ -> lat = la; lon = lo })
                Canvas(Modifier.size(44.dp).align(Alignment.Center)) {
                    val c = Offset(size.width / 2, size.height / 2)
                    drawCircle(BrandAmber.copy(alpha = 0.35f), size.minDimension / 2.2f, c)
                    drawCircle(BrandAmber, size.minDimension / 6f, c)
                    drawCircle(BrandGround, size.minDimension / 14f, c)
                }
            }
            Text("%.5f, %.5f".format(lat, lon), fontSize = 11.sp, fontFamily = Mono, color = BrandMuted, translate = false)
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedButton(onClick = onDismiss, modifier = Modifier.weight(1f)) { Text("Cancel") }
                Button(onClick = { onPick(lat, lon) }, modifier = Modifier.weight(1f)) { Text("Use this spot") }
            }
        }
    }
}
