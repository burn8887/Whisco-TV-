package app.salim

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.Voice
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material.icons.outlined.Download
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.DateFormat
import java.util.Date
import java.util.Locale

private val Mono = FontFamily.Monospace
private val Box8 = RoundedCornerShape(8.dp)

@Composable
private fun Label(text: String, premium: Boolean = false) {
    Row(Modifier.padding(top = 10.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(text, fontSize = 11.sp, letterSpacing = 2.sp, fontFamily = Mono, color = MaterialTheme.colorScheme.primary)
        if (premium) PremiumBadge()
    }
}

@Composable
private fun PremiumBadge() = Text(
    "PREMIUM", fontSize = 9.sp, letterSpacing = 1.sp, fontFamily = Mono, color = BrandGround,
    modifier = Modifier.clip(RoundedCornerShape(4.dp)).background(BrandAmber).padding(horizontal = 6.dp, vertical = 2.dp)
)

@Composable
private fun Toggle(title: String, detail: String, checked: Boolean, enabled: Boolean = true, onChange: (Boolean) -> Unit) {
    Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
        Column(Modifier.weight(1f)) {
            Text(title, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
            Text(detail, fontSize = 12.sp, lineHeight = 17.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Switch(checked = checked, onCheckedChange = onChange, enabled = enabled)
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun <T> Choice(options: List<T>, selected: T, label: (T) -> String, onPick: (T) -> Unit) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
        options.forEach { o -> FilterChip(selected = o == selected, onClick = { onPick(o) }, label = { Text(label(o), fontSize = 13.sp) }) }
    }
}

/** A short demo of the full alert: chime, voice, a speeding-up countdown and the flat final tone. */
private suspend fun preview(context: Context, speak: (String) -> Unit) {
    val o = AlertPrefs.options.value
    ToneSynth.play(ToneSynth.alert(o.tone))
    if (o.vibration) Haptics.pulse(context, 300, 220)
    delay(500)
    speak(if (Ar.enabled) "كاميرا سرعة بعد 400 متر، السرعة المحددة 80. التزم باللوحات المرورية." else "Speed camera in 400 metres, limit 80. Follow posted signs.")
    delay(3_800)
    if (!o.countdown) return
    listOf(900L, 650L, 450L, 300L, 220L).forEachIndexed { i, gap ->
        ToneSynth.play(ToneSynth.tick(o.tone)); if (o.vibration) Haptics.pulse(context, 50L + i * 20, 90 + i * 40); delay(gap)
    }
    ToneSynth.play(ToneSynth.flat()); if (o.vibration) Haptics.pulse(context, 900, 255)
}

/** Settings › Alerts: sound, voice, speed, countdown, vibration and how early alerts come. */
@Composable
fun AlertOptions() {
    val context = LocalContext.current
    val o by AlertPrefs.options.collectAsState()
    val scope = rememberCoroutineScope()
    var voices by remember { mutableStateOf<List<Voice>>(emptyList()) }
    val tts = remember { mutableStateOf<TextToSpeech?>(null) }
    DisposableEffect(Unit) {
        var engine: TextToSpeech? = null
        engine = TextToSpeech(context.applicationContext) { status ->
            if (status != TextToSpeech.SUCCESS) return@TextToSpeech
            val lang = if (Ar.enabled) "ar" else "en"
            engine?.setLanguage(if (Ar.enabled) Locale.forLanguageTag("ar") else Locale.ENGLISH)
            voices = runCatching { engine?.voices.orEmpty() }.getOrDefault(emptySet())
                .filter { it.locale.language == lang && !it.isNetworkConnectionRequired && "notInstalled" !in it.features }
                .sortedBy { it.name }.take(6)
            tts.value = engine
        }
        onDispose { runCatching { engine?.stop(); engine?.shutdown() } }
    }
    fun speak(text: String) {
        val e = tts.value ?: return
        o.voiceName?.let { n -> voices.firstOrNull { it.name == n }?.let { e.setVoice(it) } }
        e.setSpeechRate(o.speechRate)
        e.speak(text, TextToSpeech.QUEUE_FLUSH, null, "preview")
    }
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Label("ALERT SOUND")
        Choice(TonePreset.entries, o.tone, { Ar.t(it.label) }) { t -> AlertPrefs.update { it.copy(tone = t) }; ToneSynth.play(ToneSynth.alert(t)) }
        Label("VOICE")
        if (voices.isEmpty()) Text("Using the phone's default voice.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        else Choice(listOf<String?>(null) + voices.map { it.name }, o.voiceName,
            { n -> if (n == null) Ar.t("Default") else "${Ar.t("Voice")} ${voices.indexOfFirst { it.name == n } + 1} · ${voices.first { it.name == n }.locale.toLanguageTag()}" }
        ) { n -> AlertPrefs.update { it.copy(voiceName = n) }; scope.launch { delay(50); speak(if (Ar.enabled) "مرحبًا، أنا صوت سالم." else "Hello, this is your Salim voice.") } }
        Label("SPEAKING SPEED")
        Choice(listOf(0.85f, 1.0f, 1.2f), o.speechRate, { Ar.t(when (it) { 0.85f -> "Calm"; 1.2f -> "Brisk"; else -> "Normal" }) }) { r -> AlertPrefs.update { it.copy(speechRate = r) } }
        Toggle("Countdown beeps", "Beeps speed up as the camera gets closer, then one flat tone right before it.", o.countdown) { v -> AlertPrefs.update { it.copy(countdown = v) } }
        Toggle("Vibration", "Pulses grow stronger and faster as you approach, so you can feel the countdown.", o.vibration) { v -> AlertPrefs.update { it.copy(vibration = v) } }
        Label("ALERT DISTANCE")
        Choice(Lead.entries, o.lead, { Ar.t(it.label) }) { l -> AlertPrefs.update { it.copy(lead = l) } }
        Text(Ar.t(when (o.lead) { Lead.EARLY -> "About 40 seconds ahead, at least 500 m."; Lead.LATE -> "About 20 seconds ahead, at least 300 m."; else -> "About 30 seconds ahead, at least 400 m." }),
            fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, translate = false)
        OutlinedButton(onClick = { scope.launch { preview(context, ::speak) } }, shape = Box8, modifier = Modifier.fillMaxWidth()) {
            Text("PLAY A TEST ALERT", fontFamily = Mono, letterSpacing = 1.sp)
        }
    }
}

/** Settings › Drive view. */
@Composable
fun DriveViewOptions() {
    val o by AlertPrefs.options.collectAsState()
    Column {
        Label("DRIVE VIEW")
        Toggle("Keep screen on", "The drive screen stays lit while a drive is running.", o.keepScreenOn) { v -> AlertPrefs.update { it.copy(keepScreenOn = v) } }
    }
}

/** Settings › Integrations: navigation app, alerts over other apps, cars and watches. */
@Composable
fun IntegrationOptions(state: DriveState, onPremium: () -> Unit) {
    val context = LocalContext.current
    val o by AlertPrefs.options.collectAsState()
    var canDraw by remember { mutableStateOf(OverlayAlert.canDraw(context)) }
    LaunchedEffect(Unit) { while (true) { canDraw = OverlayAlert.canDraw(context); delay(1_500) } }
    val scheme = MaterialTheme.colorScheme
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Label("NAVIGATION APP")
        Choice(NavApp.entries, o.navApp, { Ar.t(it.label) }) { a -> AlertPrefs.update { it.copy(navApp = a) } }
        Label("ALERTS OVER OTHER APPS", premium = true)
        Toggle(
            "Show alerts over Google Maps and Waze",
            if (o.overlay && !canDraw) Ar.t("Allow “Display over other apps” for Salim to finish.") else Ar.t("A floating card with the camera, a live countdown and the limit appears over your navigation app."),
            o.overlay && state.premium
        ) { v ->
            if (!state.premium) onPremium()
            else {
                AlertPrefs.update { it.copy(overlay = v) }
                if (v && !OverlayAlert.canDraw(context)) runCatching { context.startActivity(OverlayAlert.permissionIntent(context)) }
            }
        }
        Label("CARS AND WATCHES")
        listOf(
            "Android Auto" to "Coming soon. Alerts already play through your car speakers over Bluetooth.",
            "Wear OS watch countdown" to "Coming soon for Premium: feel the countdown on your wrist."
        ).forEach { (title, detail) ->
            Column(Modifier.fillMaxWidth().clip(Box8).border(1.dp, scheme.outline, Box8).padding(12.dp)) {
                Text(title, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                Text(detail, fontSize = 12.sp, color = scheme.onSurfaceVariant)
            }
        }
    }
}

/** Settings › Offline camera packs (Premium). */
@Composable
fun OfflinePackOptions(state: DriveState, onPremium: () -> Unit) {
    val context = LocalContext.current
    val packs by OfflinePacks.packs.collectAsState()
    val busy by OfflinePacks.busy.collectAsState()
    val scope = rememberCoroutineScope()
    val scheme = MaterialTheme.colorScheme
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Label("OFFLINE CAMERA PACKS", premium = true)
        Text("Download every mapped camera in a country so alerts keep working without signal.", fontSize = 12.sp, color = scheme.onSurfaceVariant)
        OfflinePacks.countries.forEach { (code, name) ->
            val pack = packs[code]
            Row(Modifier.fillMaxWidth().clip(Box8).border(1.dp, scheme.outline, Box8).padding(horizontal = 12.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(name, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                    Text(
                        if (pack == null) Ar.t("Not downloaded")
                        else "${pack.count} ${Ar.t("cameras")} · ${DateFormat.getDateInstance(DateFormat.MEDIUM).format(Date(pack.updatedAt))}",
                        fontSize = 11.sp, color = scheme.onSurfaceVariant, translate = false
                    )
                }
                when {
                    code in busy -> CircularProgressIndicator(Modifier.size(22.dp), strokeWidth = 2.dp)
                    !state.premium -> TextButton(onClick = onPremium) { Text("Premium", fontSize = 12.sp) }
                    else -> {
                        IconButton(onClick = {
                            scope.launch {
                                OfflinePacks.download(context, code).onSuccess { n -> DriveStore.message(Ar.t("Offline pack saved") + " · $n") }
                                    .onFailure { DriveStore.message("Download failed · Check your connection and try again") }
                            }
                        }) { Icon(Icons.Outlined.Download, Ar.t(if (pack == null) "Download" else "Update")) }
                        if (pack != null) IconButton(onClick = { OfflinePacks.remove(code) }) { Icon(Icons.Outlined.Delete, Ar.t("Delete")) }
                    }
                }
            }
        }
    }
}
