package app.sahm
import android.content.Context
import android.os.SystemClock
import app.sahm.core.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

enum class Mode { IDLE, DEMO, GPS }
data class Trip(val id: String,val at: Long,val seconds: Int,val alerts: Int,val demo: Boolean,val interrupted: Boolean=false)
data class Draft(val id: String,val road: String,val kind: String)
data class DriveState(val mode: Mode=Mode.IDLE,val status: String="Ready for a demo",val feed: String="Demo data only · Not driving guidance",val country: String="BH",val voice: Boolean=true,val seconds: Int=0,val count: Int=0,val fix: Fix?=null,val warning: AlertMatch?=null,val average: Average?=null,val hazards: List<Hazard> = emptyList(),val trips: List<Trip> = emptyList(),val drafts: List<Draft> = emptyList())
/** Main-thread owner. GPS callbacks never perform SQL or network requests synchronously. */
object DriveStore {
    private val mutable=MutableStateFlow(DriveState())
    val state=mutable.asStateFlow()
    private lateinit var context: Context
    private lateinit var repository: HazardRepository
    private val scope=CoroutineScope(SupervisorJob()+Dispatchers.Main.immediate)
    private val engine=AlertEngine()
    private var sections=SectionEngine(DemoData.sections)
    private var initialized=false
    private var generation=0L
    private var startedAt=0L
    private var lastGood=0L
    private var localAt=0L
    private var audio: AudioAlerts?=null
    private var ticker: Job?=null
    private var demoJob: Job?=null
    private var syncJob: Job?=null
    private var localJob: Job?=null
    var onWarning: ((AlertMatch)->Unit)?=null
    fun initialize(app: Context) {
        if(initialized)return
        initialized=true;context=app.applicationContext;repository=HazardRepository(context)
        val p=context.getSharedPreferences("sahm",0)
        val trips=runCatching { val a=JSONArray(p.getString("trips","[]"));(0 until a.length()).map { val t=a.getJSONObject(it);Trip(t.getString("id"),t.getLong("at"),t.getInt("seconds"),t.getInt("alerts"),t.getBoolean("demo"),t.optBoolean("interrupted")) } }.getOrDefault(emptyList())
        val drafts=runCatching { val a=JSONArray(p.getString("drafts","[]"));(0 until a.length()).map { val t=a.getJSONObject(it);Draft(t.getString("id"),t.getString("road"),t.getString("kind")) } }.getOrDefault(emptyList())
        mutable.value=DriveState(voice=p.getBoolean("voice",true),trips=trips,drafts=drafts)
        // A process-death marker is a failed/incomplete session, never a resurrected active drive.
        if(p.contains("running")) {
            val interrupted=Trip(UUID.randomUUID().toString(),p.getLong("running",System.currentTimeMillis()),0,0,p.getBoolean("runningDemo",false),true)
            mutable.update { it.copy(trips=(listOf(interrupted)+it.trips).take(200),status="Previous session was interrupted; start a new test") }
            p.edit().remove("running").remove("runningDemo").apply();saveTrips()
        }
        refreshIdle()
    }
    fun message(text: String) { mutable.update { it.copy(status=text) } }
    fun setVoice(value: Boolean) { mutable.update { it.copy(voice=value) };context.getSharedPreferences("sahm",0).edit().putBoolean("voice",value).apply();if(!value)audio?.stop() }
    fun country(code: String) { if(state.value.mode!=Mode.IDLE || code !in COUNTRIES)return;generation++;mutable.update { it.copy(country=code,hazards=emptyList(),warning=null,average=null) };refreshIdle() }
    private fun refreshIdle() {
        val token=generation;val country=state.value.country
        scope.launch { runCatching { repository.refresh(country,DemoData.center) }.onSuccess { result->if(token==generation && state.value.mode==Mode.IDLE)mutable.update { it.copy(hazards=result.hazards,feed=result.status) } }.onFailure { mutable.update { s->s.copy(feed="Local pack unavailable; no alerts will be claimed") } } }
    }
    fun begin(mode: Mode) {
        if(state.value.mode!=Mode.IDLE)return
        require(mode!=Mode.IDLE)
        generation++;startedAt=SystemClock.elapsedRealtime();lastGood=startedAt;localAt=0;engine.reset();sections.reset();audio=AudioAlerts(context)
        engine.replace(state.value.hazards)
        mutable.update { it.copy(mode=mode,seconds=0,count=0,fix=null,warning=null,average=null,status=if(mode==Mode.DEMO)"Simulation · No device GPS" else "Waiting for an accurate GPS fix") }
        context.getSharedPreferences("sahm",0).edit().putLong("running",System.currentTimeMillis()).putBoolean("runningDemo",mode==Mode.DEMO).apply()
        ticker=scope.launch { while(isActive) {
            delay(1000);val elapsed=SystemClock.elapsedRealtime()
            mutable.update { it.copy(seconds=((elapsed-startedAt)/1000).toInt(),warning=it.warning?.takeIf { w->elapsed-w.atElapsed<=30_000 }) }
            if(elapsed-lastGood>15_000) { sections.reset();audio?.stop();mutable.update { it.copy(status="GPS stale · Alerts paused",fix=null,average=null,warning=null) } }
        } }
        val token=generation
        syncJob=scope.launch { while(isActive) {
            val point=state.value.fix?.point ?: DemoData.center
            runCatching { repository.refresh(state.value.country,point) }.onSuccess { result -> if(token==generation) { engine.replace(result.hazards);mutable.update { it.copy(hazards=result.hazards,feed=result.status) } } }.onFailure { if(it is CancellationException)throw it;message("Offline cache unavailable") }
            delay(30_000)
        } }
        if(mode==Mode.DEMO)demoJob=scope.launch {
            repeat(75) { step ->
                receive(Fix(Point(26.213+step*.000145,50.5433+step*.00007975),18.0,25.0,5.0,System.currentTimeMillis(),SystemClock.elapsedRealtime()))
                delay(1000)
            }
            end("Demo complete · Session saved")
        }
    }
    fun receive(fix: Fix) {
        if(state.value.mode==Mode.IDLE)return
        val now=System.currentTimeMillis();val elapsed=SystemClock.elapsedRealtime()
        if(!Geo.usable(fix,now,elapsed)) { audio?.stop();sections.reset();mutable.update { it.copy(status="Weak or stale GPS · Alerts paused",fix=null,average=null,warning=null) };return }
        lastGood=elapsed
        val country=state.value.country
        val measurement=sections.evaluate(fix,now,elapsed,country)
        val average=measurement.active.firstOrNull() ?: measurement.completed.firstOrNull()
        mutable.update { it.copy(fix=fix,average=average,status=when { state.value.mode==Mode.DEMO->"Simulation · Demo alerts only";fix.speed>=2 && fix.course==null->"Heading unavailable · Proximity alerts paused";else->"GPS test active · Demo data only" }) }
        if(elapsed-localAt>10_000 && localJob?.isActive!=true) {
            localAt=elapsed;val token=generation
            localJob=scope.launch { runCatching { repository.local(country,fix.point) }.onSuccess { hazards->if(token==generation) { engine.replace(hazards);mutable.update { it.copy(hazards=hazards) } } }.onFailure { if(it is CancellationException)throw it } }
        }
        val match=engine.evaluate(fix,now,elapsed,country) ?: return
        mutable.update { it.copy(warning=match,count=it.count+1) }
        if(state.value.voice)audio?.speak("Demo alert. ${match.hazard.title} in ${match.meters.toInt()} meters. Follow posted signs.")
        onWarning?.invoke(match)
    }
    fun end(status: String="Session ended · Saved on this device") {
        if(state.value.mode==Mode.IDLE)return
        val old=state.value
        generation++;ticker?.cancel();syncJob?.cancel();localJob?.cancel();demoJob?.cancel();audio?.close();audio=null;sections.reset();engine.reset()
        val trip=Trip(UUID.randomUUID().toString(),System.currentTimeMillis(),((SystemClock.elapsedRealtime()-startedAt)/1000).toInt(),old.count,old.mode==Mode.DEMO)
        mutable.update { it.copy(mode=Mode.IDLE,fix=null,warning=null,average=null,status=status,trips=(listOf(trip)+it.trips).take(200)) }
        context.getSharedPreferences("sahm",0).edit().remove("running").remove("runningDemo").apply();saveTrips()
    }
    fun clearTrips() { mutable.update { it.copy(trips=emptyList()) };saveTrips() }
    fun draft(road: String,kind: String) {
        if(state.value.mode!=Mode.IDLE || road.isBlank())return
        mutable.update { it.copy(drafts=(listOf(Draft(UUID.randomUUID().toString(),road.trim().take(120),kind))+it.drafts).take(100)) };saveDrafts()
    }
    fun deleteDraft(id: String) { mutable.update { it.copy(drafts=it.drafts.filterNot { d->d.id==id }) };saveDrafts() }
    private fun saveTrips() { val a=JSONArray();state.value.trips.forEach { a.put(JSONObject().put("id",it.id).put("at",it.at).put("seconds",it.seconds).put("alerts",it.alerts).put("demo",it.demo).put("interrupted",it.interrupted)) };context.getSharedPreferences("sahm",0).edit().putString("trips",a.toString()).apply() }
    private fun saveDrafts() { val a=JSONArray();state.value.drafts.forEach { a.put(JSONObject().put("id",it.id).put("road",it.road).put("kind",it.kind)) };context.getSharedPreferences("sahm",0).edit().putString("drafts",a.toString()).apply() }
}
