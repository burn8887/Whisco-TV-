package app.sahm

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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
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

private val Forest=Color(0xFF245A43)
private val CanvasColor=Color(0xFFF5F7F0)
class MainActivity: ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        DriveStore.initialize(this)
        setContent { MaterialTheme(colorScheme=lightColorScheme(primary=Forest,background=CanvasColor,surface=Color.White,onSurface=Color(0xFF293D2F))) { Sahm() } }
    }
    override fun onStop() {
        if(!isChangingConfigurations && DriveStore.state.value.mode==Mode.DEMO)DriveStore.end("Simulation paused when app left foreground · Saved")
        super.onStop()
    }
}
@OptIn(ExperimentalMaterial3Api::class)
@Composable private fun Sahm() {
    val state by DriveStore.state.collectAsStateWithLifecycle()
    val context=LocalContext.current
    var tab by remember { mutableIntStateOf(0) }
    var disclosure by remember { mutableStateOf(false) }
    val tabs=listOf("Overview","My trips","Community","Settings")
    val icons=listOf(Icons.Outlined.Dashboard,Icons.Outlined.Route,Icons.Outlined.People,Icons.Outlined.Tune)
    val permission=rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) {
        if(ContextCompat.checkSelfPermission(context,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED) {
            if(DriveStore.state.value.mode==Mode.IDLE)runCatching { ContextCompat.startForegroundService(context,Intent(context,DriveService::class.java)) }.onFailure { DriveStore.message("Open Sahm and check permissions before starting GPS") }
        } else DriveStore.message("Precise location was denied. Demo mode still works; check system settings for GPS tests.")
    }
    fun stop() { if(state.mode==Mode.GPS)context.stopService(Intent(context,DriveService::class.java)) else DriveStore.end() }
    Scaffold(topBar={TopAppBar(title={Text(if(tab==0)"sahm." else tabs[tab],fontSize=29.sp,fontWeight=FontWeight.Bold)},actions={Text("DEMO · ${state.country}",fontSize=10.sp,color=Forest,modifier=Modifier.padding(end=18.dp))},colors=TopAppBarDefaults.topAppBarColors(containerColor=CanvasColor))},bottomBar={NavigationBar(containerColor=Color.White) { tabs.forEachIndexed { i,title -> NavigationBarItem(selected=tab==i,onClick={tab=i},icon={Icon(icons[i],title)},label={Text(title,fontSize=10.sp)}) } }},containerColor=CanvasColor) { inset ->
        Box(Modifier.padding(inset)) {
            when(tab) {
                0->Dashboard(state,onDemo={DriveStore.begin(Mode.DEMO)},onGPS={disclosure=true},onStop={stop()})
                1->Trips(state)
                2->Community(state)
                3->Preferences(state)
            }
        }
    }
    if(disclosure)AlertDialog(onDismissRequest={disclosure=false},icon={Icon(Icons.Outlined.Shield,null)},title={Text("Start a GPS test?")},text={Text("Set up only while safely parked. Sahm will use precise device location during this test, including in the background, until you end it from the app or its notification. The camera, hazard and section data is fictional. Do not use it for road-safety decisions. No precise route is uploaded. If a feed is later configured, regional sync reveals a coarse area.")},confirmButton={TextButton(onClick={
        disclosure=false
        val permissions=mutableListOf(Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.ACCESS_COARSE_LOCATION)
        if(Build.VERSION.SDK_INT>=33)permissions+=Manifest.permission.POST_NOTIFICATIONS
        permission.launch(permissions.toTypedArray())
    }){Text("Start GPS test")}},dismissButton={TextButton(onClick={disclosure=false}){Text("Not now")}})
}
@Composable private fun Dashboard(state: DriveState,onDemo: ()->Unit,onGPS: ()->Unit,onStop: ()->Unit) {
    val context=LocalContext.current
    var destination by remember { mutableStateOf("") }
    val active=state.mode!=Mode.IDLE
    LazyColumn(contentPadding=PaddingValues(20.dp),verticalArrangement=Arrangement.spacedBy(18.dp)) {
        item { Column(verticalArrangement=Arrangement.spacedBy(10.dp)) { Text("YOUR ROAD. ONE STEP AHEAD.",fontSize=9.sp,letterSpacing=1.4.sp,color=Forest);Text("A little awareness.\nA better drive.",fontSize=31.sp,lineHeight=39.sp,fontWeight=FontWeight.SemiBold);Text("Fictional data · Not for real driving guidance",fontSize=12.sp,color=Color(0xFF9A7144)) } }
        item { Row(horizontalArrangement=Arrangement.spacedBy(12.dp)) { Metric("AWARENESS",if(active)"Test active" else "Ready to go",Modifier.weight(1f));Metric("LOCAL PACK","${state.hazards.size} alerts",Modifier.weight(1f)) } }
        item { Card(colors=CardDefaults.cardColors(containerColor=Color.White),shape=RoundedCornerShape(16.dp)) {
            Row(Modifier.fillMaxWidth().padding(16.dp),horizontalArrangement=Arrangement.SpaceBetween) { Text("Your surroundings",fontWeight=FontWeight.Medium);Text("Bahrain demo",fontSize=11.sp,color=Forest) }
            Illustration()
            Row(Modifier.fillMaxWidth().padding(16.dp),horizontalArrangement=Arrangement.SpaceBetween,verticalAlignment=Alignment.CenterVertically) { Column { Text("${state.fix?.let { (it.speed*3.6).toInt() } ?: "—"} km/h",fontSize=28.sp,fontWeight=FontWeight.SemiBold);Text(if(state.mode==Mode.DEMO)"SIMULATED SPEED" else "DEVICE GPS",fontSize=8.sp,color=Color.Gray) };Row(verticalAlignment=Alignment.CenterVertically) { Icon(Icons.Outlined.VolumeUp,"Voice alerts",tint=Forest);Switch(checked=state.voice,onCheckedChange=DriveStore::setVoice) } }
            Text("Illustrative map · No live navigation",fontSize=9.sp,color=Color.Gray,modifier=Modifier.padding(start=16.dp,bottom=14.dp))
        } }
        state.average?.let { average -> item { Card(colors=CardDefaults.cardColors(containerColor=Color(0xFFE9F0DE))) { Column(Modifier.fillMaxWidth().padding(20.dp),verticalArrangement=Arrangement.spacedBy(8.dp)) { Text("DEMO SECTION CONTROL",fontSize=10.sp,color=Forest);Text("${"%.1f".format(average.kmh)} km/h",fontSize=30.sp,fontWeight=FontWeight.SemiBold);Text(if(average.estimated)"Estimated GPS average · Includes stopped time" else "Completed · Sample surveyed-length average",fontSize=11.sp);Text("Sample limit ${average.limit} km/h. Not an enforcement measurement.",fontSize=10.sp,color=Color.Gray) } } } }
        state.warning?.let { warning -> item { Card(colors=CardDefaults.cardColors(containerColor=Color(0xFFF4EDD7))) { Column(Modifier.fillMaxWidth().padding(20.dp),verticalArrangement=Arrangement.spacedBy(8.dp)) { Text("ON YOUR RADAR · DEMO",fontSize=10.sp);Text(warning.hazard.title,fontSize=23.sp,fontWeight=FontWeight.SemiBold);Text(warning.hazard.road,fontSize=12.sp);Text("${warning.meters.toInt()} m at alert time",fontWeight=FontWeight.Medium);Text("Always follow actual posted signs.",fontSize=10.sp) } } } }
        item { Column(verticalArrangement=Arrangement.spacedBy(10.dp)) {
            Text(state.status,fontSize=12.sp,color=Forest)
            Text(state.feed,fontSize=10.sp,color=Color.Gray)
            if(active)Button(onClick=onStop,modifier=Modifier.fillMaxWidth().height(50.dp),shape=RoundedCornerShape(9.dp)){Icon(Icons.Outlined.Stop,null);Spacer(Modifier.width(8.dp));Text("End test · ${state.seconds/60}m ${state.seconds%60}s")}
            else { Button(onClick=onDemo,enabled=state.country=="BH",modifier=Modifier.fillMaxWidth().height(50.dp),shape=RoundedCornerShape(9.dp)){Icon(Icons.Outlined.PlayArrow,null);Spacer(Modifier.width(8.dp));Text("Run a simulated drive")};OutlinedButton(onClick=onGPS,modifier=Modifier.fillMaxWidth()){Text("Start device GPS test")} }
        } }
        item { Text("NEARBY DEMO ALERTS",fontSize=10.sp,letterSpacing=1.sp,color=Forest) }
        items(state.hazards,key={it.id}) { hazard -> Card(colors=CardDefaults.cardColors(containerColor=Color.White)) { Row(Modifier.fillMaxWidth().padding(16.dp),verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(12.dp)) { Icon(Icons.Outlined.Warning,null,tint=Color(0xFFAE9861));Column {Text(hazard.title,fontWeight=FontWeight.Medium);Text(hazard.road,fontSize=11.sp,color=Color.Gray)} } } }
        item { OutlinedTextField(value=destination,onValueChange={destination=it.take(120)},enabled=!active,label={Text("Where are you heading?")},singleLine=true,modifier=Modifier.fillMaxWidth());OutlinedButton(onClick={runCatching {context.startActivity(Intent(Intent.ACTION_VIEW,Uri.parse("geo:26.22,50.55?q=${Uri.encode(destination)}")))}.onFailure{DriveStore.message("No compatible maps app is installed")}},enabled=destination.isNotBlank()&&!active,modifier=Modifier.fillMaxWidth()){Text("Open destination in Maps")} }
        item { Text("Simulation runs only while this app is in the foreground. A GPS test uses a visible location service. OS force-stop and battery restrictions may interrupt it. End the test when finished.",fontSize=10.sp,lineHeight=17.sp,color=Color.Gray) }
    }
}
@Composable private fun Metric(label: String,value: String,modifier: Modifier) { Card(modifier,colors=CardDefaults.cardColors(containerColor=Color.White),shape=RoundedCornerShape(13.dp)) { Column(Modifier.padding(16.dp),verticalArrangement=Arrangement.spacedBy(10.dp)) {Text(label,fontSize=8.sp,color=Color.Gray);Text(value,fontSize=19.sp,fontWeight=FontWeight.SemiBold)} } }
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
    LazyColumn(contentPadding=PaddingValues(20.dp),verticalArrangement=Arrangement.spacedBy(14.dp)) {
        item { Text("Session summaries stay on this device. Precise routes are not saved.",fontSize=12.sp,color=Color.Gray) }
        if(state.trips.isEmpty())item { Text("Your next journey starts here. Run a demo and finish it to see a summary.",modifier=Modifier.padding(vertical=60.dp)) }
        items(state.trips,key={it.id}) { trip->Card(colors=CardDefaults.cardColors(containerColor=Color.White)) { Column(Modifier.fillMaxWidth().padding(20.dp),verticalArrangement=Arrangement.spacedBy(8.dp)) { Text(if(trip.interrupted)"Interrupted session · Duration unknown" else if(trip.demo)"Simulated drive" else "Device GPS test",fontWeight=FontWeight.Medium);Text(DateFormat.getDateTimeInstance().format(Date(trip.at)),fontSize=11.sp,color=Color.Gray);if(!trip.interrupted)Text("${trip.seconds/60}m ${trip.seconds%60}s · ${trip.alerts} alerts",fontSize=12.sp) } } }
        if(state.trips.isNotEmpty())item {TextButton(onClick={clear=true}){Text("Delete local trip history")}}
    }
    if(clear)AlertDialog(onDismissRequest={clear=false},title={Text("Delete trip history?")},text={Text("This removes local summaries and cannot be undone.")},confirmButton={TextButton(onClick={DriveStore.clearTrips();clear=false}){Text("Delete")}},dismissButton={TextButton(onClick={clear=false}){Text("Cancel")}})
}
@Composable private fun Community(state: DriveState) {
    var road by remember {mutableStateOf("")};var kind by remember {mutableStateOf("Road hazard")}
    LazyColumn(contentPadding=PaddingValues(20.dp),verticalArrangement=Arrangement.spacedBy(16.dp)) {
        item {Text("A little heads-up. A safer road.",fontSize=25.sp,fontWeight=FontWeight.SemiBold);Spacer(Modifier.height(12.dp));Text("Only report when safely parked. These are local drafts, not published community alerts.",fontSize=12.sp,color=Color.Gray)}
        item {Column {listOf("Road hazard","Roadworks","Speed camera","Traffic congestion").forEach {type->Row(verticalAlignment=Alignment.CenterVertically){RadioButton(selected=kind==type,onClick={kind=type},enabled=state.mode==Mode.IDLE);Text(type,fontSize=13.sp)}}}}
        item {OutlinedTextField(value=road,onValueChange={road=it.take(120)},label={Text("Road or location")},enabled=state.mode==Mode.IDLE,modifier=Modifier.fillMaxWidth())}
        item {Button(onClick={DriveStore.draft(road,kind);road=""},enabled=road.isNotBlank()&&state.mode==Mode.IDLE,modifier=Modifier.fillMaxWidth()){Text("Save local draft")}}
        items(state.drafts,key={it.id}) {draft->Card(colors=CardDefaults.cardColors(containerColor=Color.White)){Row(Modifier.fillMaxWidth().padding(16.dp),verticalAlignment=Alignment.CenterVertically){Column(Modifier.weight(1f)){Text(draft.kind);Text(draft.road,fontSize=11.sp,color=Color.Gray);Text("Local · Unverified",fontSize=9.sp,color=Color.Gray)};IconButton(onClick={DriveStore.deleteDraft(draft.id)}){Icon(Icons.Outlined.Delete,"Delete report")}}}}
    }
}
@Composable private fun Preferences(state: DriveState) {
    val context=LocalContext.current
    var privacy by remember { mutableStateOf(false) }
    if(privacy)AlertDialog(onDismissRequest={privacy=false},title={Text("Privacy notice")},text={Text(PrivacyNotice.text,modifier=Modifier.verticalScroll(rememberScrollState()))},confirmButton={TextButton(onClick={privacy=false}){Text("Close")}}
    LazyColumn(contentPadding=PaddingValues(20.dp),verticalArrangement=Arrangement.spacedBy(20.dp)) {
        item {Row(verticalAlignment=Alignment.CenterVertically){Column(Modifier.weight(1f)){Text("Voice alerts",fontWeight=FontWeight.Medium);Text("Temporarily ducks audio when supported",fontSize=11.sp,color=Color.Gray)};Switch(checked=state.voice,onCheckedChange=DriveStore::setVoice)}}
        item {Text("COUNTRY",fontSize=10.sp,color=Forest);Column {listOf("BH","SA","AE","QA","KW","OM").chunked(3).forEach {row->Row(horizontalArrangement=Arrangement.spacedBy(10.dp)){row.forEach {code->FilterChip(selected=state.country==code,onClick={DriveStore.country(code)},label={Text(code)},enabled=state.mode==Mode.IDLE)}}}}}
        item {Text("Only Bahrain has a bundled fictional pack. No country has verified live coverage in this test build.",fontSize=12.sp,color=Color.Gray)}
        item {Card(colors=CardDefaults.cardColors(containerColor=Color(0xFFEAF0E1))){Column(Modifier.padding(20.dp),verticalArrangement=Arrangement.spacedBy(12.dp)){Icon(Icons.Outlined.Shield,null,tint=Forest);Text("Your journey stays yours.",fontWeight=FontWeight.Medium);Text("No account, ads or billing SDKs are active in this test build. Static alerts remain in SQLite offline. No route is uploaded. If configured later, regional sync reveals only a coarse tile.",fontSize=12.sp,lineHeight=19.sp)}}}
        item {OutlinedButton(onClick={context.startActivity(Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS,Uri.parse("package:${context.packageName}")))},modifier=Modifier.fillMaxWidth()){Text("Open system permissions")}}
        item {OutlinedButton(onClick={privacy=true},modifier=Modifier.fillMaxWidth()){Text("Read privacy notice")}}
        item {Text("Build ${BuildConfig.VERSION_NAME} · ${BuildConfig.APPLICATION_ID}\nCarPlay/Android Auto, watches, automatic vehicle startup, premium 3D navigation and billing are not enabled in this build. In an emergency in Bahrain, call 999.",fontSize=11.sp,lineHeight=18.sp,color=Color.Gray)}
    }
}
