package app.salim
import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.media.ToneGenerator
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import app.salim.core.Hazard
import app.salim.core.Kind
import java.util.Locale
import java.util.UUID

class AudioAlerts(context: Context) {
    private val manager=context.getSystemService(AudioManager::class.java)
    private val main=Handler(Looper.getMainLooper())
    private val attributes=AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE).setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build()
    private var ready=false
    /** True when alerts are spoken in Arabic: the phone is set to Arabic and an Arabic voice is installed. */
    var arabic=false
        private set
    private var closed=false
    private var current: String?=null
    private var tts: TextToSpeech?=null
    private var tone: ToneGenerator?=null
    private val focus=AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK).setAudioAttributes(attributes).setAcceptsDelayedFocusGain(false).setOnAudioFocusChangeListener({ value ->
        if(value==AudioManager.AUDIOFOCUS_LOSS || value==AudioManager.AUDIOFOCUS_LOSS_TRANSIENT)stop()
    },main).build()
    init {
        tts=TextToSpeech(context.applicationContext) { code -> main.post {
            if(!closed) {
                fun usable(result: Int?)=result!=null && result!=TextToSpeech.LANG_MISSING_DATA && result!=TextToSpeech.LANG_NOT_SUPPORTED
                // Arabic voice when the phone is in Arabic and a voice exists; English otherwise.
                val wantsArabic=Ar.enabled
                val arabicResult=if(wantsArabic) tts?.setLanguage(Locale.forLanguageTag("ar")) else null
                arabic=usable(arabicResult)
                val language=if(arabic) arabicResult else tts?.setLanguage(Locale.ENGLISH)
                ready=code==TextToSpeech.SUCCESS && usable(language)
            }
        } }
        tts?.setAudioAttributes(attributes)
        tts?.setOnUtteranceProgressListener(object: UtteranceProgressListener() {
            override fun onStart(id: String?) {}
            override fun onDone(id: String?) { finish(id) }
            @Deprecated("Platform callback") override fun onError(id: String?) { finish(id) }
            override fun onStop(id: String?,interrupted: Boolean) { finish(id) }
        })
    }
    /**
     * Short attention tone that runs before the spoken alert. ToneGenerator is
     * optional: some devices refuse to allocate one, so every call is wrapped and a
     * missing tone never prevents the voice or the alert itself.
     */
    fun beep() {
        if(closed)return
        // STREAM_MUSIC is where navigation guidance plays: it reaches car Bluetooth and is
        // not muted by silent mode. The notification stream was both.
        val generator=tone ?: runCatching { ToneGenerator(AudioManager.STREAM_MUSIC,80) }.getOrNull()
        tone=generator
        runCatching { generator?.startTone(ToneGenerator.TONE_PROP_BEEP,240) }
    }
    fun speak(message: String) {
        if(!ready || closed)return
        stop()
        if(manager.requestAudioFocus(focus)!=AudioManager.AUDIOFOCUS_REQUEST_GRANTED)return
        val id=UUID.randomUUID().toString();current=id
        if(tts?.speak(message,TextToSpeech.QUEUE_FLUSH,null,id)!=TextToSpeech.SUCCESS)stop()
        main.postDelayed({ if(current==id)stop() },15_000)
    }
    /** Speaks one alert in the active voice language. Distances over 100 m are rounded to 50 m. */
    fun speakAlert(hazard: Hazard, meters: Double, demo: Boolean) {
        val m=meters.toInt().let { if(it>100) ((it+25)/50)*50 else it }
        val limit=hazard.limit
        speak(if(arabic) {
            (if(demo)"تنبيه تجريبي. " else "")+"${arabicTitle(hazard.kind)} بعد $m متر"+(limit?.let { "، السرعة المحددة $it" } ?: "")+". التزم باللوحات المرورية."
        } else {
            (if(demo)"Demo alert. " else "")+"${hazard.title} in $m metres"+(limit?.let { ", limit $it" } ?: "")+". Follow posted signs."
        })
    }
    private fun arabicTitle(kind: Kind)=when(kind) {
        Kind.CAMERA->"كاميرا سرعة"
        Kind.MOBILE_CAMERA->"كاميرا متنقلة"
        Kind.SEATBELT->"كاميرا حزام الأمان والهاتف"
        Kind.RED_LIGHT->"كاميرا الإشارة الحمراء"
        Kind.HAZARD->"خطر على الطريق"
        Kind.ROADWORK->"أعمال طرق"
        Kind.TRAFFIC->"ازدحام مروري"
        Kind.BUMP->"مطب"
    }
    private fun finish(id: String?) { main.post { if(id!=null && current==id) { current=null;manager.abandonAudioFocusRequest(focus) } } }
    fun stop() { current=null;tts?.stop();manager.abandonAudioFocusRequest(focus) }
    fun close() { closed=true;stop();main.removeCallbacksAndMessages(null);tts?.shutdown();tts=null;runCatching { tone?.release() };tone=null }
}
