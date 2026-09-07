package tv.whisco.app

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

private val packs = listOf(
    Triple("gulf", "Gulf" to "From here — Arabic & English", listOf("Arabic", "English")),
    Triple("india", "Indian" to "9.1 million in the GCC", listOf("Hindi", "Malayalam", "Tamil", "Telugu", "Punjabi")),
    Triple("bangladesh", "Bangladeshi" to "5.04 million · Bangla", listOf("Bengali")),
    Triple("pakistan", "Pakistani" to "4.9 million · Urdu", listOf("Urdu")),
    Triple("egypt", "Egyptian" to "Arabic from Cairo", listOf("Arabic")),
    Triple("philippines", "Filipino" to "2.2 million · Filipino", listOf("Filipino")),
)

@Composable
fun OnboardingScreen(store: LocalStore, onDone: () -> Unit) {
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    var step by remember { mutableIntStateOf(0) }
    var selected by remember { mutableStateOf(setOf<String>()) }
    var gulfHome by remember { mutableStateOf(false) }
    var country by remember { mutableStateOf("BH") }
    var name by remember { mutableStateOf("You") }
    var kids by remember { mutableStateOf(false) }

    fun finish(
        languages: List<String> = selected.toList().ifEmpty { listOf("Arabic", "English") },
        clock: String = if (gulfHome) "gulf" else "origin",
    ) {
        store.completeOnboarding(name.ifBlank { "You" }, languages, country, clock, kids)
        scope.launch { store.persist(ctx) }
        onDone()
    }

    Column(Modifier.fillMaxSize().background(Bg).padding(20.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Image(painterResource(R.drawable.whisco_portrait), null, Modifier.size(56.dp))
            Spacer(Modifier.width(12.dp))
            Column {
                Text("Whisco", color = Accent, style = MaterialTheme.typography.headlineSmall)
                Text("Free. Legal. For the Gulf.", color = Muted, style = MaterialTheme.typography.bodySmall)
            }
        }
        Spacer(Modifier.height(24.dp))
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState())) {
            when (step) {
                0 -> {
                    Text("What should feel like home?", color = Fg, style = MaterialTheme.typography.headlineMedium)
                    Text(
                        "For Bahrainis, Emiratis, Saudis, Kuwaitis, Qataris, Omanis — and everyone who lives here. This stays on this device.",
                        color = Muted,
                        modifier = Modifier.padding(vertical = 8.dp),
                    )
                    packs.forEach { (id, titleSub, langs) ->
                        val on = langs.all { it in selected }
                        Column(
                            Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(if (on) Elevated else SurfaceCol)
                                .border(1.dp, if (on) Accent.copy(alpha = 0.5f) else Color.Transparent, RoundedCornerShape(16.dp))
                                .clickable {
                                    selected = if (on) selected - langs.toSet() else selected + langs
                                    if (id == "gulf") gulfHome = !on
                                }
                                .padding(14.dp),
                        ) {
                            Row {
                                Text(titleSub.first, color = Fg, style = MaterialTheme.typography.titleMedium)
                                if (id == "gulf") {
                                    Spacer(Modifier.width(8.dp))
                                    Text("FROM HERE", color = Muted, style = MaterialTheme.typography.labelSmall)
                                }
                            }
                            Text(titleSub.second, color = Muted, style = MaterialTheme.typography.bodySmall)
                        }
                    }
                    Text("FINE-TUNE LANGUAGES", color = Subtle, style = MaterialTheme.typography.labelSmall, modifier = Modifier.padding(top = 12.dp, bottom = 8.dp))
                    FlowChips(Pack.languages, selected) { lang ->
                        selected = if (lang in selected) selected - lang else selected + lang
                    }
                }
                1 -> {
                    Text("Where are you watching from?", color = Fg, style = MaterialTheme.typography.headlineMedium)
                    Text(
                        if (gulfHome) "Tonight’s clock uses this city — Manama, Dubai, Riyadh. Not sent anywhere."
                        else "Used to label live channels. Home Time still follows the languages you picked.",
                        color = Muted,
                        modifier = Modifier.padding(vertical = 8.dp),
                    )
                    Pack.countries.chunked(2).forEach { row ->
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            row.forEach { (code, label) ->
                                val on = country == code
                                Column(
                                    Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(16.dp))
                                        .background(if (on) Elevated else SurfaceCol)
                                        .border(1.dp, if (on) Accent.copy(alpha = 0.5f) else Color.Transparent, RoundedCornerShape(16.dp))
                                        .clickable { country = code }
                                        .padding(14.dp),
                                ) {
                                    Text(code, color = Subtle, style = MaterialTheme.typography.labelSmall)
                                    Text(label, color = Fg, style = MaterialTheme.typography.titleSmall)
                                    Text(HomeTime.countryCity(code), color = Muted, style = MaterialTheme.typography.bodySmall)
                                }
                            }
                            if (row.size == 1) Spacer(Modifier.weight(1f))
                        }
                        Spacer(Modifier.height(8.dp))
                    }
                }
                else -> {
                    Text("Name this face", color = Fg, style = MaterialTheme.typography.headlineMedium)
                    Text("Households here share a phone. Faces swap the language mosaic without an account.", color = Muted, modifier = Modifier.padding(vertical = 8.dp))
                    OutlinedTextField(
                        name, { name = it },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Fg, unfocusedTextColor = Fg, focusedBorderColor = Accent, unfocusedBorderColor = Muted.copy(alpha = 0.3f)),
                    )
                    Spacer(Modifier.height(8.dp))
                    Column(
                        Modifier.fillMaxWidth().clip(RoundedCornerShape(16.dp)).background(if (kids) Accent.copy(alpha = 0.12f) else SurfaceCol).clickable { kids = !kids }.padding(14.dp),
                    ) {
                        Text("Kids face · ${if (kids) "On" else "Off"}", color = Fg)
                        Text("Pins this mosaic to Kids live + cartoons. Shared phone, one tap.", color = Muted, style = MaterialTheme.typography.bodySmall)
                    }
                    Spacer(Modifier.height(12.dp))
                    Text("No signup. Ever.", color = Muted)
                    Text("One ad per screen, never on the picture.", color = Muted)
                    Text("Only legal streams — FTA, official embeds, licensed.", color = Muted)
                    Spacer(Modifier.height(12.dp))
                    Text(
                        "Named after a real Shih Tzu. In this house he is Whisco when children are in the room. The rest of his name lives in a glass.",
                        color = Subtle,
                        style = MaterialTheme.typography.bodySmall,
                    )
                }
            }
        }
        Spacer(Modifier.height(8.dp))
        when (step) {
            0 -> {
                PrimaryButton("Continue", enabled = selected.isNotEmpty()) { step = 1 }
                GhostButton("Start with the Gulf") { finish(listOf("Arabic", "English"), "gulf") }
            }
            1 -> {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    GhostButton("Back", Modifier.weight(1f)) { step = 0 }
                    PrimaryButton("Continue", modifier = Modifier.weight(1f)) { step = 2 }
                }
            }
            else -> {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    GhostButton("Back", Modifier.weight(1f)) { step = 1 }
                    PrimaryButton("Start watching", modifier = Modifier.weight(1f)) { finish() }
                }
            }
        }
    }
}
