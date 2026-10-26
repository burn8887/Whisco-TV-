package app.salim
import app.salim.core.*
object DemoData {
    const val EXPIRY=1_893_456_000_000L
    val center=Point(26.22,50.55)
    val hazards=listOf(
        Hazard("static:demo-roadwork","BH",Kind.ROADWORK,Point(26.2353,50.5655),90.0,"King Faisal Highway",EXPIRY),
        Hazard("static:demo-hazard","BH",Kind.HAZARD,Point(26.2003,50.5768),null,"Shaikh Isa bin Salman Highway",EXPIRY),
        Hazard("static:demo-traffic","BH",Kind.TRAFFIC,Point(26.2280,50.5810),120.0,"King Faisal Highway",EXPIRY),
        Hazard("static:demo-bump","BH",Kind.BUMP,Point(26.2050,50.5590),null,"Road 2813, Manama",EXPIRY)
    )
    // Gates sit on the simulated line, five and forty-five seconds in, so the average-speed
    // demo measures a real interval instead of assuming the driver found the zone.
    val sections=listOf(Section("demo-section","BH",Gate(Point(26.231925,50.533399),26.3,18.0),Gate(Point(26.237725,50.536589),26.3,18.0),720.0,80,EXPIRY))
}
