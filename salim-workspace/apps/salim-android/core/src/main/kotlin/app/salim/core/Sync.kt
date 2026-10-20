package app.salim.core

/** Scope is snapped to a regional tile with a halo; cursors are never shared across scopes. */
data class Scope(val country: String,val latTile: Int,val lonTile: Int) {
    init { require(country in COUNTRIES && latTile in 100..400 && lonTile in 300..650) }
    val key get()="$country:$latTile:$lonTile"
    val tile get()="$latTile:$lonTile"
    companion object { fun at(country: String,point: Point)=Scope(country,kotlin.math.floor(point.lat*10).toInt(),kotlin.math.floor(point.lon*10).toInt()) }
}
data class Cursor(val epoch: String,val value: Long) { init { require(epoch.length<=120 && value>=0) } }
data class Change(val sequence: Long,val id: String,val hazard: Hazard?)
data class Delta(val schemaVersion: Int,val scope: String,val epoch: String,val from: Long,val next: Long,val reset: Boolean,val hasMore: Boolean,val changes: List<Change>) {
    fun validate(expected: Scope,current: Cursor) {
        require(schemaVersion==1 && scope==expected.key && epoch.isNotBlank() && epoch.length<=120)
        require(from>=0 && next>=from && changes.size<=1000)
        if(reset)require(from==0L && !hasMore) else require(epoch==current.epoch && from==current.value)
        require(!hasMore || next>from)
        require(changes.map { it.sequence }.distinct().size==changes.size)
        require(changes.zipWithNext().all { (a,b)->a.sequence<b.sequence })
        changes.forEach { c ->
            require(c.id.startsWith("live:") && c.id.length<=120 && c.sequence>0 && c.sequence<=next)
            if(!reset)require(c.sequence>from)
            c.hazard?.let { require(it.id==c.id && it.country==expected.country && it.revision==c.sequence) }
        }
    }
}
/** Monotonic retry gate, injectable jitter, no sleeps or networking on the location callback. */
class RetryGate {
    var failures=0; private set
    var nextAttempt=0L; private set
    fun ready(elapsed: Long)=elapsed>=nextAttempt
    fun success(elapsed: Long) { failures=0; nextAttempt=elapsed+30_000 }
    fun failure(elapsed: Long,jitter: Long) { failures=(failures+1).coerceAtMost(6); nextAttempt=elapsed+((1L shl failures)*5000).coerceAtMost(300_000)+jitter.coerceIn(0,3000) }
}
