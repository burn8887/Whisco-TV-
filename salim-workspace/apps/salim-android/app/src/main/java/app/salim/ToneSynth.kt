package app.salim

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.os.Handler
import android.os.Looper
import kotlin.math.PI
import kotlin.math.exp
import kotlin.math.min
import kotlin.math.sin

/**
 * Alert sounds synthesised on the device: no audio assets, crisp at any volume, and played
 * with navigation-guidance attributes so they reach car Bluetooth and ignore silent mode.
 */
object ToneSynth {
    private const val RATE = 44_100

    private fun tone(freq: Double, ms: Int, volume: Double = 0.75, decay: Double = 0.0): ShortArray {
        val n = RATE * ms / 1000
        val attack = RATE * 6 / 1000
        val release = min(n / 3, RATE * 40 / 1000)
        return ShortArray(n) { i ->
            val t = i.toDouble() / RATE
            var env = 1.0
            if (i < attack) env = i.toDouble() / attack
            if (i > n - release) env = (n - i).toDouble() / release
            if (decay > 0) env *= exp(-decay * t)
            (sin(2 * PI * freq * t) * env * volume * Short.MAX_VALUE).toInt().toShort()
        }
    }

    private fun silence(ms: Int) = ShortArray(RATE * ms / 1000)
    private fun join(vararg parts: ShortArray): ShortArray {
        val out = ShortArray(parts.sumOf { it.size }); var at = 0
        parts.forEach { it.copyInto(out, at); at += it.size }
        return out
    }

    /** The sound when an alert first fires. */
    fun alert(preset: TonePreset): ShortArray = when (preset) {
        TonePreset.CHIME -> join(tone(880.0, 140), silence(25), tone(1320.0, 240))
        TonePreset.PULSE -> join(tone(1000.0, 90), silence(70), tone(1000.0, 90), silence(70), tone(1000.0, 90))
        TonePreset.SONAR -> tone(1180.0, 520, 0.8, decay = 7.0)
        TonePreset.CLASSIC -> join(tone(1500.0, 180), silence(60), tone(1500.0, 180))
    }

    /** One countdown tick in the chosen sound family. */
    fun tick(preset: TonePreset): ShortArray = when (preset) {
        TonePreset.CHIME -> tone(1320.0, 70)
        TonePreset.PULSE -> tone(1000.0, 60)
        TonePreset.SONAR -> tone(1180.0, 160, 0.8, decay = 14.0)
        TonePreset.CLASSIC -> tone(1500.0, 70)
    }

    /** The flat warning tone right before the detection zone. */
    fun flat(ms: Int = 1200): ShortArray = tone(1050.0, ms, 0.7)

    fun play(samples: ShortArray) {
        runCatching {
            val track = AudioTrack.Builder()
                .setAudioAttributes(AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build())
                .setAudioFormat(AudioFormat.Builder().setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .setSampleRate(RATE).setChannelMask(AudioFormat.CHANNEL_OUT_MONO).build())
                .setTransferMode(AudioTrack.MODE_STATIC)
                .setBufferSizeInBytes(samples.size * 2)
                .build()
            track.write(samples, 0, samples.size)
            track.play()
            val ms = samples.size * 1000L / RATE
            Handler(Looper.getMainLooper()).postDelayed({ runCatching { track.stop(); track.release() } }, ms + 150)
        }
    }
}
