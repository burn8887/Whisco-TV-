package app.salim
import android.Manifest
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
    private var previous: Location?=null
    private var lastBearing: Double?=null
    override fun onCreate() {
        super.onCreate();DriveStore.initialize(this);locations=getSystemService(LocationManager::class.java)
        val manager=getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(NotificationChannel("session","GPS test session",NotificationManager.IMPORTANCE_LOW))
        manager.createNotificationChannel(NotificationChannel("alerts","Demo road alerts",NotificationManager.IMPORTANCE_HIGH))
    }
    override fun onBind(intent: Intent?)=null
    override fun onStartCommand(intent: Intent?,flags: Int,startId: Int): Int {
        if(intent?.action=="STOP") { stopSelf();return START_NOT_STICKY }
        if(started)return START_NOT_STICKY
        if(!precise()) { fail("Precise location permission is required");return START_NOT_STICKY }
        if(DriveStore.state.value.mode!=Mode.IDLE) { stopSelf();return START_NOT_STICKY }
        val stop=PendingIntent.getService(this,2,Intent(this,DriveService::class.java).setAction("STOP"),PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        val open=PendingIntent.getActivity(this,1,Intent(this,MainActivity::class.java),PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        val notification=NotificationCompat.Builder(this,"session").setSmallIcon(android.R.drawable.ic_menu_mylocation).setContentTitle("Salim · Drive active").setContentText("Camera coverage varies. End the drive to stop location.").setContentIntent(open).setOngoing(true).addAction(android.R.drawable.ic_media_pause,"End drive",stop).build()
        try {
            if(Build.VERSION.SDK_INT>=29)startForeground(10,notification,ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION) else startForeground(10,notification)
            started=true;DriveStore.begin(Mode.GPS);DriveStore.onWarning={showAlert(it)}
            if(!locations.isProviderEnabled(LocationManager.GPS_PROVIDER)) { fail("Enable device GPS before starting a test");return START_NOT_STICKY }
            locations.requestLocationUpdates(LocationManager.GPS_PROVIDER,1000,0f,this,Looper.getMainLooper())
            // Coarse fallback. Failure is not an error: the device may have no network
            // provider augmenting GPS, in which case GPS alone is all there is.
            runCatching { locations.requestLocationUpdates(LocationManager.NETWORK_PROVIDER,2000,5f,this,Looper.getMainLooper()) }
        } catch(_: SecurityException) { fail("Location permission is unavailable; test stopped") }
          catch(_: IllegalStateException) { fail("Android rejected a background start. Open Salim and try again.") }
        if(started)scope.launch { while(isActive) { delay(2000);if(!precise()) {fail("Location permission revoked; GPS test stopped");break} } }
        return START_NOT_STICKY
    }
    private fun precise()=ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED
    private fun fail(message: String) { failure=message;DriveStore.message(message);stopSelf() }
    override fun onLocationChanged(location: Location) {
        if(!started || DriveStore.state.value.mode!=Mode.GPS)return
        val from=previous
        previous=location
        // Android omits speed, bearing and sometimes accuracy. The service used to
        // forward -1.0 for "unknown", and Geo.usable rejects any negative value, so
        // every fix from a device that does not report speed was discarded and the
        // app reported no GPS while the phone had one.
        val seconds=if(from==null)0.0 else (location.elapsedRealtimeNanos-from.elapsedRealtimeNanos)/1_000_000_000.0
        val moved=if(from==null)0.0 else Geo.distance(Point(from.latitude,from.longitude),Point(location.latitude,location.longitude))
        val speed=when {
            location.hasSpeed() -> location.speed.toDouble()
            seconds>0.0 && moved>0.0 -> (moved/seconds).coerceIn(0.0,70.0)
            else -> 0.0
        }
        val derivedCourse=when {
            location.hasBearing() -> location.bearing.toDouble()
            from!=null && moved>3.0 -> Geo.bearing(Point(from.latitude,from.longitude),Point(location.latitude,location.longitude))
            else -> lastBearing
        }
        val course=derivedCourse?.takeIf { it.isFinite() && it>=0.0 && it<360.0 }
        if(course!=null)lastBearing=course
        val accuracy=if(location.hasAccuracy())location.accuracy.toDouble() else 50.0
        DriveStore.receive(Fix(Point(location.latitude,location.longitude),speed,course,accuracy,location.time,location.elapsedRealtimeNanos/1_000_000))
    }
    override fun onProviderDisabled(provider: String) { if(provider==LocationManager.GPS_PROVIDER && !locations.isProviderEnabled(LocationManager.NETWORK_PROVIDER))fail("GPS was disabled; test stopped") }
    override fun onProviderEnabled(provider: String) {}
    @Deprecated("Legacy location callback") override fun onStatusChanged(provider: String?,status: Int,extras: Bundle?) {}
    private fun showAlert(match: AlertMatch) {
        if(Build.VERSION.SDK_INT>=33 && ContextCompat.checkSelfPermission(this,Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)return
        try {getSystemService(NotificationManager::class.java).notify(11,NotificationCompat.Builder(this,"alerts").setSmallIcon(android.R.drawable.ic_dialog_alert).setContentTitle("Demo · ${match.hazard.title}").setContentText("${match.meters.toInt()} m at alert time. Follow actual posted signs.").setAutoCancel(true).setTimeoutAfter(30_000).build())}catch(_:SecurityException){}
    }
    override fun onDestroy() {
        runCatching { locations.removeUpdates(this) };scope.cancel()
        if(started) {DriveStore.onWarning=null;DriveStore.end(failure ?: "GPS test ended · Session saved")}
        started=false;getSystemService(NotificationManager::class.java).cancel(11);stopForeground(STOP_FOREGROUND_REMOVE);super.onDestroy()
    }
}
