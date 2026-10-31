package app.salim.core
import org.junit.Test
import org.junit.Assert.*

class EngineTest {
    private val now=1_800_000_000_000L
    private val fix=Fix(Point(26.21,50.54),20.0,0.0,5.0,now,100_000)
    private val hazard=Hazard("static:camera","BH",Kind.CAMERA,Point(26.214,50.54),0.0,"Test road",now+3600_000)
    private fun engine(h: Hazard=hazard)=AlertEngine().apply { replace(listOf(h)) }
    @Test fun distanceAndWrap() { assertEquals(444.8,Geo.distance(fix.point,hazard.point),1.0); assertEquals(2.0,Geo.angle(359.0,1.0),0.001) }
    @Test fun warnsOnce() { val e=engine(); assertNotNull(e.evaluate(fix,now,100_000,"BH")); assertNull(e.evaluate(fix.copy(elapsedMs=101_000),now,101_000,"BH")) }
    @Test fun rejectsBadFixes() { listOf(fix.copy(accuracy=51.0),fix.copy(accuracy=-1.0),fix.copy(accuracy=Double.NaN),fix.copy(speed=0.0),fix.copy(course=null),fix.copy(course=Double.NaN),fix.copy(point=Point(91.0,50.0)),fix.copy(accuracy=0.0),fix.copy(elapsedMs=80_000),fix.copy(elapsedMs=100_001)).forEach { assertNull(engine().evaluate(it,now,100_000,"BH")) } }
    @Test fun rejectsOppositeBehindExpiredAndCountry() { listOf(hazard.copy(heading=180.0),hazard.copy(point=Point(26.208,50.54)),hazard.copy(expiresAt=now),hazard.copy(country="SA")).forEach { assertNull(engine(it).evaluate(fix,now,100_000,"BH")) } }
    @Test fun requiresExitAndMonotonicCooldown() { val e=engine(); assertNotNull(e.evaluate(fix,now,100_000,"BH"));assertNull(e.evaluate(fix.copy(timeMs=now+200_000,elapsedMs=300_000),now+200_000,300_000,"BH")); e.evaluate(fix.copy(point=Point(26.18,50.54),timeMs=now+201_000,elapsedMs=301_000),now+201_000,301_000,"BH"); assertNotNull(e.evaluate(fix.copy(timeMs=now+202_000,elapsedMs=302_000),now+202_000,302_000,"BH")) }
    @Test fun indexCrossesDateline() { val h=hazard.copy(point=Point(0.0,-179.999));assertEquals(1,SpatialIndex(listOf(h)).nearby(Point(0.0,179.999),400.0).size) }
    private val gate=Gate(Point(26.0,50.0),0.0,15.0)
    private val zone=Section("s","BH",gate,gate.copy(point=Point(26.001,50.0)),111.195,80,now+3600_000)
    private fun sample(m: Double,t: Long,speed: Double=10.0)=Fix(Point(26+m/111195,50.0),speed,0.0,3.0,now+t*1000,100_000+t*1000)
    @Test fun integratesStopsAndFinishes() { val e=SectionEngine(listOf(zone));e.evaluate(sample(-10.0,0),now,100_000,"BH");val first=e.evaluate(sample(10.0,2),now+2000,102_000,"BH");assertEquals(36.0,first.active.single().kmh,.01);val stopped=e.evaluate(sample(10.0,4,0.0).copy(course=null),now+4000,104_000,"BH");assertTrue(stopped.active.single().kmh<36);e.evaluate(sample(80.0,11),now+11000,111_000,"BH");assertEquals(1,e.evaluate(sample(120.0,15),now+15000,115_000,"BH").completed.size) }
    @Test fun ignoresStartInsideAndAdjacentRoad() { val e=SectionEngine(listOf(zone));e.evaluate(sample(30.0,0),now,100_000,"BH");assertTrue(e.evaluate(sample(40.0,1),now+1000,101_000,"BH").active.isEmpty()); val other=SectionEngine(listOf(zone));other.evaluate(sample(-10.0,0).copy(point=Point(25.9999,50.001)),now,100_000,"BH");assertTrue(other.evaluate(sample(10.0,2).copy(point=Point(26.0001,50.001)),now+2000,102_000,"BH").active.isEmpty()) }
    @Test fun invalidatesGapReversalAndPoorAccuracy() { for(which in 0..2) { val e=SectionEngine(listOf(zone));e.evaluate(sample(-10.0,0),now,100_000,"BH");e.evaluate(sample(10.0,2),now+2000,102_000,"BH");val f=when(which){0->sample(20.0,30);1->sample(20.0,3).copy(course=180.0);else->sample(20.0,3).copy(accuracy=60.0)};assertEquals(setOf("s"),e.evaluate(f,f.timeMs,f.elapsedMs,"BH").invalidated) } }
    @Test fun expiryDoesNotResetWhenNetworkIsAbsent() { val e=engine(hazard.copy(expiresAt=now+500));assertNull(e.evaluate(fix.copy(timeMs=now+1000,elapsedMs=101_000),now+1000,101_000,"BH")) }
    // A phone clock that disagrees with GNSS time must not block alerts; age is judged
    // on the monotonic clock only.
    @Test fun wallClockSkewDoesNotRejectFix() { listOf(fix.copy(timeMs=now-60_000),fix.copy(timeMs=now+60_000)).forEach { assertNotNull(engine().evaluate(it,now,100_000,"BH")) } }
    // Coarse first fixes count as "found" for position, never for alerts.
    @Test fun coarseFixPositionsButDoesNotAlert() {
        val coarse=fix.copy(accuracy=180.0)
        assertTrue(Geo.positioned(coarse,100_000)); assertFalse(Geo.usable(coarse,now,100_000)); assertNull(engine().evaluate(coarse,now,100_000,"BH"))
        listOf(fix.copy(accuracy=1500.0),fix.copy(accuracy=-1.0),fix.copy(elapsedMs=60_000)).forEach { assertFalse(Geo.positioned(it,100_000)) }
    }
    // Live cameras alert across an approximate border; other rows stay country-scoped.
    @Test fun liveCameraAlertsAcrossBorder() {
        assertNotNull(engine(hazard.copy(id="osm:node/1",country="SA")).evaluate(fix,now,100_000,"BH"))
        assertNull(engine(hazard.copy(country="SA")).evaluate(fix,now,100_000,"BH"))
    }
    @Test fun limitIsValidated() {
        assertEquals(80,hazard.copy(limit=80).limit)
        try { hazard.copy(limit=400); fail("Expected an implausible limit to be rejected") } catch(_: IllegalArgumentException) {}
    }
}
