package app.sahm
import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import java.util.Locale
import java.util.UUID

class AudioAlerts(context: Context) {
    private val manager=context.getSystemService(AudioManager::class.java)
    private val main=Handler(Looper.getMainLooper())
    private val attributes=AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE).setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build()
    private var ready=false
    private var closed=false
    private var current: String?=null
    private var tts: TextToSpeech?=null
    private val focus=AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK).setAudioAttributes(attributes).setAcceptsDelayedFocusGain(false).setOnAudioFocusChangeListener({ value ->
        if(value==AudioManager.AUDIOFOCUS_LOSS || value==AudioManager.AUDIOFOCUS_LOSS_TRANSIENT)stop()
    },main).build()
    init {
        tts=TextToSpeech(context.applicationContext) { code -> main.post {
            if(!closed) {
                val language=tts?.setLanguage(Locale.ENGLISH)
                ready=code==TextToSpeech.SUCCESS && language!=null && language!=TextToSpeech.LANG_MISSING_DATA && language!=TextToSpeech.LANG_NOT_SUPPORTED
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
    fun speak(message: String) {
        if(!ready || closed)return
        stop()
        if(manager.requestAudioFocus(focus)!=AudioManager.AUDIOFOCUS_REQUEST_GRANTED)return
        val id=UUID.randomUUID().toString();current=id
        if(tts?.speak(message,TextToSpeech.QUEUE_FLUSH,null,id)!=TextToSpeech.SUCCESS)stop()
        main.postDelayed({ if(current==id)stop() },15_000)
    }
    private fun finish(id: String?) { main.post { if(id!=null && current==id) { current=null;manager.abandonAudioFocusRequest(focus) } } }
    fun stop() { current=null;tts?.stop();manager.abandonAudioFocusRequest(focus) }
    fun close() { closed=true;stop();main.removeCallbacksAndMessages(null);tts?.shutdown();tts=null }
}
