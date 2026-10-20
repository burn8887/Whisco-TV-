package app.salim
import app.salim.core.*
object DemoData {
    const val EXPIRY=1_893_456_000_000L
    val center=Point(26.22,50.55)
    val hazards=listOf(
        Hazard("static:demo-camera-1","BH",Kind.CAMERA,Point(26.2185,50.5462),25.0,"Sheikh Khalifa bin Salman Highway",EXPIRY),
        Hazard("static:demo-roadwork","BH",Kind.ROADWORK,Point(26.2353,50.5655),90.0,"King Faisal Highway",EXPIRY),
        Hazard("static:demo-hazard","BH",Kind.HAZARD,Point(26.2003,50.5768),null,"Shaikh Isa bin Salman Highway",EXPIRY),
        Hazard("static:demo-camera-2","BH",Kind.CAMERA,Point(26.2194,50.5992),180.0,"Al Fateh Highway",EXPIRY)
    )
    val sections=listOf(Section("demo-section","BH",Gate(Point(26.214,50.54385),25.0,18.0),Gate(Point(26.220,50.54715),25.0,18.0),744.0,80,EXPIRY))
}
