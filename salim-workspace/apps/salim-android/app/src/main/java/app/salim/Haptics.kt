package app.salim

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager

/** Phone vibration for alerts and the countdown; stronger and longer as the camera gets closer. */
object Haptics {
    fun pulse(context: Context, ms: Long, strength: Int) {
        val vibrator = if (Build.VERSION.SDK_INT >= 31)
            context.getSystemService(VibratorManager::class.java)?.defaultVibrator
        else context.getSystemService(Vibrator::class.java)
        if (vibrator == null || !vibrator.hasVibrator()) return
        val amplitude = if (vibrator.hasAmplitudeControl()) strength.coerceIn(1, 255) else VibrationEffect.DEFAULT_AMPLITUDE
        runCatching { vibrator.vibrate(VibrationEffect.createOneShot(ms.coerceIn(20, 1500), amplitude)) }
    }
}
