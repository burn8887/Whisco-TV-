package app.salim
import android.Manifest
import android.annotation.SuppressLint
import android.app.*
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ServiceInfo
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.*
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import app.salim.core.*
import kotlinx.coroutines.*

/**
 * Explicitly user-started, non-sticky. No boot receiver, hidden tracking, or other-app integration.
 *
 * Two providers are requested. GPS alone never fixes indoors or in a car park, and a
 * network fix is coarse but arrives in seconds, which is enough to prove the location
 * pipeline works while the satellites are still locking.
 */
class DriveService: Service(), LocationListener {
    private lateinit var locations: LocationManager
    private val scope=CoroutineScope(SupervisorJob()+Dispatchers.Main.immediate)
    private var started=false
    private var failure: String?=null
    /** Previous fix from the same provider; speed/heading are never derived across providers. */
    private val previous=mutableMapOf<String,Location>()
    private var lastGpsAt=0L
    private var lastBearing: Double?=null
    override fun onCreate() {
        super.onCreate();DriveStore.initialize(this);locations=getSystemService(LocationManager::class.java)
        val manager=getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(NotificationChannel("session",Ar.t("GPS test session"),NotificationManager.IMPORTANCE_LOW))
        manager.createNotificationChannel(NotificationChannel("alerts",Ar.t("Road alerts"),NotificationManager.IMPORTANCE_HIGH))
    }
    override fun onBind(intent: Intent?)=null
    override fun onStartCommand(intent: Intent?,flags: Int,startId: Int): Int {
        if(intent?.action=="STOP") { stopSelf();return START_NOT_STICKY }
        if(started)return START_NOT_STICKY
        if(!precise()) { fail("Precise location permission is required");return START_NOT_STICKY }
        if(DriveStore.state.value.mode!=Mode.IDLE) { stopSelf();return START_NOT_STICKY }
        val stop=PendingIntent.getService(this,2,Intent(this,DriveService::class.java).setAction("STOP"),PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        val open=PendingIntent.getActivity(this,1,Intent(this,MainActivity::class.java),PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        val notification=NotificationCompat.Builder(this,"session").setSmallIcon(android.R.drawable.ic_menu_mylocation).setContentTitle(Ar.t("Salim · Drive active")).setContentText(Ar.t("Camera coverage varies. End the drive to stop location.")).setContentIntent(open).setOngoing(true).addAction(android.R.drawable.ic_media_pause,Ar.t("End drive"),stop).build()
        try {
            if(Build.VERSION.SDK_INT>=29)startForeground(10,notification,ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION) else startForeground(10,notification)
            started=true;DriveStore.begin(Mode.GPS);DriveStore.onWarning={showAlert(it)}
            if(!locations.isProviderEnabled(LocationManager.GPS_PROVIDER)) { fail("Turn on Location (quick settings), then start the drive again");return START_NOT_STICKY }
            locations.requestLocationUpdates(LocationManager.GPS_PROVIDER,1000,0f,this,Looper.getMainLooper())
            // Fast coarse fallback while satellites lock. Android 12+ exposes the platform
            // fused provider (GPS + Wi-Fi + cell); older devices get the network provider.
            // Failure is not an error: GPS alone is then all there is.
            val helper=if(Build.VERSION.SDK_INT>=31 && LocationManager.FUSED_PROVIDER in locations.allProviders) LocationManager.FUSED_PROVIDER else LocationManager.NETWORK_PROVIDER
            runCatching { locations.requestLocationUpdates(helper,1000,0f,this,Looper.getMainLooper()) }
            // Show a position immediately if the phone already knows one from the last 30 seconds.
            seedFromLastKnown()
        } catch(_: SecurityException) { fail("Location permission is unavailable; test stopped") }
          catch(_: IllegalStateException) { fail("Android rejected a background start. Open Salim and try again.") }
        if(started)scope.launch { while(isActive) { delay(2000);if(!precise()) {fail("Location permission revoked; GPS test stopped");break} } }
        return START_NOT_STICKY
    }
    private fun precise()=ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED
    private fun fail(message: String) { failure=message;DriveStore.message(message);stopSelf() }
    // Only reached after precise() passed in onStartCommand; runCatching absorbs a
    // SecurityException if permission is revoked mid-call. Lint cannot see either.
    @SuppressLint("MissingPermission")
    private fun seedFromLastKnown() {
        val now=SystemClock.elapsedRealtimeNanos()
        locations.allProviders.mapNotNull { runCatching { locations.getLastKnownLocation(it) }.getOrNull() }
            .filter { now-it.elapsedRealtimeNanos in 0..30_000_000_000L }
            .minByOrNull { if(it.hasAccuracy()) it.accuracy else Float.MAX_VALUE }
            ?.let { onLocationChanged(it) }
    }
    override fun onLocationChanged(location: Location) {
        if(!started || DriveStore.state.value.mode!=Mode.GPS)return
        val provider=location.provider ?: "unknown"
        val nowElapsed=SystemClock.elapsedRealtime()
        val isGps=provider==LocationManager.GPS_PROVIDER
        if(isGps)lastGpsAt=nowElapsed
        // Once satellites are delivering, a coarser Wi-Fi/cell fix would only drag the
        // marker backwards and corrupt derived speed, so it is dropped.
        else if(nowElapsed-lastGpsAt<10_000 && (!location.hasAccuracy() || location.accuracy>20f))return
        val from=previous[provider]
        previous[provider]=location
        // Android omits speed, bearing and sometimes accuracy. Unknown speed is derived
        // from the previous fix of the SAME provider, never across providers: a GPS fix
        // followed by a network fix 300 m away used to read as 70 m/s.
        val seconds=if(from==null)0.0 else (location.elapsedRealtimeNanos-from.elapsedRealtimeNanos)/1_000_000_000.0
        val moved=if(from==null)0.0 else Geo.distance(Point(from.latitude,from.longitude),Point(location.latitude,location.longitude))
        val speed=when {
            location.hasSpeed() && location.speed.isFinite() && location.speed>=0f -> location.speed.toDouble().coerceAtMost(70.0)
            isGps && seconds in 0.5..10.0 && moved>0.0 -> (moved/seconds).coerceIn(0.0,70.0)
            else -> 0.0
        }
        val derivedCourse=when {
            location.hasBearing() && speed>=1.0 -> location.bearing.toDouble()
            isGps && from!=null && moved>3.0 && seconds<=10.0 -> Geo.bearing(Point(from.latitude,from.longitude),Point(location.latitude,location.longitude))
            speed>=1.0 -> lastBearing
            else -> null
        }
        val course=derivedCourse?.takeIf { it.isFinite() && it>=0.0 && it<360.0 }
        if(course!=null)lastBearing=course
        // A fix without accuracy is treated as coarse rather than alert-grade.
        val accuracy=if(location.hasAccuracy())location.accuracy.toDouble() else 100.0
        DriveStore.receive(Fix(Point(location.latitude,location.longitude),speed,course,accuracy,location.time,location.elapsedRealtimeNanos/1_000_000))
    }
    override fun onProviderDisabled(provider: String) { if(provider==LocationManager.GPS_PROVIDER && !locations.isProviderEnabled(LocationManager.NETWORK_PROVIDER))fail("GPS was disabled; test stopped") }
    override fun onProviderEnabled(provider: String) {}
    @Deprecated("Legacy location callback") override fun onStatusChanged(provider: String?,status: Int,extras: Bundle?) {}
    private fun showAlert(match: AlertMatch) {
        if(Build.VERSION.SDK_INT>=33 && ContextCompat.checkSelfPermission(this,Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)return
        try {getSystemService(NotificationManager::class.java).notify(11,NotificationCompat.Builder(this,"alerts").setSmallIcon(android.R.drawable.ic_dialog_alert).setContentTitle(Ar.t(match.hazard.title)).setContentText(Ar.t("${match.meters.toInt()} m ahead${match.hazard.limit?.let { " · limit $it" } ?: ""} · Follow posted signs")).setAutoCancel(true).setTimeoutAfter(30_000).build())}catch(_:SecurityException){}
    }
    override fun onDestroy() {
        runCatching { locations.removeUpdates(this) };scope.cancel()
        if(started) {DriveStore.onWarning=null;DriveStore.end(failure ?: "GPS test ended · Session saved")}
        started=false;getSystemService(NotificationManager::class.java).cancel(11);stopForeground(STOP_FOREGROUND_REMOVE);super.onDestroy()
    }
}
