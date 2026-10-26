package app.salim

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import app.salim.core.AlertMatch
import app.salim.core.Geo
import app.salim.core.Hazard
import app.salim.core.Point
import java.text.DateFormat
import kotlinx.coroutines.flow.emptyFlow
import java.util.Date

/*
 * Visual system.
 *
 * The first attempt read as a wellness app: 20dp corners, pastel gradients, generous
 * air, no lines anywhere. The Founder's words were "startup dentist clinic". This is the
 * opposite direction — an instrument panel. Sharp corners, hairline rules that separate
 * rather than decorate, a near-black ground, one saturated signal colour, and tabular
 * numerals wherever a number is actually a reading.
 *
 * Contrast is unchanged as a floor: every ink here is at least 4.9:1 on its surface.
 */

private val Signal = Color(0xFF4ADE9B)
private val SignalDeep = Color(0xFF146B4C)
private val Warn = Color(0xFFFFC24B)
private val WarnDeep = Color(0xFF7A5A10)
private val Danger = Color(0xFFFF6B5A)
private val DangerDeep = Color(0xFFA32E1C)

private val NightGround = Color(0xFF0A0D0B)
private val NightSurface = Color(0xFF121715)
private val NightRaised = Color(0xFF1A211D)
private val NightLine = Color(0xFF27332C)
private val NightInk = Color(0xFFE9F1EA)
private val NightMuted = Color(0xFF94A79B)   // 6.9:1 on NightSurface

private val DayGround = Color(0xFFEFF2EC)
private val DaySurface = Color(0xFFFFFFFF)
private val DayRaised = Color(0xFFF7F9F5)
private val DayLine = Color(0xFFCBD4C6)
private val DayInk = Color(0xFF0E1712)
private val DayMuted = Color(0xFF4E5E54)     // 7.2:1 on white

private val Sharp = RoundedCornerShape(6.dp)
private val Sharper = RoundedCornerShape(4.dp)
private val Panel = RoundedCornerShape(8.dp)

private val LightScheme = lightColorScheme(
    primary = SignalDeep, onPrimary = Color.White,
    background = DayGround, onBackground = DayInk,
    surface = DaySurface, onSurface = DayInk,
    surfaceVariant = DayRaised, onSurfaceVariant = DayMuted,
    tertiary = WarnDeep, onTertiary = Color.White,
    error = DangerDeep, onError = Color.White,
    outline = DayLine
)
private val DarkScheme = darkColorScheme(
    primary = Signal, onPrimary = Color(0xFF04180F),
    background = NightGround, onBackground = NightInk,
    surface = NightSurface, onSurface = NightInk,
    surfaceVariant = NightRaised, onSurfaceVariant = NightMuted,
    tertiary = Warn, onTertiary = Color(0xFF1F1500),
    error = Danger, onError = Color(0xFF1A0503),
    outline = NightLine
)

/** Numerals that line up. A speed that shifts width while it climbs reads as broken. */
private val Readout = FontFamily.Monospace

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        DriveStore.initialize(this)
        setContent { Salim() }
    }
    override fun onStop() {
        if (!isChangingConfigurations && DriveStore.state.value.mode == Mode.DEMO)
            DriveStore.end("Simulation paused when app left foreground · Saved")
        super.onStop()
    }
}

@Composable
private fun Salim() {
    val state by DriveStore.state.collectAsStateWithLifecycle()
    val dark = when (state.appearance) {
        Appearance.SYSTEM -> isSystemInDarkTheme()
        Appearance.LIGHT -> false
        Appearance.DARK -> true
    }
    MaterialTheme(colorScheme = if (dark) DarkScheme else LightScheme) { SalimBody(state) }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun SalimBody(state: DriveState) {
    val context = LocalContext.current
    // Billing lives with the activity, not the composition: a purchase can complete after a
    // rotation, and the listener has to outlive the recomposition that opened the dialog.
    val billing = remember(context) { (context as? Activity)?.let { Billing(it) } }
    DisposableEffect(billing) {
        billing?.start()
        onDispose { billing?.close() }
    }
    var tab by remember { mutableIntStateOf(0) }
    var disclosure by remember { mutableStateOf(false) }
    var minimised by remember { mutableStateOf(false) }
    LaunchedEffect(state.mode) { if (state.mode == Mode.IDLE) minimised = false }

    // A running session owns the screen. The dashboard is a control surface; a drive is
    // not something you scroll past.
    if (state.mode != Mode.IDLE && !minimised) {
        DriveScreen(state, onMinimise = { minimised = true }, onRequestGPS = { disclosure = true })
    } else {
        val tabs = listOf("Overview", "Trips", "Community", "Settings")
        val icons = listOf(Icons.Outlined.Dashboard, Icons.Outlined.Route, Icons.Outlined.People, Icons.Outlined.Tune)
        val scheme = MaterialTheme.colorScheme
        val permission = rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) {
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                if (DriveStore.state.value.mode == Mode.IDLE)
                    runCatching { ContextCompat.startForegroundService(context, Intent(context, DriveService::class.java)) }
                        .onFailure { DriveStore.message("Open Salim and check permissions before starting GPS") }
            } else DriveStore.message("Precise location was denied. A simulated drive still works.")
        }
        fun stop() {
            if (state.mode == Mode.GPS) context.stopService(Intent(context, DriveService::class.java)) else DriveStore.end()
        }
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { BrandLockup(if (tab == 0) null else tabs[tab]) },
                    actions = {
                        Text(
                            state.country, fontSize = 11.sp, fontFamily = Readout,
                            letterSpacing = 1.2.sp, color = scheme.onSurfaceVariant,
                            modifier = Modifier.padding(end = 18.dp)
                        )
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = scheme.background, titleContentColor = scheme.onBackground
                    )
                )
            },
            bottomBar = {
                NavigationBar(containerColor = scheme.surface, tonalElevation = 0.dp) {
                    tabs.forEachIndexed { i, title ->
                        NavigationBarItem(
                            selected = tab == i, onClick = { tab = i },
                            icon = { Icon(icons[i], title) },
                            label = { Text(title, fontSize = 11.sp) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = scheme.primary,
                                selectedTextColor = scheme.onSurface,
                                indicatorColor = scheme.surfaceVariant
                            )
                        )
                    }
                }
            },
            containerColor = scheme.background
        ) { inset ->
            Box(Modifier.padding(inset)) {
                when (tab) {
                    0 -> Dashboard(state, onDemo = { DriveStore.begin(Mode.DEMO) }, onGPS = { disclosure = true }, onStop = { stop() })
                    1 -> Trips(state)
                    2 -> Community(state)
                    3 -> Settings(state, billing)
                }
            }
        }
        if (disclosure) AlertDialog(
            onDismissRequest = { disclosure = false },
            icon = { Icon(Icons.Outlined.Shield, null) },
            title = { Text("Start a GPS test?") },
            text = { Text("Set up only while safely parked. Salim uses precise device location during this test, including in the background, until you end it. Road data is fictional and not for driving decisions. No route is uploaded.") },
            confirmButton = {
                TextButton(onClick = {
                    disclosure = false
                    val permissions = mutableListOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION)
                    if (Build.VERSION.SDK_INT >= 33) permissions += Manifest.permission.POST_NOTIFICATIONS
                    permission.launch(permissions.toTypedArray())
                }) { Text("Start GPS test") }
            },
            dismissButton = { TextButton(onClick = { disclosure = false }) { Text("Not now") } }
        )
    }
}

/**
 * The mark is the Arabic initial in a square tile, not a rounded one. The lockup sits on
 * one baseline against a hairline, which is what stops it looking like a hobby project.
 */
@Composable
private fun BrandLockup(screen: String?) {
    val scheme = MaterialTheme.colorScheme
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        Box(
            Modifier.size(30.dp).background(scheme.primary, Sharper),
            contentAlignment = Alignment.Center
        ) { Text("س", color = scheme.onPrimary, fontSize = 17.sp, fontWeight = FontWeight.Bold) }
        Column(Modifier.padding(start = 0.dp)) {
            Text(
                if (screen == null) "SALIM" else screen.uppercase(),
                fontSize = 16.sp, fontWeight = FontWeight.Bold, letterSpacing = 2.sp,
                fontFamily = Readout, color = scheme.onBackground
            )
            if (screen == null) Hairline(Modifier.padding(top = 3.dp), width = 34.dp)
        }
    }
}

@Composable
private fun Hairline(modifier: Modifier = Modifier, width: Dp? = null) {
    val scheme = MaterialTheme.colorScheme
    Box(
        modifier
            .then(if (width != null) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(1.dp)
            .background(scheme.outline)
    )
}

/**
 * Cameras near a point, as map pins. Radius is generous so the sheet shows what is
 * coming rather than only what is beside the car.
 */
private fun cameraPins(lat: Double, lon: Double, hazards: List<Hazard>): List<MapPin> =
    hazards.filter { it.kind.isCamera }
        .filter { Geo.distance(Point(lat, lon), it.point) < 3000 }
        .mapNotNull { hazard ->
            val record = CameraPack.info(hazard.id)
            MapPin(
                lat = hazard.point.lat, lon = hazard.point.lon,
                label = record?.label ?: hazard.road,
                // Pack rows carry their own precision; OSM rows are mapped coordinates.
                exact = record?.precision == CameraRecord.Precision.EXACT || record == null
            )
        }

@Composable
private fun Dashboard(state: DriveState, onDemo: () -> Unit, onGPS: () -> Unit, onStop: () -> Unit) {
    val context = LocalContext.current
    val scheme = MaterialTheme.colorScheme
    var destination by remember { mutableStateOf("") }
    val active = state.mode != Mode.IDLE

    // Where to open the map. A real last-known position beats a hard-coded city.
    var homeLat by remember { mutableStateOf(DemoData.center.lat) }
    var homeLon by remember { mutableStateOf(DemoData.center.lon) }
    var located by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        MapTiles.lastKnown(context)?.let { (la, lo) -> homeLat = la; homeLon = lo; located = true }
    }

    LazyColumn(
        contentPadding = PaddingValues(horizontal = 18.dp, vertical = 14.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item { Statement(state) }
        item {
            MapCard(
                lat = state.fix?.point?.lat ?: homeLat,
                lon = state.fix?.point?.lon ?: homeLon,
                located = located || state.fix != null,
                active = active,
                onDemo = onDemo, onGPS = onGPS, onStop = onStop, state = state
            )
        }
        item { MetricStrip(state) }
        if (state.mode == Mode.GPS && !state.acquired) item { Acquiring(state) }
        item { Text(state.status, fontSize = 12.sp, color = scheme.primary, fontFamily = Readout) }
        item { Text(state.feed, fontSize = 12.sp, color = scheme.onSurfaceVariant) }

        val currentWarning = state.warning
        if (currentWarning != null) item { AlertBanner(currentWarning) }

        if (state.hazards.isNotEmpty()) {
            val cameras = state.hazards.filter { it.kind.isCamera }
            if (cameras.isNotEmpty()) {
                val live = cameras.count { it.id.startsWith("osm:") }
                item {
                    SectionLabel("CAMERAS · ${cameras.size}" + if (live > 0) " · $live LIVE" else "")
                }
                items(cameras, key = { it.id }) { hazard ->
                    val record = CameraPack.info(hazard.id)
                    AlertRow(
                        title = hazard.title,
                        subtitle = record?.label ?: hazard.road,
                        accent = Warn,
                        trailing = if (record?.precision == CameraRecord.Precision.APPROXIMATE) "≈" else null
                    )
                }
            }
            val others = state.hazards.filter { !it.kind.isCamera }
            if (others.isNotEmpty()) {
                item { SectionLabel("ROAD CONDITIONS") }
                items(others, key = { it.id }) { hazard ->
                    AlertRow(hazard.title, hazard.road, when (hazard.kind.name) {
                        "ROADWORK" -> Warn
                        "TRAFFIC" -> Danger
                        else -> Signal
                    })
                }
            }
        }

        item { SectionLabel("DESTINATION") }
        item {
            OutlinedTextField(
                value = destination, onValueChange = { destination = it.take(120) },
                label = { Text("Where are you heading?") }, singleLine = true,
                enabled = !active, shape = Sharp, modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(8.dp))
            OutlinedButton(
                onClick = {
                    runCatching { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("geo:26.22,50.55?q=${Uri.encode(destination)}"))) }
                        .onFailure { DriveStore.message("No compatible maps app is installed") }
                },
                enabled = destination.isNotBlank() && !active,
                shape = Sharp, modifier = Modifier.fillMaxWidth()
            ) { Text("Open in Maps", fontFamily = Readout, letterSpacing = 1.sp) }
        }
        item {
            Text(
                "Simulation runs only while this app is in the foreground. A GPS test uses a visible location service. OS force-stop and battery restrictions may interrupt it.",
                fontSize = 11.sp, lineHeight = 16.sp, color = scheme.onSurfaceVariant
            )
        }
    }
}

/** Replaces the soft gradient hero. Type, a rule, and one line of plain fact. */
@Composable
private fun Statement(state: DriveState) {
    val scheme = MaterialTheme.colorScheme
    Column(verticalArrangement = Arrangement.spacedBy(7.dp)) {
        Text("AWARE, NOT ALARMED", fontSize = 10.sp, letterSpacing = 2.4.sp, color = scheme.primary, fontFamily = Readout)
        Text(
            "Know what’s ahead.\nKeep your calm.",
            fontSize = 27.sp, lineHeight = 31.sp, fontWeight = FontWeight.Bold, letterSpacing = (-0.6).sp,
            color = scheme.onBackground
        )
        Text("اعرف ما أمامك.", fontSize = 14.sp, color = scheme.onSurfaceVariant)
        Text("قُد بهدوء.", fontSize = 14.sp, color = scheme.onSurfaceVariant)
        Hairline(Modifier.padding(vertical = 4.dp))
        Text("FICTIONAL DATA · NOT FOR DRIVING GUIDANCE", fontSize = 10.sp, letterSpacing = 1.1.sp, color = scheme.tertiary, fontFamily = Readout)
    }
}

/**
 * The map, with the controls on top of it rather than in a form below it. This single
 * change is what moves the app from "list with a picture" to "map you can act on".
 */
@Composable
private fun MapCard(
    lat: Double, lon: Double, located: Boolean, active: Boolean,
    onDemo: () -> Unit, onGPS: () -> Unit, onStop: () -> Unit, state: DriveState
) {
    val scheme = MaterialTheme.colorScheme
    Box(Modifier.fillMaxWidth().height(340.dp).clip(Panel).background(NightGround)) {
        OsmMap(
            centerLat = lat, centerLon = lon, zoom = 14.5f,
            markerLat = if (located) lat else null, markerLon = if (located) lon else null,
            accent = Signal, surface = NightGround, grid = NightLine,
            interactive = true,
            pins = cameraPins(lat, lon, state.hazards)
        )
        // Scrim so the overlay text keeps its contrast over pale map tiles.
        Box(Modifier.fillMaxWidth().height(96.dp).align(Alignment.TopCenter).background(
            Brush.verticalGradient(listOf(Color(0xCC0A0D0B), Color(0x000A0D0B)))
        ))
        Text(
            if (located) "YOUR POSITION" else "MANAMA · NO FIX",
            fontSize = 10.sp, letterSpacing = 1.8.sp, color = Signal, fontFamily = Readout,
            modifier = Modifier.align(Alignment.TopStart).padding(14.dp)
        )
        Text(
            MapTiles.ATTRIBUTION, fontSize = 9.sp, color = Color(0xFF9AAA9F),
            modifier = Modifier.align(Alignment.BottomEnd).padding(6.dp)
        )
        Column(Modifier.align(Alignment.BottomCenter).fillMaxWidth().padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            if (active) {
                Button(
                    onClick = onStop, shape = Sharp, modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Danger, contentColor = Color(0xFF1A0503))
                ) {
                    Icon(Icons.Outlined.Stop, null); Spacer(Modifier.width(8.dp))
                    Text("END · ${state.seconds / 60}:${(state.seconds % 60).toString().padStart(2, '0')}", fontWeight = FontWeight.Bold, fontFamily = Readout)
                }
            } else {
                Button(
                    onClick = onDemo, enabled = state.country == "BH", shape = Sharp,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Signal, contentColor = Color(0xFF04180F))
                ) {
                    Icon(Icons.Outlined.PlayArrow, null); Spacer(Modifier.width(8.dp))
                    Text("RUN SIMULATED DRIVE", fontWeight = FontWeight.Bold, fontFamily = Readout, letterSpacing = .6.sp)
                }
                OutlinedButton(
                    onClick = onGPS, shape = Sharp, modifier = Modifier.fillMaxWidth().height(46.dp),
                    border = BorderStroke(1.dp, Color(0xFF94A79B)), colors = ButtonDefaults.outlinedButtonColors(contentColor = NightInk)
                ) { Text("START DEVICE GPS TEST", fontFamily = Readout, letterSpacing = .6.sp, fontSize = 12.sp) }
            }
        }
    }
}

@Composable
private fun MetricStrip(state: DriveState) {
    val scheme = MaterialTheme.colorScheme
    Row(
        Modifier.fillMaxWidth().clip(Sharp).border(1.dp, scheme.outline, Sharp).background(scheme.surface)
    ) {
        Metric("STATE", if (state.mode == Mode.IDLE) "IDLE" else if (state.mode == Mode.DEMO) "SIM" else "GPS", Modifier.weight(1f))
        Box(Modifier.width(1.dp).height(56.dp).background(scheme.outline))
        Metric("PACK", "${state.hazards.size}", Modifier.weight(1f))
        Box(Modifier.width(1.dp).height(56.dp).background(scheme.outline))
        Metric("ALERTS", "${state.count}", Modifier.weight(1f))
    }
}

@Composable
private fun Metric(label: String, value: String, modifier: Modifier) {
    val scheme = MaterialTheme.colorScheme
    Column(modifier.padding(horizontal = 12.dp, vertical = 11.dp), verticalArrangement = Arrangement.spacedBy(3.dp)) {
        Text(label, fontSize = 9.sp, letterSpacing = 1.6.sp, color = scheme.onSurfaceVariant, fontFamily = Readout)
        Text(value, fontSize = 17.sp, fontWeight = FontWeight.Bold, fontFamily = Readout, color = scheme.onSurface)
    }
}

@Composable
private fun AlertRow(title: String, subtitle: String, accent: Color, trailing: String? = null) {
    val scheme = MaterialTheme.colorScheme
    Row(
        Modifier.fillMaxWidth().height(IntrinsicSize.Min).clip(Sharper).background(scheme.surface)
            .border(1.dp, scheme.outline, Sharper)
    ) {
        Box(Modifier.width(3.dp).fillMaxHeight().background(accent))
        Column(Modifier.weight(1f).padding(horizontal = 13.dp, vertical = 11.dp)) {
            Text(title, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = scheme.onSurface)
            Text(subtitle, fontSize = 12.sp, color = scheme.onSurfaceVariant)
        }
        if (trailing != null) Text(
            trailing, fontSize = 15.sp, color = scheme.tertiary, fontFamily = Readout,
            modifier = Modifier.align(Alignment.CenterVertically).padding(end = 13.dp)
        )
    }
}

@Composable
private fun AlertBanner(match: AlertMatch) {
    Row(
        Modifier.fillMaxWidth().height(IntrinsicSize.Min).clip(Sharp).background(MaterialTheme.colorScheme.surfaceVariant)
            .border(1.dp, Warn, Sharp)
    ) {
        Box(Modifier.width(3.dp).fillMaxHeight().background(Warn))
        Row(Modifier.padding(13.dp), horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Text("${match.meters.toInt()}", fontSize = 26.sp, fontWeight = FontWeight.Bold, fontFamily = Readout, color = Warn)
            Column {
                Text("METRES · ${match.hazard.title.uppercase()}", fontSize = 10.sp, letterSpacing = 1.2.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, fontFamily = Readout)
                Text(match.hazard.road, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface)
            }
        }
    }
}

@Composable
private fun Acquiring(state: DriveState) {
    val scheme = MaterialTheme.colorScheme
    Column(
        Modifier.fillMaxWidth().clip(Sharp).background(scheme.surface)
            .border(1.dp, scheme.outline, Sharp).padding(14.dp),
        verticalArrangement = Arrangement.spacedBy(9.dp)
    ) {
        Text("ACQUIRING SATELLITES", fontSize = 10.sp, letterSpacing = 1.8.sp, color = scheme.primary, fontFamily = Readout)
        Row(verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("${state.seconds}", fontSize = 30.sp, fontWeight = FontWeight.Bold, fontFamily = Readout, color = scheme.onSurface)
            Text("s elapsed", fontSize = 12.sp, color = scheme.onSurfaceVariant, modifier = Modifier.padding(bottom = 5.dp))
        }
        val reached = (state.seconds / 60f).coerceIn(.02f, 1f)
        Box(Modifier.fillMaxWidth().height(3.dp).background(scheme.outline)) {
            Box(Modifier.fillMaxWidth(reached).height(3.dp).background(Signal))
        }
        Text(
            "A cold fix can take 30–60 seconds outdoors. Indoors, move near a window — Salim accepts a coarse network fix while the satellites lock.",
            fontSize = 11.sp, lineHeight = 16.sp, color = scheme.onSurfaceVariant
        )
    }
}

/**
 * Full-screen drive view. Map first, everything else as overlay.
 */
@Composable
private fun DriveScreen(state: DriveState, onMinimise: () -> Unit, onRequestGPS: () -> Unit) {
    val context = LocalContext.current
    val scheme = MaterialTheme.colorScheme
    val fix = state.fix?.point
    var homeLat by remember { mutableStateOf(DemoData.center.lat) }
    var homeLon by remember { mutableStateOf(DemoData.center.lon) }
    LaunchedEffect(Unit) {
        MapTiles.lastKnown(context)?.let { (la, lo) -> homeLat = la; homeLon = lo }
    }
    fun end() {
        if (state.mode == Mode.GPS) context.stopService(Intent(context, DriveService::class.java)) else DriveStore.end()
    }
    val lat = fix?.lat ?: homeLat
    val lon = fix?.lon ?: homeLon

    Box(Modifier.fillMaxSize().background(NightGround)) {
        OsmMap(
            centerLat = lat, centerLon = lon, zoom = 16.2f,
            markerLat = fix?.lat, markerLon = fix?.lon,
            accent = Signal, surface = NightGround, grid = NightLine,
            interactive = true,
            pins = cameraPins(lat, lon, state.hazards)
        )
        // Top scrim, bottom scrim: the overlays own the contrast, not the tiles.
        Box(Modifier.fillMaxWidth().height(140.dp).background(Brush.verticalGradient(listOf(Color(0xE60A0D0B), Color(0x000A0D0B)))))
        Box(Modifier.fillMaxWidth().height(200.dp).align(Alignment.BottomCenter).background(Brush.verticalGradient(listOf(Color(0x000A0D0B), Color(0xE60A0D0B)))))

        Column(Modifier.fillMaxSize().systemBarsPadding()) {
            Row(Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(
                        if (state.mode == Mode.DEMO) "SIMULATED DRIVE" else "GPS TEST",
                        fontSize = 10.sp, letterSpacing = 2.sp, color = Signal, fontFamily = Readout
                    )
                    Text(
                        if (state.mode == Mode.DEMO) "Fictional route · no device GPS" else state.status,
                        fontSize = 11.sp, color = NightMuted, maxLines = 1
                    )
                }
                IconButton(onClick = { DriveStore.setVoice(!state.voice) }) {
                    Icon(if (state.voice) Icons.Outlined.VolumeUp else Icons.Outlined.VolumeOff, "Voice", tint = NightInk)
                }
                IconButton(onClick = onMinimise) { Icon(Icons.Outlined.KeyboardArrowDown, "Minimise", tint = NightInk) }
                Button(
                    onClick = { end() }, shape = Sharp,
                    colors = ButtonDefaults.buttonColors(containerColor = Danger, contentColor = Color(0xFF1A0503)),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp)
                ) { Text("END", fontWeight = FontWeight.Bold, fontFamily = Readout, letterSpacing = .8.sp) }
            }

            if (state.mode == Mode.GPS && !state.acquired) {
                Box(Modifier.fillMaxWidth().padding(horizontal = 18.dp, vertical = 6.dp)) { Acquiring(state) }
            }
            val liveWarning = state.warning
            if (liveWarning != null) {
                Box(Modifier.fillMaxWidth().padding(horizontal = 18.dp, vertical = 6.dp)) { AlertBanner(liveWarning) }
            }

            Spacer(Modifier.weight(1f))

            Row(Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 10.dp), verticalAlignment = Alignment.Bottom) {
                Text(
                    "${state.fix?.let { (it.speed * 3.6).toInt() } ?: 0}",
                    fontSize = 84.sp, fontWeight = FontWeight.Bold, fontFamily = Readout,
                    lineHeight = 86.sp, letterSpacing = (-3).sp,
                    color = if (state.acquired || state.mode == Mode.DEMO) NightInk else NightMuted
                )
                Spacer(Modifier.width(10.dp))
                Column(Modifier.padding(bottom = 12.dp)) {
                    Text("KM/H", fontSize = 13.sp, letterSpacing = 1.6.sp, color = Signal, fontFamily = Readout)
                    Text(
                        "${state.seconds / 60}:${(state.seconds % 60).toString().padStart(2, '0')}",
                        fontSize = 14.sp, color = NightMuted, fontFamily = Readout
                    )
                }
            }
            Row(Modifier.fillMaxWidth().padding(start = 20.dp, end = 20.dp, bottom = 14.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(MapTiles.ATTRIBUTION, fontSize = 9.sp, color = Color(0xFF9AAA9F))
                Text("FICTIONAL DATA", fontSize = 9.sp, letterSpacing = 1.sp, color = Color(0xFF9AAA9F), fontFamily = Readout)
            }
        }
    }
}

@Composable
private fun Trips(state: DriveState) {
    var clear by remember { mutableStateOf(false) }
    val scheme = MaterialTheme.colorScheme
    LazyColumn(contentPadding = PaddingValues(horizontal = 18.dp, vertical = 14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item { SectionLabel("SESSION LOG") }
        item { Text("Summaries stay on this device. Precise routes are not saved.", fontSize = 12.sp, color = scheme.onSurfaceVariant) }
        if (state.trips.isEmpty()) item {
            Text("No sessions yet. Run a simulated drive and finish it to see a summary.", color = scheme.onSurfaceVariant, modifier = Modifier.padding(vertical = 40.dp))
        }
        items(state.trips, key = { it.id }) { trip ->
            Row(Modifier.fillMaxWidth().clip(Sharper).background(scheme.surface).border(1.dp, scheme.outline, Sharper).padding(13.dp)) {
                Column(Modifier.weight(1f)) {
                    Text(
                        if (trip.interrupted) "INTERRUPTED" else if (trip.demo) "SIMULATED" else "GPS TEST",
                        fontSize = 10.sp, letterSpacing = 1.4.sp, color = scheme.primary, fontFamily = Readout
                    )
                    Text(DateFormat.getDateTimeInstance().format(Date(trip.at)), fontSize = 12.sp, color = scheme.onSurfaceVariant)
                }
                if (!trip.interrupted) Text(
                    "${trip.seconds / 60}m ${trip.seconds % 60}s · ${trip.alerts}", fontSize = 13.sp, fontFamily = Readout,
                    color = scheme.onSurface, modifier = Modifier.align(Alignment.CenterVertically)
                )
            }
        }
        if (state.trips.isNotEmpty()) item { TextButton(onClick = { clear = true }) { Text("Delete local history") } }
    }
    if (clear) AlertDialog(
        onDismissRequest = { clear = false }, title = { Text("Delete trip history?") },
        text = { Text("This removes local summaries and cannot be undone.") },
        confirmButton = { TextButton(onClick = { DriveStore.clearTrips(); clear = false }) { Text("Delete") } },
        dismissButton = { TextButton(onClick = { clear = false }) { Text("Cancel") } }
    )
}

@Composable
private fun Community(state: DriveState) {
    var road by remember { mutableStateOf("") }
    var kind by remember { mutableStateOf("Road hazard") }
    val scheme = MaterialTheme.colorScheme
    LazyColumn(contentPadding = PaddingValues(horizontal = 18.dp, vertical = 14.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item {
            Text("Report a road condition", fontSize = 22.sp, fontWeight = FontWeight.Bold, letterSpacing = (-0.4).sp)
            Text("Only when safely parked. These are local drafts, not published alerts.", fontSize = 12.sp, color = scheme.onSurfaceVariant)
        }
        item { SectionLabel("TYPE") }
        item {
            Column {
                listOf("Road hazard", "Roadworks", "Traffic congestion", "Road bump").forEach { type ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        RadioButton(selected = kind == type, onClick = { kind = type }, enabled = state.mode == Mode.IDLE)
                        Text(type, fontSize = 13.sp)
                    }
                }
            }
        }
        item {
            OutlinedTextField(
                value = road, onValueChange = { road = it.take(120) }, label = { Text("Road or location") },
                enabled = state.mode == Mode.IDLE, shape = Sharp, modifier = Modifier.fillMaxWidth()
            )
        }
        item {
            Button(
                onClick = { DriveStore.draft(road, kind); road = "" },
                enabled = road.isNotBlank() && state.mode == Mode.IDLE,
                shape = Sharp, modifier = Modifier.fillMaxWidth()
            ) { Text("SAVE DRAFT", fontFamily = Readout, letterSpacing = 1.sp) }
        }
        items(state.drafts, key = { it.id }) { draft ->
            Row(Modifier.fillMaxWidth().clip(Sharper).background(scheme.surface).border(1.dp, scheme.outline, Sharper).padding(13.dp), verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(draft.kind, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                    Text(draft.road, fontSize = 12.sp, color = scheme.onSurfaceVariant)
                    Text("LOCAL · UNVERIFIED", fontSize = 9.sp, letterSpacing = 1.2.sp, color = scheme.tertiary, fontFamily = Readout)
                }
                IconButton(onClick = { DriveStore.deleteDraft(draft.id) }) { Icon(Icons.Outlined.Delete, "Delete") }
            }
        }
    }
}

@Composable
private fun Settings(state: DriveState, billing: Billing?) {
    val context = LocalContext.current
    val scheme = MaterialTheme.colorScheme
    var privacy by remember { mutableStateOf(false) }
    var premium by remember { mutableStateOf(false) }
    // Collected unconditionally: a null billing client still needs a flow here, or the
    // composable call would be conditional.
    val isPremium by (billing?.premium ?: emptyFlow()).collectAsStateWithLifecycle(initialValue = false)
    if (premium && billing != null) PremiumDialog(billing, onDismiss = { premium = false })
    if (privacy) AlertDialog(
        onDismissRequest = { privacy = false }, title = { Text("Privacy notice") },
        text = { Text(PrivacyNotice.text, modifier = Modifier.verticalScroll(rememberScrollState())) },
        confirmButton = { TextButton(onClick = { privacy = false }) { Text("Close") } }
    )
    LazyColumn(contentPadding = PaddingValues(horizontal = 18.dp, vertical = 14.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        item { SectionLabel("APPEARANCE") }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(Appearance.SYSTEM to "SYSTEM", Appearance.LIGHT to "LIGHT", Appearance.DARK to "DARK").forEach { (value, label) ->
                    FilterChip(
                        selected = state.appearance == value, onClick = { DriveStore.setAppearance(value) },
                        label = { Text(label, fontFamily = Readout, fontSize = 11.sp, letterSpacing = 1.sp) },
                        shape = Sharper
                    )
                }
            }
        }
        item { SectionLabel("ALERTS") }
        item { SwitchRow("Voice alerts", "Spoken warning. Ducks music rather than stopping it.", state.voice, DriveStore::setVoice) }
        item { SwitchRow("Alert tone", "Short chime before the voice.", state.tone, DriveStore::setTone) }
        item {
            Text(
                when {
                    state.voice && state.tone -> "Chime, then the spoken warning."
                    state.voice -> "Spoken warning only."
                    state.tone -> "Chime only."
                    else -> "Both off — alerts arrive as a notification only."
                },
                fontSize = 11.sp, color = scheme.onSurfaceVariant
            )
        }
        item { SectionLabel("COUNTRY") }
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("BH", "SA", "AE", "QA", "KW", "OM").chunked(3).forEach { row ->
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        row.forEach { code ->
                            FilterChip(
                                selected = state.country == code, onClick = { DriveStore.country(code) },
                                label = { Text(code, fontFamily = Readout, fontSize = 12.sp) },
                                enabled = state.mode == Mode.IDLE, shape = Sharper
                            )
                        }
                    }
                }
            }
        }
        item { Text("Only Bahrain has a bundled fictional pack. No country has verified live coverage in this build.", fontSize = 11.sp, color = scheme.onSurfaceVariant) }
        item { SectionLabel("SALIM PREMIUM") }
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    if (isPremium) "Active. Every warning stays free either way."
                    else "Optional. Every camera and hazard warning works without it.",
                    fontSize = 12.sp, lineHeight = 17.sp, color = scheme.onSurfaceVariant
                )
                OutlinedButton(
                    onClick = { premium = true },
                    shape = Sharp,
                    modifier = Modifier.fillMaxWidth(),
                    enabled = billing != null
                ) { Text(if (isPremium) "Manage Salim Premium" else "See Salim Premium") }
            }
        }
        item { Hairline() }
        item {
            Column(Modifier.fillMaxWidth().clip(Sharp).background(scheme.surface).border(1.dp, scheme.outline, Sharp).padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("YOUR JOURNEY STAYS YOURS", fontSize = 10.sp, letterSpacing = 1.4.sp, color = scheme.primary, fontFamily = Readout)
                Text("No account and no advertising SDK. Camera positions come from OpenStreetMap, fetched for the area around you and cached on the device; the query carries no identifier. No route is uploaded. Subscriptions are handled by Google Play, which never passes Salim a card number.", fontSize = 12.sp, lineHeight = 17.sp, color = scheme.onSurfaceVariant)
            }
        }
        item {
            OutlinedButton(
                onClick = { context.startActivity(Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:${context.packageName}"))) },
                shape = Sharp, modifier = Modifier.fillMaxWidth()
            ) { Text("System permissions") }
        }
        item { OutlinedButton(onClick = { privacy = true }, shape = Sharp, modifier = Modifier.fillMaxWidth()) { Text("Privacy notice") } }
        item {
            Text(
                "Build ${BuildConfig.VERSION_NAME} · ${BuildConfig.APPLICATION_ID}\nCarPlay, Android Auto and watches are not enabled. In an emergency in Bahrain, call 999.",
                fontSize = 10.sp, lineHeight = 15.sp, color = scheme.onSurfaceVariant, fontFamily = Readout
            )
        }
    }
}

@Composable
private fun SectionLabel(text: String) {
    Text(text, fontSize = 10.sp, letterSpacing = 2.sp, color = MaterialTheme.colorScheme.primary, fontFamily = Readout)
}

@Composable
private fun SwitchRow(title: String, detail: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Column(Modifier.weight(1f)) {
            Text(title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
            Text(detail, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Switch(checked = checked, onCheckedChange = onChange)
    }
}
