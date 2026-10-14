package app.sahm.core

import kotlin.math.*

data class Point(val lat: Double, val lon: Double) {
    fun valid() = lat.isFinite() && lon.isFinite() && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
}
/** elapsedMs comes from the device's monotonic clock, never wall-clock elapsed time. */
data class Fix(val point: Point, val speed: Double, val course: Double?, val accuracy: Double, val timeMs: Long, val elapsedMs: Long)
enum class Kind { CAMERA, MOBILE_CAMERA, HAZARD, ROADWORK, TRAFFIC, BUMP }
data class Hazard(val id: String, val country: String, val kind: Kind, val point: Point, val heading: Double?, val road: String, val expiresAt: Long, val demo: Boolean = true, val revision: Long = 0) {
    init {
        require(id.isNotBlank() && id.length <= 120 && country in COUNTRIES && point.valid())
        require(heading == null || (heading.isFinite() && heading >= 0 && heading < 360))
        require(road.isNotBlank() && road.length <= 200 && expiresAt > 0 && revision >= 0)
    }
    val title: String get() = when(kind) { Kind.CAMERA -> "Speed camera"; Kind.MOBILE_CAMERA -> "Mobile camera report"; Kind.HAZARD -> "Road hazard"; Kind.ROADWORK -> "Roadworks ahead"; Kind.TRAFFIC -> "Traffic congestion"; Kind.BUMP -> "Road bump" }
}
val COUNTRIES = setOf("BH", "SA", "AE", "QA", "KW", "OM")
object Geo {
    fun angle(a: Double, b: Double) = abs((a-b+540)%360-180)
    fun distance(a: Point,b: Point): Double {
        val r=Math.PI/180
        val h=sin((b.lat-a.lat)*r/2).pow(2)+cos(a.lat*r)*cos(b.lat*r)*sin((b.lon-a.lon)*r/2).pow(2)
        return 2*6371008.8*asin(sqrt(h.coerceIn(0.0,1.0)))
    }
    fun bearing(a: Point,b: Point): Double {
        val r=Math.PI/180; val d=(b.lon-a.lon)*r
        return (atan2(sin(d)*cos(b.lat*r),cos(a.lat*r)*sin(b.lat*r)-sin(a.lat*r)*cos(b.lat*r)*cos(d))/r+360)%360
    }
    fun usable(fix: Fix, now: Long, elapsed: Long, accuracy: Double=50.0): Boolean =
        fix.point.valid() && fix.accuracy.isFinite() && fix.accuracy in 0.0..accuracy &&
        fix.elapsedMs >= 0 && elapsed-fix.elapsedMs in 0..15_000 && now-fix.timeMs in -2_000..15_000 &&
        fix.speed.isFinite() && fix.speed in 0.0..70.0 &&
        (fix.course==null || (fix.course.isFinite() && fix.course>=0 && fix.course<360))
}
class SpatialIndex(alerts: List<Hazard>) {
    private val all=alerts.toList()
    private val cells=all.groupBy { floor(it.point.lat*100).toInt() to floor(it.point.lon*100).toInt() }
    fun nearby(point: Point,radius: Double): List<Hazard> {
        if(abs(point.lat)>85)return all.filter { Geo.distance(point,it.point)<=radius }
        val dy=radius/110574; val dx=radius/(111320*cos(Math.toRadians(point.lat)))
        val result=mutableListOf<Hazard>()
        for(lat in floor((point.lat-dy)*100).toInt()..floor((point.lat+dy)*100).toInt())
            for(lon in floor((point.lon-dx)*100).toInt()..floor((point.lon+dx)*100).toInt()) {
                val wrapped=((lon+18000)%36000+36000)%36000-18000
                result += cells[lat to wrapped].orEmpty().filter { Geo.distance(point,it.point)<=radius }
            }
        return result
    }
}
data class AlertMatch(val hazard: Hazard,val meters: Double,val atElapsed: Long)
class AlertEngine {
    private var index=SpatialIndex(emptyList())
    private val seen=mutableMapOf<String,Pair<Long,Hazard>>()
    private var lastFixElapsed: Long?=null
    fun replace(alerts: List<Hazard>) { index=SpatialIndex(alerts) }
    fun reset() { seen.clear(); lastFixElapsed=null }
    fun evaluate(fix: Fix,now: Long,elapsed: Long,country: String): AlertMatch? {
        if(!Geo.usable(fix,now,elapsed) || fix.speed<2 || fix.course==null || (lastFixElapsed?.let { fix.elapsedMs<=it }==true))return null
        lastFixElapsed=fix.elapsedMs
        seen.entries.removeAll { elapsed-it.value.first>120_000 && Geo.distance(fix.point,it.value.second.point)>1500 }
        val radius=(fix.speed*30).coerceIn(400.0,1000.0)
        val hazard=index.nearby(fix.point,radius).asSequence().filter {
            it.country==country && it.expiresAt>now && !seen.containsKey(it.id) &&
            Geo.angle(fix.course,Geo.bearing(fix.point,it.point))<=55 && (it.heading==null || Geo.angle(fix.course,it.heading)<=55)
        }.minByOrNull { Geo.distance(fix.point,it.point) } ?: return null
        seen[hazard.id]=elapsed to hazard
        return AlertMatch(hazard,Geo.distance(fix.point,hazard.point),elapsed)
    }
}
