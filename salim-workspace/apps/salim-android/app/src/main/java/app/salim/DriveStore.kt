package app.salim
import android.content.Context
import android.os.SystemClock
import app.salim.core.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

enum class Mode { IDLE, DEMO, GPS }
enum class Appearance { SYSTEM, LIGHT, DARK }
data class Trip(val id: String,val at: Long,val seconds: Int,val alerts: Int,val demo: Boolean,val interrupted: Boolean=false)
data class Draft(val id: String,val road: String,val kind: String)
data class DriveState(
    val mode: Mode=Mode.IDLE,
    val status: String="Ready to start a drive",
    val feed: String="Waiting for nearby camera data",
    val country: String="BH",
    val voice: Boolean=true,
    val tone: Boolean=true,
    val appearance: Appearance=Appearance.SYSTEM,
    val seconds: Int=0,
    val count: Int=0,
    val fix: Fix?=null,
    val warning: AlertMatch?=null,
    val average: Average?=null,
    // False until the first GPS fix that passes validation has arrived. Without
    // this the app could only say "stale", never "still looking", so a cold start
    // that legitimately needs 30-60 seconds read as a failure.
    val acquired: Boolean=false,
    /**
     * True while recent fixes are accurate enough to alert on (±50 m). `acquired` means
     * "we know roughly where you are"; this means "alerts are live". Keeping them apart
     * lets the app show a coarse position immediately instead of "Acquiring" for minutes.
     */
    val alertReady: Boolean=false,
    /** Cameras fetched live from OpenStreetMap for the current area. */
    val liveCameras: Int=0,
    val hazards: List<Hazard> = emptyList(),
    val trips: List<Trip> = emptyList(),
    val drafts: List<Draft> = emptyList(),
    val premium: Boolean = false,
    val entitlementChecked: Boolean = false
)
/** Main-thread owner. GPS callbacks never perform SQL or network requests synchronously. */
object DriveStore {
    private val mutable=MutableStateFlow(DriveState())
    val state=mutable.asStateFlow()
    private lateinit var context: Context
    private lateinit var repository: HazardRepository
    private val scope=CoroutineScope(SupervisorJob()+Dispatchers.Main.immediate)
    private val engine=AlertEngine()
    private var sections=SectionEngine(if (BuildConfig.DEBUG) DemoData.sections else emptyList())
    private var initialized=false
    private var generation=0L
    private var startedAt=0L
    private var lastGood=0L
    private var lastPosition=0L
    private var localAt=0L
    private var audio: AudioAlerts?=null
    private var ticker: Job?=null
    private var demoJob: Job?=null
    private var syncJob: Job?=null
    private var localJob: Job?=null
    var onWarning: ((AlertMatch)->Unit)?=null
    private fun prefs()=context.getSharedPreferences("salim",0)
    fun initialize(app: Context) {
        if(initialized)return
        initialized=true;context=app.applicationContext
        // Camera pack first: the repository seeds from it.
        CameraPack.load(context)
        repository=HazardRepository(context)
        val p=prefs()
        val trips=runCatching { val a=JSONArray(p.getString("trips","[]"));(0 until a.length()).map { val t=a.getJSONObject(it);Trip(t.getString("id"),t.getLong("at"),t.getInt("seconds"),t.getInt("alerts"),t.getBoolean("demo"),t.optBoolean("interrupted")) } }.getOrDefault(emptyList())
        val drafts=runCatching { val a=JSONArray(p.getString("drafts","[]"));(0 until a.length()).map { val t=a.getJSONObject(it);Draft(t.getString("id"),t.getString("road"),t.getString("kind")) } }.getOrDefault(emptyList())
        val appearance=runCatching { Appearance.valueOf(p.getString("appearance",Appearance.SYSTEM.name) ?: Appearance.SYSTEM.name) }.getOrDefault(Appearance.SYSTEM)
        mutable.value=DriveState(voice=p.getBoolean("voice",true),tone=p.getBoolean("tone",true),appearance=appearance,trips=trips,drafts=drafts)
        // A process-death marker is a failed/incomplete session, never a resurrected active drive.
        if(p.contains("running")) {
            val interrupted=Trip(UUID.randomUUID().toString(),p.getLong("running",System.currentTimeMillis()),0,0,p.getBoolean("runningDemo",false),true)
            mutable.update { it.copy(trips=(listOf(interrupted)+it.trips).let { list -> if(it.entitlementChecked && !it.premium) list.take(20) else list },status="Previous session was interrupted; start a new drive") }
            p.edit().remove("running").remove("runningDemo").apply();saveTrips()
        }
        refreshIdle()
    }
    /**
     * Pack rows plus whatever OSM returned for this area. Live cameras are appended rather
     * than replacing the pack: if the network drops between drives the driver keeps the
     * alerts they already had.
     */
    private fun withFeed(pack: List<Hazard>): List<Hazard> =
        (pack + liveCameras + (if(state.value.mode==Mode.DEMO) DemoData.cameras else emptyList())).distinctBy { it.id }

    private var liveCameras: List<Hazard> = emptyList()

    /** Refreshes live cameras without blocking the caller; the feed updates on success. */
    private fun refreshCameras(point: Point) {
        val token=generation
        scope.launch {
            val fetched=runCatching { CameraFeed.fetch(context,point) }.getOrDefault(emptyList())
            if(token!=generation)return@launch
            // A failed fetch keeps what we hold — but only what is still about this area.
            // Keeping last night's city would be a false alert, not a saved one.
            liveCameras=if(fetched.isEmpty()) CameraFeed.near(liveCameras,point) else fetched
            mutable.update { it.copy(hazards=withFeed(it.hazards.filter { h->!h.id.startsWith("osm:") }),liveCameras=liveCameras.size) }
            engine.replace(state.value.hazards)
        }
    }

    fun message(text: String) { mutable.update { it.copy(status=text) } }
    fun setVoice(value: Boolean) { mutable.update { it.copy(voice=value) };prefs().edit().putBoolean("voice",value).apply();if(!value)audio?.stop() }
    fun setTone(value: Boolean) { mutable.update { it.copy(tone=value) };prefs().edit().putBoolean("tone",value).apply() }
    fun setAppearance(value: Appearance) { mutable.update { it.copy(appearance=value) };prefs().edit().putString("appearance",value.name).apply() }
    fun country(code: String) { if(state.value.mode!=Mode.IDLE || code !in COUNTRIES)return;generation++;mutable.update { it.copy(country=code,hazards=emptyList(),warning=null,average=null) };refreshIdle() }
    private fun refreshIdle() {
        val token=generation;val country=state.value.country
        scope.launch {
            val startingPoint=MapTiles.lastKnown(context)?.let { Point(it.first,it.second) } ?: DemoData.center
            runCatching { repository.refresh(country,startingPoint) }
                .onSuccess { result->if(token==generation && state.value.mode==Mode.IDLE)mutable.update { it.copy(hazards=withFeed(result.hazards),feed=result.status) } }
                .onFailure { mutable.update { s->s.copy(feed="Local pack unavailable; no alerts will be claimed") } }
            // Do not query an invented/default Bahrain point. Real camera requests begin
            // only from a device-derived location, including a last-known fix.
            MapTiles.lastKnown(context)?.let { refreshCameras(Point(it.first,it.second)) }
        }
    }
    fun begin(mode: Mode) {
        if(state.value.mode!=Mode.IDLE)return
        if(mode==Mode.DEMO && !BuildConfig.DEBUG)return
        require(mode!=Mode.IDLE)
        generation++;startedAt=SystemClock.elapsedRealtime();lastGood=startedAt;lastPosition=startedAt;localAt=0;engine.reset();sections.reset();audio=AudioAlerts(context)
        // The simulated route passes one fictional debug-only camera, so the demo exercises a
        // real camera alert end to end instead of driving past nothing.
        if(mode==Mode.DEMO)mutable.update { it.copy(hazards=(it.hazards+DemoData.cameras).distinctBy { h->h.id }) }
        engine.replace(state.value.hazards)
        mutable.update { it.copy(mode=mode,seconds=0,count=0,fix=null,warning=null,average=null,acquired=mode==Mode.DEMO,alertReady=mode==Mode.DEMO,status=if(mode==Mode.DEMO)"Simulation · No device GPS" else "Acquiring GPS satellites…") }
        prefs().edit().putLong("running",System.currentTimeMillis()).putBoolean("runningDemo",mode==Mode.DEMO).apply()
        ticker=scope.launch { while(isActive) {
            delay(1000);val elapsed=SystemClock.elapsedRealtime()
            val waited=((elapsed-startedAt)/1000).toInt()
            mutable.update { s->
                // Before the first fix the honest message is "still looking", with a
                // hint after 25 seconds. A cold GPS start outdoors routinely needs
                // 30-60 seconds; claiming failure at 15 was the bug.
                val status=when {
                    s.mode!=Mode.GPS || s.acquired -> s.status
                    waited<25 -> "Acquiring GPS satellites… ${waited}s"
                    else -> "No fix yet · move near a window or outdoors"
                }
                s.copy(seconds=waited,status=status,warning=s.warning?.takeIf { w->elapsed-w.atElapsed<=30_000 })
            }
            val s=state.value
            if(s.mode==Mode.GPS && s.acquired && elapsed-lastPosition>15_000) {
                // No position of any quality for 15 s: the signal is genuinely gone.
                sections.reset();audio?.stop()
                mutable.update { it.copy(status="GPS signal lost · Alerts paused",fix=null,alertReady=false,average=null,warning=null) }
            } else if(s.mode==Mode.GPS && s.alertReady && elapsed-lastGood>15_000) {
                // Still positioned, but nothing alert-grade lately: say so instead of "stale".
                sections.reset()
                mutable.update { it.copy(alertReady=false,average=null,status="Weak GPS · ±${it.fix?.accuracy?.toInt() ?: 0} m · Alerts paused") }
            }
        } }
        val token=generation
        syncJob=scope.launch { while(isActive) {
            val fix=state.value.fix
            if (fix == null || !state.value.acquired) { delay(1_000); continue }
            val point=fix.point
            val country=CameraFeed.countryAt(point) ?: state.value.country
            if (country != state.value.country) mutable.update { it.copy(country=country,hazards=it.hazards.filter { h -> h.country==country }) }
            runCatching { repository.refresh(country,point) }.onSuccess { result -> if(token==generation) { mutable.update { s -> if(s.country==country) s.copy(hazards=withFeed(result.hazards),feed=result.status) else s };engine.replace(state.value.hazards) } }.onFailure { if(it is CancellationException)throw it;message("Offline cache unavailable") }
            refreshCameras(point)
            delay(30_000)
        } }
        if(mode==Mode.DEMO)demoJob=scope.launch {
            repeat(75) { step ->
                // Synthetic route past DemoData.cameras (debug builds only).
                receive(Fix(Point(26.2312+step*.000145,50.5330+step*.00007975),18.0,25.0,5.0,System.currentTimeMillis(),SystemClock.elapsedRealtime()))
                delay(1000)
            }
            end("Demo complete · Session saved")
        }
    }
    fun receive(fix: Fix) {
        if(state.value.mode==Mode.IDLE)return
        val now=System.currentTimeMillis();val elapsed=SystemClock.elapsedRealtime()
        // Anything we cannot even place on the map is ignored outright; the ticker reports
        // "signal lost" if that goes on for 15 seconds.
        if(!Geo.positioned(fix,elapsed))return
        lastPosition=elapsed
        val precise=Geo.usable(fix,now,elapsed)
        if(precise)lastGood=elapsed
        val detectedCountry=CameraFeed.countryAt(fix.point)
        val country=detectedCountry ?: state.value.country
        if (country != state.value.country) {
            mutable.update { it.copy(country=country,hazards=it.hazards.filter { h -> h.country==country }) }
        }
        val measurement=sections.evaluate(fix,now,elapsed,country)
        val average=measurement.active.firstOrNull() ?: measurement.completed.firstOrNull()
        mutable.update { it.copy(acquired=true,alertReady=precise,fix=fix,average=average,status=when {
            it.mode==Mode.DEMO->"Simulation · Demo alerts only"
            !precise->"Locating · ±${fix.accuracy.toInt()} m · Alerts start when GPS sharpens"
            fix.speed>=2 && fix.course==null->"Heading unavailable · Proximity alerts paused"
            else->"GPS locked · ±${fix.accuracy.toInt()} m · Camera coverage varies" }) }
        if(elapsed-localAt>10_000 && localJob?.isActive!=true) {
            localAt=elapsed;val token=generation
            localJob=scope.launch { runCatching { repository.local(country,fix.point) }.onSuccess { hazards->if(token==generation) { val merged=withFeed(hazards);engine.replace(merged);mutable.update { it.copy(hazards=merged) } } }.onFailure { if(it is CancellationException)throw it } }
        }
        val match=engine.evaluate(fix,now,elapsed,country) ?: return
        mutable.update { it.copy(warning=match,count=it.count+1) }
        if(state.value.tone)audio?.beep()
        // "Demo" is said only in a simulation; a real drive's alert is a real alert.
        if(state.value.voice)audio?.speakAlert(match.hazard,match.meters,state.value.mode==Mode.DEMO)
        onWarning?.invoke(match)
    }
    fun end(status: String="Session ended · Saved on this device") {
        if(state.value.mode==Mode.IDLE)return
        val old=state.value
        generation++;ticker?.cancel();syncJob?.cancel();localJob?.cancel();demoJob?.cancel();audio?.close();audio=null;sections.reset();engine.reset()
        val trip=Trip(UUID.randomUUID().toString(),System.currentTimeMillis(),((SystemClock.elapsedRealtime()-startedAt)/1000).toInt(),old.count,old.mode==Mode.DEMO)
        mutable.update { it.copy(mode=Mode.IDLE,fix=null,warning=null,average=null,acquired=false,alertReady=false,hazards=it.hazards.filterNot { h->h.id.startsWith("demo:") },status=status,trips=(listOf(trip)+it.trips).let { trips -> if(it.entitlementChecked && !it.premium) trips.take(20) else trips }) }
        prefs().edit().remove("running").remove("runningDemo").apply();saveTrips()
    }
    fun applyPremiumEntitlement(checked: Boolean, active: Boolean) {
        if (!checked) return
        mutable.update { it.copy(premium=active,entitlementChecked=true,trips=if(active) it.trips else it.trips.take(20)) }
        saveTrips()
    }
    fun clearTrips() { mutable.update { it.copy(trips=emptyList()) };saveTrips() }
    fun draft(road: String,kind: String) {
        if(state.value.mode!=Mode.IDLE || road.isBlank())return
        mutable.update { it.copy(drafts=(listOf(Draft(UUID.randomUUID().toString(),road.trim().take(120),kind))+it.drafts).take(100)) };saveDrafts()
    }
    fun deleteDraft(id: String) { mutable.update { it.copy(drafts=it.drafts.filterNot { d->d.id==id }) };saveDrafts() }
    private fun saveTrips() { val a=JSONArray();state.value.trips.forEach { a.put(JSONObject().put("id",it.id).put("at",it.at).put("seconds",it.seconds).put("alerts",it.alerts).put("demo",it.demo).put("interrupted",it.interrupted)) };prefs().edit().putString("trips",a.toString()).apply() }
    private fun saveDrafts() { val a=JSONArray();state.value.drafts.forEach { a.put(JSONObject().put("id",it.id).put("road",it.road).put("kind",it.kind)) };prefs().edit().putString("drafts",a.toString()).apply() }
}
