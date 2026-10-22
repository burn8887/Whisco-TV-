package app.salim

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.text.DateFormat
import java.util.Date

private val Forest=Color(0xFF1F5C47)
private val ForestDeep=Color(0xFF123A2B)
private val CanvasColor=Color(0xFFF5F7F0)
// Secondary and tertiary ink. The framework grey it replaces was 3.54:1 on white,
// under the 4.5:1 readability floor, so labels read as decoration rather than text.
private val Muted=Color(0xFF55655A)       // 6.2:1 on white, 5.3:1 on the card tint
private val AmberInk=Color(0xFF6B5320)    // 6.2:1 on the amber cards

private val NightCanvas=Color(0xFF0F1512)
private val NightSurface=Color(0xFF18211C)
private val NightInk=Color(0xFFE4EDE6)
private val NightMuted=Color(0xFFA8BBAE)  // 7.6:1 on NightCanvas
private val NightMint=Color(0xFF7FC3A3)   // 8.9:1 on NightCanvas
private val NightAmber=Color(0xFFE8C07A)  // 11.4:1 on NightCanvas

private val LightScheme=lightColorScheme(
    primary=Forest,onPrimary=Color.White,
    background=CanvasColor,onBackground=Color(0xFF293D2F),
    surface=Color.White,onSurface=Color(0xFF293D2F),
    surfaceVariant=Color(0xFFE7ECDE),onSurfaceVariant=Muted,
    tertiary=AmberInk,onTertiary=Color.White,
    secondaryContainer=Color(0xFFE9F0DE),onSecondaryContainer=Color(0xFF293D2F)
)
private val DarkScheme=darkColorScheme(
    primary=NightMint,onPrimary=Color(0xFF07281C),
    background=NightCanvas,onBackground=NightInk,
    surface=NightSurface,onSurface=NightInk,
    surfaceVariant=Color(0xFF22302A),onSurfaceVariant=NightMuted,
    tertiary=NightAmber,onTertiary=Color(0xFF241A00),
    secondaryContainer=Color(0xFF1E2E25),onSecondaryContainer=NightInk
)

class MainActivity: ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        DriveStore.initialize(this)
        setContent { Salim() }
    }
    override fun onStop() {
        if(!isChangingConfigurations && DriveStore.state.value.mode==Mode.DEMO)DriveStore.end("Simulation paused when app left foreground · Saved")
        super.onStop()
    }
}

@Composable private fun Salim() {
    val state by DriveStore.state.collectAsStateWithLifecycle()
    val dark=when(state.appearance) {
        Appearance.SYSTEM->isSystemInDarkTheme()
        Appearance.LIGHT->false
        Appearance.DARK->true
    }
    MaterialTheme(colorScheme=if(dark)DarkScheme else LightScheme) { SalimBody(state) }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable private fun SalimBody(state: DriveState) {
    val context=LocalContext.current
    var tab by remember { mutableIntStateOf(0) }
    var disclosure by remember { mutableStateOf(false) }
    // A running session takes the whole screen. Minimising keeps it running and
    // returns to the dashboard; ending it drops back automatically.
    var minimised by remember { mutableStateOf(false) }
    LaunchedEffect(state.mode) { if(state.mode==Mode.IDLE) minimised=false }
    if(state.mode!=Mode.IDLE && !minimised) { DriveScreen(state,onMinimise={minimised=true}); return }
    val tabs=listOf("Overview","My trips","Community","Settings")
    val icons=listOf(Icons.Outlined.Dashboard,Icons.Outlined.Route,Icons.Outlined.People,Icons.Outlined.Tune)
    val scheme=MaterialTheme.colorScheme
    val permission=rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) {
        if(ContextCompat.checkSelfPermission(context,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED) {
            if(DriveStore.state.value.mode==Mode.IDLE)runCatching { ContextCompat.startForegroundService(context,Intent(context,DriveService::class.java)) }.onFailure { DriveStore.message("Open Salim and check permissions before starting GPS") }
        } else DriveStore.message("Precise location was denied. Demo mode still works; check system settings for GPS tests.")
    }
    fun stop() { if(state.mode==Mode.GPS)context.stopService(Intent(context,DriveService::class.java)) else DriveStore.end() }
    Scaffold(
        topBar={TopAppBar(
            title={BrandLockup(if(tab==0)null else tabs[tab])},
            actions={Text("DEMO · ${state.country}",fontSize=11.sp,letterSpacing=.8.sp,color=scheme.onSurfaceVariant,modifier=Modifier.padding(end=18.dp))},
            colors=TopAppBarDefaults.topAppBarColors(containerColor=scheme.background,titleContentColor=scheme.onBackground))},
        bottomBar={NavigationBar(containerColor=scheme.surface) { tabs.forEachIndexed { i,title -> NavigationBarItem(selected=tab==i,onClick={tab=i},icon={Icon(icons[i],title)},label={Text(title,fontSize=12.sp)}) } }},
        containerColor=scheme.background
    ) { inset ->
        Box(Modifier.padding(inset)) {
            when(tab) {
                0->Dashboard(state,onDemo={DriveStore.begin(Mode.DEMO)},onGPS={disclosure=true},onStop={stop()})
                1->Trips(state)
                2->Community(state)
                3->Preferences(state)
            }
        }
    }
    if(disclosure)AlertDialog(onDismissRequest={disclosure=false},icon={Icon(Icons.Outlined.Shield,null)},title={Text("Start a GPS test?")},text={Text("Set up only while safely parked. Salim will use precise device location during this test, including in the background, until you end it from the app or its notification. The camera, hazard and section data is fictional. Do not use it for road-safety decisions. No precise route is uploaded. If a feed is later configured, regional sync reveals a coarse area.")},confirmButton={TextButton(onClick={
        disclosure=false
        val permissions=mutableListOf(Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.ACCESS_COARSE_LOCATION)
        if(Build.VERSION.SDK_INT>=33)permissions+=Manifest.permission.POST_NOTIFICATIONS
        permission.launch(permissions.toTypedArray())
    }){Text("Start GPS test")}},dismissButton={TextButton(onClick={disclosure=false}){Text("Not now")}})
}

/**
 * The brand lockup. The mark is the Arabic initial in a rounded gradient tile, which
 * reads as a deliberate identity at 40dp and needs no bitmap asset at any density.
 */
@Composable private fun BrandLockup(screen: String?) {
    Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(11.dp)) {
        Box(Modifier.size(40.dp).background(Brush.linearGradient(listOf(Forest,ForestDeep)),RoundedCornerShape(13.dp)),contentAlignment=Alignment.Center) {
            Text("س",color=Color.White,fontSize=21.sp,fontWeight=FontWeight.Bold)
        }
        Column {
            Text(if(screen==null)"Salim" else screen,fontSize=if(screen==null)21.sp else 19.sp,fontWeight=FontWeight.Bold,lineHeight=23.sp)
            // The Arabic name alone. "سالم · Road awareness" clipped against the
            // top-bar action on a 360dp phone; the tagline belongs in the hero.
            if(screen==null)Text("سالم",fontSize=12.sp,color=MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable private fun Dashboard(state: DriveState,onDemo: ()->Unit,onGPS: ()->Unit,onStop: ()->Unit) {
    val context=LocalContext.current
    val scheme=MaterialTheme.colorScheme
    var destination by remember { mutableStateOf("") }
    val active=state.mode!=Mode.IDLE
    LazyColumn(contentPadding=PaddingValues(horizontal=20.dp,vertical=18.dp),verticalArrangement=Arrangement.spacedBy(16.dp)) {
        item { Hero() }
        item { Row(horizontalArrangement=Arrangement.spacedBy(12.dp)) { Metric("AWARENESS",if(active)"Test active" else "Ready to go",Modifier.weight(1f));Metric("LOCAL PACK","${state.hazards.size} alerts",Modifier.weight(1f)) } }
        if(state.mode==Mode.GPS && !state.acquired) item { Acquiring(state) }
        item { Card(colors=CardDefaults.cardColors(containerColor=scheme.surface),shape=RoundedCornerShape(18.dp)) {
            Row(Modifier.fillMaxWidth().padding(16.dp),horizontalArrangement=Arrangement.SpaceBetween) { Text("Your surroundings",fontWeight=FontWeight.Medium);Text("Bahrain demo",fontSize=12.sp,color=scheme.primary) }
            Illustration()
            Row(Modifier.fillMaxWidth().padding(16.dp),horizontalArrangement=Arrangement.SpaceBetween,verticalAlignment=Alignment.CenterVertically) { Column { Text("${state.fix?.let { (it.speed*3.6).toInt() } ?: "—"} km/h",fontSize=28.sp,fontWeight=FontWeight.SemiBold);Text(if(state.mode==Mode.DEMO)"SIMULATED SPEED" else if(state.acquired)"DEVICE GPS" else "WAITING FOR FIX",fontSize=11.sp,color=scheme.onSurfaceVariant) };Row(verticalAlignment=Alignment.CenterVertically) { Icon(Icons.Outlined.VolumeUp,"Voice alerts",tint=scheme.primary);Switch(checked=state.voice,onCheckedChange=DriveStore::setVoice) } }
            Text("Illustrative map · No live navigation",fontSize=11.sp,color=scheme.onSurfaceVariant,modifier=Modifier.padding(start=16.dp,bottom=14.dp))
        } }
        state.average?.let { average -> item { Card(colors=CardDefaults.cardColors(containerColor=scheme.secondaryContainer)) { Column(Modifier.fillMaxWidth().padding(20.dp),verticalArrangement=Arrangement.spacedBy(8.dp)) { Text("DEMO SECTION CONTROL",fontSize=12.sp,color=scheme.primary);Text("${"%.1f".format(average.kmh)} km/h",fontSize=30.sp,fontWeight=FontWeight.SemiBold);Text(if(average.estimated)"Estimated GPS average · Includes stopped time" else "Completed · Sample surveyed-length average",fontSize=12.sp);Text("Sample limit ${average.limit} km/h. Not an enforcement measurement.",fontSize=12.sp,color=scheme.onSurfaceVariant) } } } }
        state.warning?.let { warning -> item { Card(colors=CardDefaults.cardColors(containerColor=scheme.surfaceVariant)) { Column(Modifier.fillMaxWidth().padding(20.dp),verticalArrangement=Arrangement.spacedBy(8.dp)) { Text("ON YOUR RADAR · DEMO",fontSize=12.sp,color=scheme.tertiary);Text(warning.hazard.title,fontSize=23.sp,fontWeight=FontWeight.SemiBold);Text(warning.hazard.road,fontSize=13.sp);Text("${warning.meters.toInt()} m at alert time",fontWeight=FontWeight.Medium);Text("Always follow actual posted signs.",fontSize=12.sp) } } } }
        item { Column(verticalArrangement=Arrangement.spacedBy(10.dp)) {
            Text(state.status,fontSize=13.sp,color=scheme.primary)
            Text(state.feed,fontSize=12.sp,color=scheme.onSurfaceVariant)
            if(active)Button(onClick=onStop,modifier=Modifier.fillMaxWidth().height(50.dp),shape=RoundedCornerShape(9.dp)){Icon(Icons.Outlined.Stop,null);Spacer(Modifier.width(8.dp));Text("End test · ${state.seconds/60}m ${state.seconds%60}s")}
            else { Button(onClick=onDemo,enabled=state.country=="BH",modifier=Modifier.fillMaxWidth().height(50.dp),shape=RoundedCornerShape(9.dp)){Icon(Icons.Outlined.PlayArrow,null);Spacer(Modifier.width(8.dp));Text("Run a simulated drive")};OutlinedButton(onClick=onGPS,modifier=Modifier.fillMaxWidth()){Text("Start device GPS test")} }
        } }
        item { Text("NEARBY DEMO ALERTS",fontSize=12.sp,letterSpacing=1.sp,color=scheme.primary) }
        items(state.hazards,key={it.id}) { hazard -> Card(colors=CardDefaults.cardColors(containerColor=scheme.surface)) { Row(Modifier.fillMaxWidth().padding(16.dp),verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(12.dp)) { Icon(Icons.Outlined.Warning,null,tint=scheme.tertiary);Column {Text(hazard.title,fontWeight=FontWeight.Medium);Text(hazard.road,fontSize=12.sp,color=scheme.onSurfaceVariant)} } } }
        item { OutlinedTextField(value=destination,onValueChange={destination=it.take(120)},enabled=!active,label={Text("Where are you heading?")},singleLine=true,modifier=Modifier.fillMaxWidth());OutlinedButton(onClick={runCatching {context.startActivity(Intent(Intent.ACTION_VIEW,Uri.parse("geo:26.22,50.55?q=${Uri.encode(destination)}")))}.onFailure{DriveStore.message("No compatible maps app is installed")}},enabled=destination.isNotBlank()&&!active,modifier=Modifier.fillMaxWidth()){Text("Open destination in Maps")} }
        item { Text("Simulation runs only while this app is in the foreground. A GPS test uses a visible location service. OS force-stop and battery restrictions may interrupt it. End the test when finished.",fontSize=12.sp,lineHeight=17.sp,color=scheme.onSurfaceVariant) }
    }
}

@Composable private fun Hero() {
    Box(Modifier.fillMaxWidth().clip(RoundedCornerShape(22.dp)).background(Brush.linearGradient(listOf(Forest,ForestDeep)))) {
        Column(Modifier.padding(22.dp),verticalArrangement=Arrangement.spacedBy(9.dp)) {
            Text("AWARE, NOT ALARMED",fontSize=11.sp,letterSpacing=1.5.sp,color=Color.White.copy(alpha=.78f))
            Text("Know what’s ahead.\nKeep your calm.",fontSize=29.sp,lineHeight=36.sp,fontWeight=FontWeight.SemiBold,color=Color.White)
            Text("اعرف ما أمامك.",fontSize=15.sp,color=Color.White.copy(alpha=.92f))
            Text("قُد بهدوء.",fontSize=15.sp,color=Color.White.copy(alpha=.92f))
            Spacer(Modifier.height(2.dp))
            Text("Fictional data · Not for real driving guidance",fontSize=12.sp,color=Color.White.copy(alpha=.82f))
        }
    }
}

/** Visible proof that the location pipeline is running, before the first fix lands. */
@Composable private fun Acquiring(state: DriveState) {
    val scheme=MaterialTheme.colorScheme
    Card(colors=CardDefaults.cardColors(containerColor=scheme.surfaceVariant),shape=RoundedCornerShape(18.dp)) {
        Column(Modifier.fillMaxWidth().padding(20.dp),verticalArrangement=Arrangement.spacedBy(10.dp)) {
            Text("FINDING YOUR POSITION",fontSize=11.sp,letterSpacing=1.3.sp,color=scheme.primary)
            Row(verticalAlignment=Alignment.Bottom,horizontalArrangement=Arrangement.spacedBy(8.dp)) { Text("${state.seconds}s",fontSize=32.sp,fontWeight=FontWeight.SemiBold);Text("searching",fontSize=13.sp,color=scheme.onSurfaceVariant,modifier=Modifier.padding(bottom=6.dp)) }
            // Progress toward the one minute a cold fix can take. A plain box rather
            // than LinearProgressIndicator, whose overloads changed across Material 3
            // versions; this cannot break on a dependency bump.
            val reached=(state.seconds/60f).coerceIn(.03f,1f)
            Box(Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(3.dp)).background(scheme.onSurfaceVariant.copy(alpha=.22f))) {
                Box(Modifier.fillMaxWidth(reached).height(6.dp).background(scheme.primary))
            }
            Text("A cold GPS start can take up to a minute outdoors. Indoors, move near a window — Salim accepts a coarse network fix while the satellites lock.",fontSize=12.sp,lineHeight=17.sp,color=scheme.onSurfaceVariant)
        }
    }
}

@Composable private fun Metric(label: String,value: String,modifier: Modifier) { Card(modifier,colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface),shape=RoundedCornerShape(13.dp)) { Column(Modifier.padding(16.dp),verticalArrangement=Arrangement.spacedBy(10.dp)) {Text(label,fontSize=11.sp,color=MaterialTheme.colorScheme.onSurfaceVariant);Text(value,fontSize=19.sp,fontWeight=FontWeight.SemiBold)} } }

@Composable private fun Illustration() {
    Canvas(Modifier.fillMaxWidth().height(235.dp).semantics { contentDescription="Illustration of Bahrain roads. Not a navigation map." }) {
        drawRect(Color(0xFFDCEBE5))
        val land=Path().apply {moveTo(0f,size.height*.22f);lineTo(size.width*.45f,size.height*.15f);lineTo(size.width*.64f,size.height*.37f);lineTo(size.width*.88f,size.height*.44f);lineTo(size.width,size.height*.75f);lineTo(size.width,size.height);lineTo(0f,size.height);close()}
        drawPath(land,Color(0xFFE8E9DE))
        for(i in 0..12)drawLine(Color(0xFFF9F9F0),Offset(i*size.width/12, size.height*.4f),Offset(i*size.width/12+50,size.height),4f)
        for(i in 1..7)drawLine(Color(0xFFF9F9F0),Offset(0f,size.height*(.25f+i*.1f)),Offset(size.width,size.height*(.1f+i*.1f)),5f)
        val route=Path().apply {moveTo(size.width*.35f,size.height*.9f);cubicTo(size.width*.37f,size.height*.62f,size.width*.54f,size.height*.68f,size.width*.50f,size.height*.41f);lineTo(size.width*.64f,size.height*.38f)}
        drawPath(route,Color.White,style=Stroke(13f,cap=StrokeCap.Round));drawPath(route,Forest,style=Stroke(7f,cap=StrokeCap.Round))
        drawCircle(Forest,16f,Offset(size.width*.36f,size.height*.84f));drawCircle(Color.White,7f,Offset(size.width*.36f,size.height*.84f))
        listOf(Offset(.52f,.55f),Offset(.70f,.70f),Offset(.64f,.38f)).forEach { drawCircle(Color.White,15f,Offset(size.width*it.x,size.height*it.y));drawCircle(Color(0xFFD7BC7D),10f,Offset(size.width*it.x,size.height*it.y)) }
    }
}

@Composable private fun Trips(state: DriveState) {
    var clear by remember { mutableStateOf(false) }
    val scheme=MaterialTheme.colorScheme
    LazyColumn(contentPadding=PaddingValues(20.dp),verticalArrangement=Arrangement.spacedBy(14.dp)) {
        item { Text("Session summaries stay on this device. Precise routes are not saved.",fontSize=13.sp,color=scheme.onSurfaceVariant) }
        if(state.trips.isEmpty())item { Text("Your next journey starts here. Run a demo and finish it to see a summary.",modifier=Modifier.padding(vertical=60.dp)) }
        items(state.trips,key={it.id}) { trip->Card(colors=CardDefaults.cardColors(containerColor=scheme.surface)) { Column(Modifier.fillMaxWidth().padding(20.dp),verticalArrangement=Arrangement.spacedBy(8.dp)) { Text(if(trip.interrupted)"Interrupted session · Duration unknown" else if(trip.demo)"Simulated drive" else "Device GPS test",fontWeight=FontWeight.Medium);Text(DateFormat.getDateTimeInstance().format(Date(trip.at)),fontSize=12.sp,color=scheme.onSurfaceVariant);if(!trip.interrupted)Text("${trip.seconds/60}m ${trip.seconds%60}s · ${trip.alerts} alerts",fontSize=13.sp) } } }
        if(state.trips.isNotEmpty())item {TextButton(onClick={clear=true}){Text("Delete local trip history")}}
    }
    if(clear)AlertDialog(onDismissRequest={clear=false},title={Text("Delete trip history?")},text={Text("This removes local summaries and cannot be undone.")},confirmButton={TextButton(onClick={DriveStore.clearTrips();clear=false}){Text("Delete")}},dismissButton={TextButton(onClick={clear=false}){Text("Cancel")}})
}

@Composable private fun Community(state: DriveState) {
    var road by remember {mutableStateOf("")};var kind by remember {mutableStateOf("Road hazard")}
    val scheme=MaterialTheme.colorScheme
    LazyColumn(contentPadding=PaddingValues(20.dp),verticalArrangement=Arrangement.spacedBy(16.dp)) {
        item {Text("A little heads-up. A safer road.",fontSize=25.sp,fontWeight=FontWeight.SemiBold);Spacer(Modifier.height(12.dp));Text("Only report when safely parked. These are local drafts, not published community alerts.",fontSize=13.sp,color=scheme.onSurfaceVariant)}
        item {Column {listOf("Road hazard","Roadworks","Traffic congestion","Road bump").forEach {type->Row(verticalAlignment=Alignment.CenterVertically){RadioButton(selected=kind==type,onClick={kind=type},enabled=state.mode==Mode.IDLE);Text(type,fontSize=13.sp)}}}}
        item {OutlinedTextField(value=road,onValueChange={road=it.take(120)},label={Text("Road or location")},enabled=state.mode==Mode.IDLE,modifier=Modifier.fillMaxWidth())}
        item {Button(onClick={DriveStore.draft(road,kind);road=""},enabled=road.isNotBlank()&&state.mode==Mode.IDLE,modifier=Modifier.fillMaxWidth()){Text("Save local draft")}}
        items(state.drafts,key={it.id}) {draft->Card(colors=CardDefaults.cardColors(containerColor=scheme.surface)){Row(Modifier.fillMaxWidth().padding(16.dp),verticalAlignment=Alignment.CenterVertically){Column(Modifier.weight(1f)){Text(draft.kind);Text(draft.road,fontSize=12.sp,color=scheme.onSurfaceVariant);Text("Local · Unverified",fontSize=11.sp,color=scheme.onSurfaceVariant)};IconButton(onClick={DriveStore.deleteDraft(draft.id)}){Icon(Icons.Outlined.Delete,"Delete report")}}}}
    }
}

@Composable private fun Preferences(state: DriveState) {
    val context=LocalContext.current
    val scheme=MaterialTheme.colorScheme
    var privacy by remember { mutableStateOf(false) }
    if (privacy) {
        AlertDialog(
            onDismissRequest = { privacy = false },
            title = { Text("Privacy notice") },
            text = { Text(PrivacyNotice.text, modifier = Modifier.verticalScroll(rememberScrollState())) },
            confirmButton = { TextButton(onClick = { privacy = false }) { Text("Close") } }
        )
    }
    LazyColumn(contentPadding=PaddingValues(20.dp),verticalArrangement=Arrangement.spacedBy(18.dp)) {
        item { SectionLabel("APPEARANCE") }
        item { Row(horizontalArrangement=Arrangement.spacedBy(10.dp)) {
            listOf(Appearance.SYSTEM to "System", Appearance.LIGHT to "Light", Appearance.DARK to "Dark").forEach { (value,label) ->
                FilterChip(selected=state.appearance==value,onClick={DriveStore.setAppearance(value)},label={Text(label)})
            }
        } }
        item { Text("System follows your phone's day and night setting.",fontSize=12.sp,color=scheme.onSurfaceVariant) }
        item { SectionLabel("ALERTS") }
        item { SettingRow("Voice alerts","Spoken warning. Ducks your music rather than stopping it.",state.voice,DriveStore::setVoice) }
        item { SettingRow("Alert tone","A short chime before the voice.",state.tone,DriveStore::setTone) }
        item { Text(if(!state.voice && !state.tone)"Both are off, so alerts arrive as a notification only." else if(state.voice && state.tone)"Chime, then the spoken warning." else if(state.voice)"Spoken warning only." else "Chime only.",fontSize=12.sp,color=scheme.onSurfaceVariant) }
        item { SectionLabel("COUNTRY") }
        item { Column {listOf("BH","SA","AE","QA","KW","OM").chunked(3).forEach {row->Row(horizontalArrangement=Arrangement.spacedBy(10.dp)){row.forEach {code->FilterChip(selected=state.country==code,onClick={DriveStore.country(code)},label={Text(code)},enabled=state.mode==Mode.IDLE)}}}} }
        item { Text("Only Bahrain has a bundled fictional pack. No country has verified live coverage in this test build.",fontSize=13.sp,color=scheme.onSurfaceVariant) }
        item { Card(colors=CardDefaults.cardColors(containerColor=scheme.secondaryContainer)){Column(Modifier.padding(20.dp),verticalArrangement=Arrangement.spacedBy(12.dp)){Icon(Icons.Outlined.Shield,null,tint=scheme.primary);Text("Your journey stays yours.",fontWeight=FontWeight.Medium);Text("No account, ads or billing SDKs are active in this test build. Static alerts remain in SQLite offline. No route is uploaded. If configured later, regional sync reveals only a coarse tile.",fontSize=13.sp,lineHeight=19.sp)}} }
        item { OutlinedButton(onClick={context.startActivity(Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS,Uri.parse("package:${context.packageName}")))},modifier=Modifier.fillMaxWidth()){Text("Open system permissions")} }
        item { OutlinedButton(onClick={privacy=true},modifier=Modifier.fillMaxWidth()){Text("Read privacy notice")} }
        item { Text("Build ${BuildConfig.VERSION_NAME} · ${BuildConfig.APPLICATION_ID}\nCarPlay/Android Auto, watches, automatic vehicle startup, premium 3D navigation and billing are not enabled in this build. In an emergency in Bahrain, call 999.",fontSize=12.sp,lineHeight=18.sp,color=scheme.onSurfaceVariant) }
    }
}

@Composable private fun SectionLabel(text: String) { Text(text,fontSize=11.sp,letterSpacing=1.3.sp,color=MaterialTheme.colorScheme.primary) }

@Composable private fun SettingRow(title: String,detail: String,checked: Boolean,onChange: (Boolean)->Unit) {
    Row(verticalAlignment=Alignment.CenterVertically) {
        Column(Modifier.weight(1f)) { Text(title,fontWeight=FontWeight.Medium);Text(detail,fontSize=12.sp,color=MaterialTheme.colorScheme.onSurfaceVariant) }
        Switch(checked=checked,onCheckedChange=onChange)
    }
}

/**
 * Full-screen drive view. The dashboard is a list of cards, which reads as a form; a
 * running drive should read as navigation. Everything here sits over the map rather
 * than beside it, so the road is the subject and the numbers are the overlay.
 */
@Composable private fun DriveScreen(state: DriveState, onMinimise: ()->Unit) {
    val context=LocalContext.current
    val scheme=MaterialTheme.colorScheme
    fun end() { if(state.mode==Mode.GPS)context.stopService(Intent(context,DriveService::class.java)) else DriveStore.end() }
    Box(Modifier.fillMaxSize().background(scheme.background)) {
        DriveMap(state)
        // The map is an illustration, and saying so on the drive screen is the only
        // honest option until a real tile source is wired in.
        Text("Illustrative map · Fictional demo data",fontSize=10.sp,color=scheme.onSurfaceVariant,
            modifier=Modifier.align(Alignment.BottomCenter).systemBarsPadding().padding(bottom=6.dp))

        Row(Modifier.fillMaxWidth().systemBarsPadding().padding(horizontal=12.dp,vertical=8.dp),
            verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(4.dp)) {
            Column(Modifier.weight(1f)) {
                Text(if(state.mode==Mode.DEMO)"DEMO DRIVE" else "GPS TEST",fontSize=10.sp,letterSpacing=1.6.sp,color=scheme.primary)
                Text(if(state.mode==Mode.DEMO)"Simulated · no device GPS" else state.status,fontSize=12.sp,color=scheme.onSurfaceVariant,maxLines=1)
            }
            IconButton(onClick={DriveStore.setVoice(!state.voice)}) {
                Icon(if(state.voice)Icons.Outlined.VolumeUp else Icons.Outlined.VolumeOff,"Voice alerts",tint=scheme.onSurface)
            }
            IconButton(onClick=onMinimise) { Icon(Icons.Outlined.KeyboardArrowDown,"Minimise",tint=scheme.onSurface) }
            Button(onClick={end()},shape=RoundedCornerShape(10.dp),
                colors=ButtonDefaults.buttonColors(containerColor=scheme.error,contentColor=scheme.onError),
                contentPadding=PaddingValues(horizontal=18.dp,vertical=8.dp)) { Text("End",fontWeight=FontWeight.SemiBold) }
        }

        if(state.mode==Mode.GPS && !state.acquired)
            Box(Modifier.align(Alignment.Center).padding(horizontal=28.dp)) { Acquiring(state) }

        state.warning?.let { warning ->
            Card(Modifier.align(Alignment.TopCenter).systemBarsPadding().padding(top=64.dp,start=16.dp,end=16.dp),
                colors=CardDefaults.cardColors(containerColor=scheme.surfaceVariant),shape=RoundedCornerShape(16.dp)) {
                Row(Modifier.fillMaxWidth().padding(16.dp),verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(12.dp)) {
                    Icon(Icons.Outlined.Warning,null,tint=scheme.tertiary)
                    Column { Text("${warning.meters.toInt()} m",fontSize=22.sp,fontWeight=FontWeight.Bold);Text(warning.hazard.title,fontSize=14.sp) }
                }
            }
        }

        Row(Modifier.align(Alignment.BottomStart).systemBarsPadding().padding(start=22.dp,bottom=34.dp),
            verticalAlignment=Alignment.Bottom,horizontalArrangement=Arrangement.spacedBy(10.dp)) {
            Text("${state.fix?.let { (it.speed*3.6).toInt() } ?: 0}",fontSize=78.sp,fontWeight=FontWeight.Bold,lineHeight=82.sp,
                color=if(state.acquired||state.mode==Mode.DEMO)scheme.onSurface else scheme.onSurfaceVariant)
            Column(Modifier.padding(bottom=14.dp)) {
                Text("km/h",fontSize=15.sp,color=scheme.onSurfaceVariant)
                Text("${state.seconds/60}:${(state.seconds%60).toString().padStart(2,'0')}",fontSize=13.sp,color=scheme.onSurfaceVariant)
            }
        }
    }
}

/**
 * Full-bleed road sketch. The route advances with elapsed time so the view is alive
 * rather than a static picture; the marker moves along it. Deliberately abstract: it is
 * not claiming to be a position.
 */
@Composable private fun DriveMap(state: DriveState) {
    val ink=MaterialTheme.colorScheme.primary
    val seconds=state.seconds%75
    Canvas(Modifier.fillMaxSize().semantics { contentDescription="Illustrative demo road view. Not a navigation map." }) {
        drawRect(Color(0xFF13301F))
        // Land masses, kept dark so the overlay text keeps its contrast.
        val land=Path().apply { moveTo(0f,size.height*.30f);lineTo(size.width*.55f,size.height*.20f)
            lineTo(size.width*.85f,size.height*.46f);lineTo(size.width,size.height*.58f)
            lineTo(size.width,size.height);lineTo(0f,size.height);close() }
        drawPath(land,Color(0xFF1A3B28))
        // Minor roads.
        for(i in 0..9) drawLine(Color(0xFF2B5238),Offset(0f,size.height*(.30f+i*.09f)),Offset(size.width,size.height*(.16f+i*.09f)),3f)
        for(i in 0..6) drawLine(Color(0xFF2B5238),Offset(i*size.width/6,size.height*.2f),Offset(i*size.width/6+90,size.height),3f)
        // The route.
        val route=Path().apply {
            moveTo(size.width*.18f,size.height*.94f)
            cubicTo(size.width*.26f,size.height*.72f,size.width*.52f,size.height*.78f,size.width*.50f,size.height*.52f)
            cubicTo(size.width*.48f,size.height*.30f,size.width*.76f,size.height*.30f,size.width*.82f,size.height*.16f)
        }
        drawPath(route,Color(0xFF0B1F15),style=Stroke(22f,cap=StrokeCap.Round))
        drawPath(route,ink.copy(alpha=.85f),style=Stroke(11f,cap=StrokeCap.Round))
        // Progress marker, looping so the view keeps moving during a long session.
        val t=(seconds/75f).coerceIn(0f,1f)
        val marker=Offset(size.width*(0.18f+0.64f*t),size.height*(0.94f-0.78f*t))
        drawCircle(Color(0xFF0B1F15),26f,marker)
        drawCircle(ink,17f,marker)
        drawCircle(Color.White,7f,marker)
    }
}
