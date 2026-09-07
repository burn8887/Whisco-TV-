package tv.whisco.app

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import coil.compose.AsyncImage
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun HomeScreen(nav: NavHostController, store: LocalStore) {
    var home by remember { mutableStateOf<HomeDto?>(null) }
    var live by remember { mutableStateOf<List<ChannelDto>>(emptyList()) }
    var vod by remember { mutableStateOf<VodDto?>(null) }
    var failed by remember { mutableStateOf(false) }
    val lang = store.face.languages.firstOrNull() ?: "Arabic"
    val tick = LocalTick.current
    LaunchedEffect(lang, store.face.kidsMode) {
        failed = false
        runCatching { home = Api.home() }.onFailure { failed = true }
        runCatching { live = Api.liveAll(lang) }
        runCatching { vod = Api.vod() }
    }
    val kids = store.face.kidsMode
    val pool = if (kids) live.filter { it.category == "Kids" } else live
    val news = if (kids) emptyList() else pool.filter { it.category == "News" }.take(8)
    val sports = if (kids) emptyList() else pool.filter { it.category == "Sports" }.take(8)
    val shelves = vod?.shelves.orEmpty().filter { s ->
        if (kids) Pack.isKidsShelf(s.name)
        else store.face.languages.contains(Pack.collectionLanguage[s.name])
    }
    val (tz, city) = HomeTime.pair(lang, store.country, store.face.clockSource)
    val sponsor = Pack.sponsor(store.face.languages, store.face.clockSource)

    Column(Modifier.fillMaxSize().background(Bg).verticalScroll(rememberScrollState()).padding(16.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text("Whisco", color = Accent, style = MaterialTheme.typography.titleLarge)
            IconButton(onClick = { nav.navigate("search") }) {
                Icon(Icons.Filled.Search, contentDescription = "Search", tint = Fg)
            }
        }
        Text("${HomeTime.greeting(tz, tick)}, ${store.face.name}${if (kids) " · kids" else ""}", color = Muted)
        Text("Tonight in $city", style = MaterialTheme.typography.headlineLarge, color = Fg)
        Text("${HomeTime.format(tz, tick)} at home · watching from ${HomeTime.countryName(store.country)}", color = Muted, style = MaterialTheme.typography.bodySmall)
        Spacer(Modifier.height(16.dp))
        if (failed && home == null) {
            EmptyState("Couldn’t reach the catalog", "Check the connection and come back.")
        }
        if (!kids) {
            home?.hero?.firstOrNull()?.let { hero ->
                AsyncImage(
                    model = hero.backdropUrl ?: hero.posterUrl,
                    contentDescription = hero.name,
                    modifier = Modifier.fillMaxWidth().height(200.dp).clip(RoundedCornerShape(24.dp)).clickable { nav.navigate("title/${hero.slug}") },
                    contentScale = ContentScale.Crop,
                )
                Text(hero.name, color = Fg, style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(top = 8.dp, bottom = 12.dp))
            }
            SponsorStrip(sponsor.first, sponsor.second)
            Spacer(Modifier.height(12.dp))
        }
        if (store.resume.isNotEmpty()) {
            SectionTitle("Continue")
            Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                store.resume.take(8).forEach { entry ->
                    ResumeTile(entry) {
                        if (entry.kind == "live") nav.navigate("watchLive/${entry.id}")
                        else entry.slug?.let { nav.navigate("title/$it") }
                    }
                }
            }
        }
        if (store.favoriteChannels.isNotEmpty()) {
            SectionTitle("Pinned live")
            store.favoriteChannels.forEach { ch -> ChannelRow(ch) { nav.navigate("watchLive/${ch.id}") } }
        }
        SectionTitle(if (kids) "Kids live" else "Live mosaic · ${store.face.languages.take(3).joinToString(" · ")}")
        if (pool.isEmpty()) {
            Text(if (kids) "No kids live in this language yet. Cartoons below." else "Tuning the mosaic…", color = Muted)
        } else {
            MosaicGrid(pool.take(12)) { nav.navigate("watchLive/${it.id}") }
        }
        if (news.isNotEmpty()) {
            SectionTitle("News now")
            news.forEach { ch -> ChannelRow(ch) { nav.navigate("watchLive/${ch.id}") } }
        }
        if (sports.isNotEmpty()) {
            SectionTitle("Sports · legal FTA only")
            sports.forEach { ch -> ChannelRow(ch) { nav.navigate("watchLive/${ch.id}") } }
        }
        if (shelves.isNotEmpty()) {
            SectionTitle(if (kids) "Cartoons" else "Serials and cinema for your languages")
            Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                shelves.flatMap { it.items }.take(16).forEach { t -> Poster(t) { nav.navigate("title/${t.slug}") } }
            }
        }
        if (!kids) {
            Spacer(Modifier.height(16.dp))
            AdCard("Ad · 1 of 1 on this screen", "Send home in minutes", "Illustrative remittance sponsor. Real ads stay this quiet.")
            shelves.take(4).forEach { shelf ->
                SectionTitle(shelf.name)
                Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    shelf.items.forEach { t -> Poster(t) { nav.navigate("title/${t.slug}") } }
                }
            }
        }
        home?.stats?.let {
            Text("${it.channels} live channels · ${it.titles} titles · legal sources only", color = Subtle, modifier = Modifier.padding(top = 16.dp).fillMaxWidth())
        }
    }
}

@Composable
private fun ResumeTile(entry: ResumeDto, onClick: () -> Unit) {
    Column(Modifier.width(168.dp).clickable(onClick = onClick)) {
        Box {
            AsyncImage(
                model = entry.posterUrl,
                contentDescription = entry.name,
                modifier = Modifier.fillMaxWidth().height(94.dp).clip(RoundedCornerShape(12.dp)),
                contentScale = ContentScale.Crop,
            )
            Text(
                if (entry.kind == "live") "LIVE" else "Resume",
                color = if (entry.kind == "live") LivePink else Muted,
                style = MaterialTheme.typography.labelSmall,
                modifier = Modifier.align(Alignment.BottomStart).padding(8.dp),
            )
        }
        Text(entry.name, color = Fg, maxLines = 2, style = MaterialTheme.typography.bodySmall)
    }
}

@Composable
fun LiveScreen(nav: NavHostController, store: LocalStore) {
    var lang by remember { mutableStateOf(store.face.languages.firstOrNull() ?: "Arabic") }
    var cat by remember { mutableStateOf(if (store.face.kidsMode) "Kids" else "All") }
    var q by remember { mutableStateOf("") }
    var mosaic by remember { mutableStateOf(true) }
    var channels by remember { mutableStateOf<List<ChannelDto>>(emptyList()) }
    var loading by remember { mutableStateOf(false) }
    LaunchedEffect(store.face.id) {
        lang = store.face.languages.firstOrNull() ?: "Arabic"
        cat = if (store.face.kidsMode) "Kids" else "All"
    }
    LaunchedEffect(lang) {
        loading = true
        runCatching { channels = Api.liveAll(lang) }
        loading = false
    }
    val filtered = channels.filter {
        val kidsOk = if (store.face.kidsMode) it.category == "Kids" else true
        val catOk = cat == "All" || it.category == cat
        val qOk = q.isBlank() || "${it.name} ${it.country} ${it.category}".contains(q, true)
        kidsOk && catOk && qOk
    }
    val visibleCats = Pack.categories.filter { it == "All" || channels.any { c -> c.category == it } }
    val catLabels = visibleCats.map { c ->
        val n = if (c == "All") 0 else channels.count { it.category == c }
        if (n > 0) "$c · $n" else c
    }
    Column(Modifier.fillMaxSize().background(Bg).verticalScroll(rememberScrollState()).padding(16.dp)) {
        Text("Live", style = MaterialTheme.typography.headlineLarge, color = Fg)
        Text("${channels.size} channels · legal FTA", color = Muted)
        Text("Language first, then category. Channel +/− on the player is the remote.", color = Muted, style = MaterialTheme.typography.bodySmall)
        Spacer(Modifier.height(8.dp))
        ChipRow(store.face.languages.ifEmpty { listOf(lang) }, lang) { lang = it }
        if (!store.face.kidsMode) {
            Spacer(Modifier.height(8.dp))
            ChipRow(catLabels, catLabels.firstOrNull { it == cat || it.startsWith("$cat ·") } ?: cat) { picked ->
                cat = picked.substringBefore(" ·")
            }
        }
        OutlinedTextField(
            q, { q = it }, modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
            placeholder = { Text("Filter $lang channels") },
            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Fg, unfocusedTextColor = Fg, focusedBorderColor = Accent, unfocusedBorderColor = Muted.copy(alpha = 0.3f)),
        )
        TextButton(onClick = { mosaic = !mosaic }) { Text(if (mosaic) "List" else "Mosaic", color = Muted) }
        if (store.favoriteChannels.isNotEmpty()) {
            SectionTitle("Pinned")
            store.favoriteChannels.forEach { ch -> ChannelRow(ch) { nav.navigate("watchLive/${ch.id}") } }
        }
        when {
            loading -> Text("Loading $lang…", color = Muted, modifier = Modifier.padding(16.dp))
            filtered.isEmpty() -> EmptyState(
                if (store.face.kidsMode) "No kids channels here" else "Nothing in this slice",
                if (store.face.kidsMode) "Try English, or open Cartoons in Library." else "Try another language or category.",
            )
            mosaic -> MosaicGrid(filtered.take(60)) { nav.navigate("watchLive/${it.id}") }
            else -> filtered.take(80).forEach { ch ->
                Box(Modifier.padding(bottom = 8.dp)) { ChannelRow(ch) { nav.navigate("watchLive/${ch.id}") } }
            }
        }
    }
}

@Composable
fun LibraryScreen(nav: NavHostController, store: LocalStore) {
    var vod by remember { mutableStateOf<VodDto?>(null) }
    LaunchedEffect(Unit) { runCatching { vod = Api.vod() } }
    val kids = store.face.kidsMode
    val langs = store.face.languages
    val mine = vod?.shelves.orEmpty().filter { s ->
        if (kids) Pack.isKidsShelf(s.name) else langs.contains(Pack.collectionLanguage[s.name])
    }
    val hubs = vod?.shelves.orEmpty().mapNotNull { Pack.collectionLanguage[it.name] }.toSet().sorted()
    val rest = vod?.shelves.orEmpty().filter { s -> !mine.contains(s) && !Pack.isKidsShelf(s.name) }
    Column(Modifier.fillMaxSize().background(Bg).verticalScroll(rememberScrollState()).padding(16.dp)) {
        Text("Library", style = MaterialTheme.typography.headlineLarge, color = Fg)
        Text(if (kids) "Kids face · cartoons only" else "${vod?.total ?: 0} titles · language first, genre second", color = Muted)
        if (!kids && hubs.isNotEmpty()) {
            Spacer(Modifier.height(8.dp))
            ChipRow(hubs, langs.firstOrNull().orEmpty()) { nav.navigate("hub/$it") }
        }
        mine.forEach { shelf ->
            SectionTitle(shelf.name)
            Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                shelf.items.forEach { t -> Poster(t) { nav.navigate("title/${t.slug}") } }
            }
        }
        if (kids && mine.isEmpty()) EmptyState("No cartoon shelf", "Turn kids mode off on You if you want the full library.")
        if (!kids) {
            Spacer(Modifier.height(16.dp))
            AdCard("Ad · 1 of 1 on this screen", "Friday flights, Saturday serials", "Airline inventory belongs at the end of a browse, not on the picture.")
            if (rest.isNotEmpty()) {
                SectionTitle("Also on Whisco")
                rest.forEach { shelf ->
                    Text(shelf.name, color = Fg, style = MaterialTheme.typography.titleSmall, modifier = Modifier.padding(top = 12.dp, bottom = 8.dp))
                    Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        shelf.items.forEach { t -> Poster(t) { nav.navigate("title/${t.slug}") } }
                    }
                }
            }
        }
    }
}

@Composable
fun HubScreen(lang: String, nav: NavHostController, store: LocalStore) {
    var live by remember { mutableStateOf<List<ChannelDto>>(emptyList()) }
    var vod by remember { mutableStateOf<VodDto?>(null) }
    val tick = LocalTick.current
    LaunchedEffect(lang) {
        runCatching { live = Api.liveAll(lang) }
        runCatching { vod = Api.vod() }
    }
    val sponsor = Pack.sponsor(listOf(lang), store.face.clockSource)
    Column(Modifier.fillMaxSize().background(Bg).verticalScroll(rememberScrollState()).padding(16.dp)) {
        TextButton(onClick = { nav.popBackStack() }) { Text("Back", color = Muted) }
        Text(HomeTime.label(lang, store.country, store.face.clockSource, tick), color = Muted)
        Text(lang, style = MaterialTheme.typography.headlineLarge, color = Fg)
        Spacer(Modifier.height(8.dp))
        SponsorStrip(sponsor.first, sponsor.second)
        if (live.isNotEmpty()) {
            SectionTitle("Live now")
            live.take(12).forEach { ch -> ChannelRow(ch) { nav.navigate("watchLive/${ch.id}") } }
        }
        vod?.shelves.orEmpty().filter { Pack.collectionLanguage[it.name] == lang }.forEach { shelf ->
            SectionTitle(shelf.name)
            Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                shelf.items.forEach { t -> Poster(t) { nav.navigate("title/${t.slug}") } }
            }
        }
    }
}

@Composable
fun YouScreen(nav: NavHostController, store: LocalStore) {
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    var adding by remember { mutableStateOf(false) }
    var newName by remember { mutableStateOf("") }
    var newLangs by remember { mutableStateOf(setOf("Arabic", "English")) }
    var newKids by remember { mutableStateOf(false) }
    fun save() = scope.launch { store.persist(ctx) }

    Column(Modifier.fillMaxSize().background(Bg).verticalScroll(rememberScrollState()).padding(16.dp)) {
        Text("You", style = MaterialTheme.typography.headlineLarge, color = Fg)
        Text("On this device only. Data Not Collected.", color = Muted)
        Spacer(Modifier.height(12.dp))
        SectionTitle("Faces")
        store.faces.forEach { f ->
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(if (f.id == store.face.id) Elevated else SurfaceCol)
                    .clickable { store.setActiveFace(f.id); save() }
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(
                    Modifier.size(32.dp).clip(CircleShape).background(Color.hsv(f.hue, 0.8f, 0.55f)),
                    contentAlignment = Alignment.Center,
                ) { Text(f.name.take(1), color = Bg, style = MaterialTheme.typography.labelMedium) }
                Spacer(Modifier.width(10.dp))
                Column(Modifier.weight(1f)) {
                    Row {
                        Text(f.name, color = Fg)
                        if (f.kidsMode) Text("  Kids", color = Accent, style = MaterialTheme.typography.labelSmall)
                    }
                    Text(f.languages.joinToString(" · "), color = Muted, style = MaterialTheme.typography.bodySmall)
                }
            }
        }
        if (store.faces.size < 4) {
            TextButton(onClick = { adding = true }) { Text("Add face", color = Fg) }
        }
        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            Text("Kids face", color = Fg, modifier = Modifier.weight(1f))
            Switch(
                checked = store.face.kidsMode,
                onCheckedChange = { on -> store.updateActive { copy(kidsMode = on) }; save() },
                colors = SwitchDefaults.colors(checkedThumbColor = Fg, checkedTrackColor = Accent),
            )
        }
        if (adding) {
            OutlinedTextField(
                newName, { newName = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Ammi, Kids, Baba…") },
                colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Fg, unfocusedTextColor = Fg),
            )
            Spacer(Modifier.height(8.dp))
            FlowChips(Pack.languages, newLangs) { lang ->
                newLangs = if (lang in newLangs) newLangs - lang else newLangs + lang
            }
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Kids face", color = Fg, modifier = Modifier.weight(1f))
                Switch(checked = newKids, onCheckedChange = { newKids = it }, colors = SwitchDefaults.colors(checkedThumbColor = Fg, checkedTrackColor = Accent))
            }
            PrimaryButton("Save face") {
                store.addFace(newName.ifBlank { if (newKids) "Kids" else "Face" }, newLangs.toList().ifEmpty { listOf("English") }, newKids)
                adding = false
                newName = ""
                save()
            }
        }
        SectionTitle("Watching from")
        ChipRow(Pack.countries.map { it.second }, HomeTime.countryName(store.country)) { label ->
            Pack.countries.firstOrNull { it.second == label }?.let {
                store.country = it.first
                save()
            }
        }
        Spacer(Modifier.height(8.dp))
        ChipRow(listOf("Clock from here", "Clock from home languages"), if (store.face.clockSource == "gulf") "Clock from here" else "Clock from home languages") { picked ->
            store.updateActive { copy(clockSource = if (picked.startsWith("Clock from here")) "gulf" else "origin") }
            save()
        }
        if (store.resume.isNotEmpty()) {
            SectionTitle("Continue")
            store.resume.take(6).forEach { entry ->
                Text(
                    entry.name,
                    color = Fg,
                    modifier = Modifier.clickable {
                        if (entry.kind == "live") nav.navigate("watchLive/${entry.id}")
                        else entry.slug?.let { nav.navigate("title/$it") }
                    }.padding(vertical = 6.dp),
                )
            }
        }
        SectionTitle("Pinned live")
        if (store.favoriteChannels.isEmpty()) Text("Star a channel on the player.", color = Muted)
        store.favoriteChannels.forEach { ch -> ChannelRow(ch) { nav.navigate("watchLive/${ch.id}") } }
        SectionTitle("Saved")
        if (store.watchlist.isEmpty()) Text("Nothing saved yet. Tap Save on a title.", color = Muted)
        store.watchlist.forEach { t ->
            Text(t.name, color = Fg, modifier = Modifier.clickable { nav.navigate("title/${t.slug}") }.padding(vertical = 6.dp))
        }
        TextButton(onClick = { nav.navigate("cast") }) { Text("Put it on the TV — the legal Jadoo", color = Fg) }
        TextButton(onClick = { nav.navigate("search") }) { Text("Search", color = Fg) }
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text("Live chime", color = Fg)
                Text("Off by default. Shared rooms, night shifts.", color = Muted, style = MaterialTheme.typography.bodySmall)
            }
            Switch(
                checked = store.soundEnabled,
                onCheckedChange = { store.soundEnabled = it; save() },
                colors = SwitchDefaults.colors(checkedThumbColor = Fg, checkedTrackColor = Accent),
            )
        }
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.Top) {
            androidx.compose.foundation.Image(painterResource(R.drawable.whisco_sit), null, Modifier.size(56.dp))
            Spacer(Modifier.width(12.dp))
            Column {
                Text("Whisco", color = Fg, style = MaterialTheme.typography.titleMedium)
                Text("Named after a real Shih Tzu. In this house he is Whisco when children are in the room. The rest of his name lives in a glass.", color = Muted, style = MaterialTheme.typography.bodySmall)
            }
        }
        TextButton(onClick = { store.reset(); save() }) { Text("Reset this device", color = LivePink) }
        Text("Data not collected. Watchlist and faces never leave the phone.", color = Subtle, style = MaterialTheme.typography.bodySmall)
        Text("Android TV: same Compose graph with d-pad focus. Media3 handles HDMI without a second app.", color = Subtle, style = MaterialTheme.typography.bodySmall, modifier = Modifier.padding(top = 8.dp))
    }
}

@Composable
fun SearchScreen(nav: NavHostController, store: LocalStore) {
    var q by remember { mutableStateOf("") }
    var channels by remember { mutableStateOf<List<ChannelDto>>(emptyList()) }
    var titles by remember { mutableStateOf<List<TitleDto>>(emptyList()) }
    var busy by remember { mutableStateOf(false) }
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    LaunchedEffect(q) {
        val value = q.trim()
        if (value.length < 2) {
            channels = emptyList(); titles = emptyList(); return@LaunchedEffect
        }
        delay(280)
        if (q.trim() != value) return@LaunchedEffect
        busy = true
        store.pushSearch(value)
        scope.launch { store.persist(ctx) }
        runCatching { channels = Api.live(q = value).channels }
        runCatching { titles = Api.searchVod(value).items }
        busy = false
    }
    Column(Modifier.fillMaxSize().background(Bg).verticalScroll(rememberScrollState()).padding(16.dp)) {
        TextButton(onClick = { nav.popBackStack() }) { Text("Back", color = Muted) }
        Text("Search", style = MaterialTheme.typography.headlineLarge, color = Fg)
        OutlinedTextField(
            q, { q = it }, modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
            placeholder = { Text("Channels, serials, films — try Ezel, Asianet, natok") },
            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Fg, unfocusedTextColor = Fg, focusedBorderColor = Accent),
        )
        if (q.trim().length < 2) {
            if (store.recentSearches.isNotEmpty()) {
                SectionTitle("Recent")
                store.recentSearches.forEach { s ->
                    Text(s, color = Muted, modifier = Modifier.clickable { q = s }.padding(vertical = 6.dp))
                }
            }
            SectionTitle("Try")
            listOf("Ezel", "Asianet", "natok", "Geo News", "Bahrain TV", "ABS-CBN", "Kuruluş Osman").forEach { s ->
                Text(s, color = Muted, modifier = Modifier.clickable { q = s }.padding(vertical = 6.dp))
            }
        }
        if (busy) Text("Looking…", color = Muted)
        channels.take(8).forEach { ch -> ChannelRow(ch) { nav.navigate("watchLive/${ch.id}") } }
        titles.forEach { t ->
            Text(t.name, color = Fg, modifier = Modifier.clickable { nav.navigate("title/${t.slug}") }.padding(vertical = 8.dp))
        }
        if (q.length >= 2 && !busy && titles.isEmpty() && channels.isEmpty()) {
            Text("Nothing for “$q”.", color = Muted)
        }
    }
}

@Composable
fun CastScreen(nav: NavHostController, store: LocalStore) {
    var started by remember { mutableStateOf(false) }
    val code = remember {
        listOf("whisco", "bahrain", "kochi", "manila", "karachi", "dhaka").random() +
            "-" + listOf("dizi", "natok", "surya", "osman", "gulffree").random()
    }
    Column(Modifier.fillMaxSize().background(Bg).padding(20.dp)) {
        TextButton(onClick = { nav.popBackStack() }) { Text("Back", color = Muted) }
        Text("The legal Jadoo", style = MaterialTheme.typography.headlineLarge, color = Fg)
        Text(
            "Pirate boxes won because the phone was a remote and the TV was a screen. We copy that ritual — not the stolen signal. Cast SDK on a later build; a room code for any cheap stick today.",
            color = Muted,
            modifier = Modifier.padding(vertical = 8.dp),
        )
        Box(
            Modifier.fillMaxWidth().height(220.dp).clip(RoundedCornerShape(24.dp)).background(Color.Black),
            contentAlignment = Alignment.Center,
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                androidx.compose.foundation.Image(painterResource(R.drawable.whisco_sit), null, Modifier.size(72.dp))
                Spacer(Modifier.height(8.dp))
                if (started) {
                    Text(code, color = Fg, style = MaterialTheme.typography.headlineSmall)
                    Text("Enter on the TV app · 8 min left", color = Muted, style = MaterialTheme.typography.bodySmall)
                } else {
                    Text("TV is waiting", color = Muted)
                }
            }
        }
        Text("Playing as ${store.face.name} · ${store.face.languages.joinToString(" · ")}", color = Muted, modifier = Modifier.padding(top = 12.dp))
        Spacer(Modifier.height(12.dp))
        PrimaryButton(if (started) "Code refreshed on the TV" else "Start a TV session") { started = true }
        Text("Streams stay legal FTA and official embeds. Never a scraped YouTube URL.", color = Subtle, style = MaterialTheme.typography.bodySmall, modifier = Modifier.padding(top = 12.dp))
    }
}

@Composable
fun TitleScreen(slug: String, nav: NavHostController, store: LocalStore) {
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    var envelope by remember { mutableStateOf<TitleEnvelope?>(null) }
    var failed by remember { mutableStateOf(false) }
    LaunchedEffect(slug) {
        runCatching { envelope = Api.title(slug) }.onFailure { failed = true }
    }
    val t = envelope?.title
    Column(Modifier.fillMaxSize().background(Bg).verticalScroll(rememberScrollState())) {
        when {
            t != null -> {
                TextButton(onClick = { nav.popBackStack() }, modifier = Modifier.padding(horizontal = 8.dp)) { Text("Back", color = Muted) }
                AsyncImage(t.backdropUrl ?: t.posterUrl, t.name, Modifier.fillMaxWidth().height(220.dp), contentScale = ContentScale.Crop)
                Column(Modifier.padding(16.dp)) {
                    Text(listOfNotNull(t.language, t.collection, t.releaseYear?.toString()).joinToString(" · ").uppercase(), color = Muted, style = MaterialTheme.typography.labelSmall)
                    Text(t.name, color = Fg, style = MaterialTheme.typography.headlineMedium)
                    Text(t.synopsis.orEmpty(), color = Muted, modifier = Modifier.padding(vertical = 8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        val first = t.seasons.firstOrNull()?.episodes?.firstOrNull()
                        val playUrl = first?.streamUrl ?: t.streamUrl
                        if (playUrl != null) {
                            PrimaryButton("Play", modifier = Modifier.weight(1f)) {
                                store.upsertResume(ResumeDto(t.id.ifBlank { slug }, "vod", t.slug.ifBlank { slug }, t.name, t.posterUrl, t.language, System.currentTimeMillis()))
                                scope.launch { store.persist(ctx) }
                                navigatePlayback(nav, playUrl)
                            }
                        }
                        TextButton(onClick = {
                            store.toggleSaved(TitleDto(id = t.id.ifBlank { slug }, slug = t.slug.ifBlank { slug }, name = t.name, posterUrl = t.posterUrl, backdropUrl = t.backdropUrl, language = t.language, collection = t.collection, releaseYear = t.releaseYear))
                            scope.launch { store.persist(ctx) }
                        }) { Text(if (store.isSaved(t.id, t.slug.ifBlank { slug })) "Saved" else "Save", color = Fg) }
                    }
                }
                t.seasons.forEach { season ->
                    Text("Season ${season.number}", color = Fg, style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp))
                    season.episodes.forEach { ep ->
                        Row(
                            Modifier.fillMaxWidth().clickable { ep.streamUrl?.let { navigatePlayback(nav, it) } }.padding(horizontal = 16.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            if (ep.stillUrl != null) {
                                AsyncImage(ep.stillUrl, null, Modifier.width(96.dp).height(54.dp).clip(RoundedCornerShape(8.dp)), contentScale = ContentScale.Crop)
                                Spacer(Modifier.width(12.dp))
                            }
                            Text(ep.number, color = Subtle, modifier = Modifier.width(28.dp))
                            Text(ep.name, color = Fg)
                        }
                    }
                }
                envelope?.similar.orEmpty().takeIf { it.isNotEmpty() }?.let { similar ->
                    SectionTitle("More like this")
                    Row(Modifier.horizontalScroll(rememberScrollState()).padding(horizontal = 16.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        similar.forEach { item -> Poster(item) { nav.navigate("title/${item.slug}") } }
                    }
                }
                Box(Modifier.padding(16.dp)) {
                    AdCard("Ad · below the episodes, never on them", "A bank that already knows the corridor", "One card. No takeover. Close it and keep watching.")
                }
            }
            failed -> EmptyState("Title unavailable", "Go back and try another.")
            else -> Text("Loading…", color = Muted, modifier = Modifier.padding(24.dp))
        }
    }
}

fun navigatePlayback(nav: NavHostController, url: String) {
    when {
        Playback.isYouTube(url) -> Playback.youTubeId(url)?.let { nav.navigate("watchYt/$it") }
        Playback.isHls(url) -> {
            val token = android.util.Base64.encodeToString(url.toByteArray(), android.util.Base64.URL_SAFE or android.util.Base64.NO_WRAP)
            nav.navigate("watchHls/$token")
        }
    }
}
