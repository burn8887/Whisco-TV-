package app.sahm
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
import app.sahm.core.*
import kotlinx.coroutines.*

/** Explicitly user-started, non-sticky. No boot receiver, hidden tracking, or other-app integration. */
class DriveService: Service(), LocationListener {
    private lateinit var locations: LocationManager
    private val scope=CoroutineScope(SupervisorJob()+Dispatchers.Main.immediate)
    private var started=false
    private var failure: String?=null
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
        val notification=NotificationCompat.Builder(this,"session").setSmallIcon(android.R.drawable.ic_menu_mylocation).setContentTitle("Sahm Demo · GPS test active").setContentText("Fictional alert pack. End the test to stop location.").setContentIntent(open).setOngoing(true).addAction(android.R.drawable.ic_media_pause,"End test",stop).build()
        try {
            if(Build.VERSION.SDK_INT>=29)startForeground(10,notification,ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION) else startForeground(10,notification)
            started=true;DriveStore.begin(Mode.GPS);DriveStore.onWarning={showAlert(it)}
            if(!locations.isProviderEnabled(LocationManager.GPS_PROVIDER)) { fail("Enable device GPS before starting a test");return START_NOT_STICKY }
            locations.requestLocationUpdates(LocationManager.GPS_PROVIDER,1000,0f,this,Looper.getMainLooper())
        } catch(_: SecurityException) { fail("Location permission is unavailable; test stopped") }
          catch(_: IllegalStateException) { fail("Android rejected a background start. Open Sahm and try again.") }
        if(started)scope.launch { while(isActive) { delay(2000);if(!precise()) {fail("Location permission revoked; GPS test stopped");break} } }
        return START_NOT_STICKY
    }
    private fun precise()=ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED
    private fun fail(message: String) { failure=message;DriveStore.message(message);stopSelf() }
    override fun onLocationChanged(location: Location) {
        if(!started || DriveStore.state.value.mode!=Mode.GPS)return
        DriveStore.receive(Fix(Point(location.latitude,location.longitude),if(location.hasSpeed())location.speed.toDouble() else -1.0,if(location.hasBearing())location.bearing.toDouble() else null,if(location.hasAccuracy())location.accuracy.toDouble() else -1.0,location.time,location.elapsedRealtimeNanos/1_000_000))
    }
    override fun onProviderDisabled(provider: String) { if(provider==LocationManager.GPS_PROVIDER)fail("GPS was disabled; test stopped") }
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
