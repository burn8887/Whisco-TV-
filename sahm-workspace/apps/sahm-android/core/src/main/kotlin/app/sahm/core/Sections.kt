package app.sahm.core

import kotlin.math.*
data class Gate(val point: Point,val heading: Double,val halfWidth: Double) {
    init { require(point.valid() && heading.isFinite() && heading>=0 && heading<360 && halfWidth in 2.0..100.0) }
}
data class Section(val id: String,val country: String,val entry: Gate,val exit: Gate,val lengthMeters: Double,val limit: Int,val expiresAt: Long) {
    init { require(id.isNotBlank() && country in COUNTRIES && lengthMeters in 50.0..100_000.0 && limit in 10..160 && expiresAt>0) }
}
data class Average(val id: String,val seconds: Double,val kmh: Double,val limit: Int,val estimated: Boolean)
data class SectionResult(val active: List<Average>,val completed: List<Average>,val invalidated: Set<String>)
class SectionEngine(private val sections: List<Section>) {
    private data class Track(val entered: Double,var meters: Double)
    private val tracks=mutableMapOf<String,Track>()
    private var previous: Fix?=null
    fun reset() { tracks.clear(); previous=null }
    private fun project(point: Point,gate: Gate): Pair<Double,Double> {
        val n=(point.lat-gate.point.lat)*111195; val e=(point.lon-gate.point.lon)*111195*cos(Math.toRadians(gate.point.lat)); val h=Math.toRadians(gate.heading)
        return n*cos(h)+e*sin(h) to e*cos(h)-n*sin(h)
    }
    private fun crossing(a: Point,b: Point,gate: Gate): Double? {
        val p=project(a,gate); val q=project(b,gate)
        if(p.first>=0 || q.first<0 || p.first==q.first)return null
        val t=-p.first/(q.first-p.first)
        return t.takeIf { abs(p.second+(q.second-p.second)*it)<=gate.halfWidth }
    }
    fun evaluate(fix: Fix,now: Long,elapsed: Long,country: String): SectionResult {
        fun invalidate(): SectionResult { val ids=tracks.keys.toSet(); reset(); return SectionResult(emptyList(),emptyList(),ids) }
        if(!Geo.usable(fix,now,elapsed,25.0))return invalidate()
        val p=previous; previous=fix
        if(p==null)return SectionResult(emptyList(),emptyList(),emptySet())
        val dt=(fix.elapsedMs-p.elapsedMs)/1000.0
        if(dt<=0 || dt>15 || Geo.distance(p.point,fix.point)>max(100.0,dt*70))return invalidate()
        val active=mutableListOf<Average>(); val complete=mutableListOf<Average>(); val invalid=mutableSetOf<String>()
        for(zone in sections) {
            var track=tracks[zone.id]
            if(zone.country!=country || zone.expiresAt<=now || (fix.speed>2 && (fix.course==null || Geo.angle(fix.course,zone.entry.heading)>100)) || (track!=null && fix.elapsedMs-track.entered>7_200_000)) {
                if(track!=null) { invalid.add(zone.id); tracks.remove(zone.id) }; continue
            }
            var from=0.0
            if(track==null) {
                if(fix.speed<2 || fix.course==null || Geo.angle(fix.course,zone.entry.heading)>55)continue
                val entry=crossing(p.point,fix.point,zone.entry) ?: continue
                track=Track(p.elapsedMs+entry*dt*1000,0.0); tracks[zone.id]=track; from=entry
            }
            val exit=crossing(p.point,fix.point,zone.exit)?.takeIf { it>=from }
            val to=exit ?: 1.0
            val v0=p.speed+(fix.speed-p.speed)*from; val v1=p.speed+(fix.speed-p.speed)*to
            track.meters+=(v0+v1)/2*dt*(to-from)
            val seconds=(p.elapsedMs+to*dt*1000-track.entered)/1000
            if(seconds<=0)continue
            if(exit!=null) { complete.add(Average(zone.id,seconds,zone.lengthMeters/seconds*3.6,zone.limit,false)); tracks.remove(zone.id) }
            else active.add(Average(zone.id,seconds,track.meters/seconds*3.6,zone.limit,true))
        }
        return SectionResult(active,complete,invalid)
    }
}
