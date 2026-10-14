package app.sahm
import android.content.Context
import android.os.SystemClock
import app.sahm.core.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URI
import java.io.ByteArrayOutputStream

data class PackResult(val hazards: List<Hazard>, val status: String)
class HazardRepository(context: Context) {
    private val database=HazardDatabase(context.applicationContext)
    private val lock=Mutex()
    private val retry=RetryGate()
    private var seeded=false
    private var lastScope: String?=null
    private fun initialize() { if(!seeded) { database.seed("BH",1,DemoData.hazards); seeded=true } }
    suspend fun local(country: String,point: Point): List<Hazard> = withContext(Dispatchers.IO) { lock.withLock { initialize(); database.nearby(country,point,System.currentTimeMillis()) } }
    suspend fun refresh(country: String,point: Point): PackResult = withContext(Dispatchers.IO) { lock.withLock {
        initialize()
        fun cached(status: String)=PackResult(database.nearby(country,point,System.currentTimeMillis()),status)
        if(BuildConfig.FEED_URL.isBlank())return@withLock cached(if(country=="BH")"Bundled demo pack · Offline detection ready" else "No verified coverage for $country")
        val scope=runCatching { Scope.at(country,point) }.getOrNull() ?: return@withLock cached("Outside configured GCC sync area")
        val now=SystemClock.elapsedRealtime()
        if(!retry.ready(now) && lastScope==scope.key)return@withLock cached("Cached regional alerts")
        // Moving to a new tile cannot bypass backoff after a network failure.
        if(retry.failures>0 && !retry.ready(now))return@withLock cached("Offline · Retry scheduled")
        lastScope=scope.key
        try {
            val base=URI(BuildConfig.FEED_URL)
            require(base.scheme=="https" && base.host!=null && base.userInfo==null)
            for(page in 0 until 5) {
                val cursor=database.cursor(scope)
                val epoch=java.net.URLEncoder.encode(cursor.epoch,"UTF-8")
                val url=base.resolve("/v1/changes?country=$country&tile=${scope.tile}&cursor=${cursor.value}&epoch=$epoch").toURL()
                val connection=url.openConnection() as HttpURLConnection
                val delta=try {
                    connection.connectTimeout=10_000; connection.readTimeout=10_000; connection.instanceFollowRedirects=false
                    check(connection.responseCode==200) { "Feed HTTP ${connection.responseCode}" }
                    val raw=connection.inputStream.use { input ->
                        val out=ByteArrayOutputStream(); val buffer=ByteArray(8192)
                        while(true) { val n=input.read(buffer); if(n<0)break; require(out.size()+n<=1_000_000);out.write(buffer,0,n) }
                        out.toString("UTF-8")
                    }
                    decode(JSONObject(raw))
                } finally { connection.disconnect() }
                database.apply(scope,delta,System.currentTimeMillis())
                if(!delta.hasMore)break
            }
            retry.success(SystemClock.elapsedRealtime()); cached("Regional alerts synchronized")
        } catch(e: CancellationException) { throw e }
          catch(_: Exception) { retry.failure(SystemClock.elapsedRealtime(),(0L..3000L).random()); cached("Offline · Last valid local alerts retained") }
    } }
    private fun decode(o: JSONObject): Delta {
        val list=o.getJSONArray("changes"); require(list.length()<=1000)
        val changes=(0 until list.length()).map { index ->
            val c=list.getJSONObject(index); val seq=c.getLong("sequence"); val id=c.getString("id")
            val h=if(c.isNull("hazard"))null else c.getJSONObject("hazard").let { a ->
                Hazard(a.getString("id"),a.getString("country"),Kind.valueOf(a.getString("kind")),Point(a.getDouble("lat"),a.getDouble("lon")),if(a.isNull("heading"))null else a.getDouble("heading"),a.getString("road"),a.getLong("expiresAt"),a.getBoolean("demo"),a.getLong("revision"))
            }
            Change(seq,id,h)
        }
        return Delta(o.getInt("schemaVersion"),o.getString("scope"),o.getString("epoch"),o.getLong("from"),o.getLong("next"),o.getBoolean("reset"),o.getBoolean("hasMore"),changes)
    }
}
