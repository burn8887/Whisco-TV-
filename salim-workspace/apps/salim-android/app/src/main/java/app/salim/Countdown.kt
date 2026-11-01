package app.salim

import android.content.Context
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

/**
 * Parking-sensor style countdown to a camera: ticks (and vibration pulses) speed up and
 * strengthen as the distance falls, then one flat tone right before the detection zone.
 * Stops on its own once the camera is behind the driver.
 */
class Countdown(private val context: Context, private val scope: CoroutineScope) {
    private var job: Job? = null
    @Volatile private var target: String? = null
    @Volatile private var meters = Double.MAX_VALUE
    @Volatile private var closest = Double.MAX_VALUE

    fun start(hazardId: String, distance: Double) {
        target = hazardId; meters = distance; closest = distance
        if (job?.isActive == true) return
        job = scope.launch {
            delay(1_500) // let the first alert sound and voice finish
            while (isActive && target != null) {
                val m = meters
                val o = AlertPrefs.options.value
                if (m <= 60) {
                    if (o.countdown) ToneSynth.play(ToneSynth.flat())
                    if (o.vibration) Haptics.pulse(context, 900, 255)
                    target = null
                    break
                }
                val interval = when {
                    m > 600 -> 3_000L
                    m > 400 -> 2_000L
                    m > 250 -> 1_300L
                    m > 150 -> 800L
                    else -> 450L
                }
                val strength = (255 * (1 - (m.coerceIn(60.0, 700.0) - 60) / 640)).toInt().coerceIn(60, 255)
                if (o.countdown) ToneSynth.play(ToneSynth.tick(o.tone))
                if (o.vibration) Haptics.pulse(context, 40L + strength / 5, strength)
                delay(interval)
            }
        }
    }

    /** Live distance to the alerted camera; once it grows past the closest point, it's behind us. */
    fun update(distance: Double) {
        if (target == null) return
        meters = distance
        if (distance < closest) closest = distance
        if (distance > closest + 60) stop()
    }

    fun stop() { target = null; job?.cancel(); job = null }
}
