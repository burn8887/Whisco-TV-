package tv.whisco.app

import android.app.Application
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.lifecycleScope
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import coil.compose.AsyncImage
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import okhttp3.OkHttpClient
import okhttp3.Request
import java.util.concurrent.TimeUnit

class WhiscoApp : Application()

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { WhiscoTheme { AppRoot() } }
    }
}

val Bg = Color(0xFF0A0A0F)
val Surface = Color(0xFF12121A)
val Fg = Color(0xFFF4F0EA)
val Muted = Color(0xFF9A948C)
val Accent = Color(0xFFF97316)

@Composable
fun WhiscoTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            background = Bg,
            surface = Surface,
            onBackground = Fg,
            onSurface = Fg,
            primary = Accent,
        ),
        content = content,
    )
}

@Composable
fun AppRoot() {
    val nav = rememberNavController()
    Scaffold(
        containerColor = Bg,
        bottomBar = {
            NavigationBar(containerColor = Surface) {
                listOf("tonight" to "Tonight", "live" to "Live", "library" to "Library", "you" to "You").forEach { (route, label) ->
                    NavigationBarItem(
                        selected = false,
                        onClick = { nav.navigate(route) },
                        label = { Text(label) },
                        icon = { Text("·") },
                    )
                }
            }
        },
    ) { pad ->
        NavHost(nav, startDestination = "tonight", modifier = Modifier.padding(pad)) {
            composable("tonight") { HomeScreen(nav) }
            composable("live") { LiveScreen(nav) }
            composable("library") { LibraryScreen(nav) }
            composable("you") { YouScreen() }
            composable("title/{slug}") { back ->
                TitleScreen(back.arguments?.getString("slug").orEmpty(), nav)
            }
            composable("watchLive/{id}") { back ->
                WatchLiveScreen(back.arguments?.getString("id").orEmpty())
            }
            composable("watchYt/{id}") { back ->
                WatchYouTubeScreen(back.arguments?.getString("id").orEmpty())
            }
        }
    }
}

object Api {
    private val http = OkHttpClient.Builder().callTimeout(20, TimeUnit.SECONDS).build()
    private val json = Json { ignoreUnknownKeys = true }
    private const val BASE = "https://www.whisco.tv/api/mobile/v1"

    suspend fun get(path: String): String = withContext(Dispatchers.IO) {
        val req = Request.Builder().url("$BASE$path").build()
        http.newCall(req).execute().use { it.body?.string().orEmpty() }
    }

    suspend fun home(): HomeDto = json.decodeFromString(get("/home"))
    suspend fun live(lang: String? = null): LiveDto {
        val q = if (lang != null) "?language=$lang" else ""
        return json.decodeFromString(get("/live$q"))
    }
    suspend fun vod(): VodDto = json.decodeFromString(get("/vod"))
    suspend fun title(slug: String): TitleEnvelope = json.decodeFromString(get("/title/$slug"))
    suspend fun channel(id: String): ChannelDto = json.decodeFromString(get("/channel/$id"))
}

@Serializable data class HomeDto(val stats: StatsDto? = null, val hero: List<TitleDto> = emptyList(), val rows: List<RowDto> = emptyList())
@Serializable data class StatsDto(val channels: Int = 0, val titles: Int = 0)
@Serializable data class RowDto(val key: String = "", val label: String = "", val items: List<TitleDto> = emptyList())
@Serializable data class TitleDto(val id: String = "", val slug: String = "", val name: String = "", val posterUrl: String? = null, val backdropUrl: String? = null, val type: String = "", val collection: String? = null)
@Serializable data class LiveDto(val channels: List<ChannelDto> = emptyList(), val total: Int = 0)
@Serializable data class ChannelDto(val id: String = "", val name: String = "", val logoUrl: String? = null, val streamUrl: String? = null, val language: String? = null, val country: String? = null)
@Serializable data class VodDto(val shelves: List<ShelfDto> = emptyList(), val total: Int = 0)
@Serializable data class ShelfDto(val name: String = "", val items: List<TitleDto> = emptyList())
@Serializable data class TitleEnvelope(val title: TitleDetailDto? = null)
@Serializable data class TitleDetailDto(
    val name: String = "",
    val synopsis: String? = null,
    val posterUrl: String? = null,
    val backdropUrl: String? = null,
    val seasons: List<SeasonDto> = emptyList(),
)
@Serializable data class SeasonDto(val number: Int = 1, val episodes: List<EpisodeDto> = emptyList())
@Serializable data class EpisodeDto(val id: String = "", val number: String = "1", val name: String = "", val streamUrl: String? = null)

@Composable
fun HomeScreen(nav: NavHostController) {
    var home by remember { mutableStateOf<HomeDto?>(null) }
    var live by remember { mutableStateOf<List<ChannelDto>>(emptyList()) }
    LaunchedEffect(Unit) {
        runCatching { home = Api.home() }
        runCatching { live = Api.live("Hindi").channels }
    }
    Column(Modifier.fillMaxSize().background(Bg).verticalScroll(rememberScrollState()).padding(16.dp)) {
        Text("Tonight", style = MaterialTheme.typography.headlineLarge, color = Fg)
        Text("Home Time lives on every live tile.", color = Muted)
        Spacer(Modifier.height(16.dp))
        home?.hero?.firstOrNull()?.let { hero ->
            AsyncImage(hero.backdropUrl ?: hero.posterUrl, null, Modifier.fillMaxWidth().height(180.dp).clip(RoundedCornerShape(20.dp)), contentScale = ContentScale.Crop)
            Text(hero.name, color = Fg, style = MaterialTheme.typography.titleLarge)
        }
        Spacer(Modifier.height(16.dp))
        Text("Live", color = Fg, style = MaterialTheme.typography.titleMedium)
        Row(Modifier.horizontalScroll(rememberScrollState())) {
            live.take(8).forEach { ch ->
                Surface(Modifier.padding(end = 8.dp).clickable { nav.navigate("watchLive/${ch.id}") }, color = Surface, shape = RoundedCornerShape(16.dp)) {
                    Column(Modifier.padding(12.dp).width(180.dp)) {
                        Text(ch.name, color = Fg, maxLines = 1)
                        Text(ch.language ?: "", color = Muted)
                    }
                }
            }
        }
    }
}

@Composable
fun LiveScreen(nav: NavHostController) {
    var lang by remember { mutableStateOf("Arabic") }
    var channels by remember { mutableStateOf<List<ChannelDto>>(emptyList()) }
    LaunchedEffect(lang) { runCatching { channels = Api.live(lang).channels } }
    Column(Modifier.fillMaxSize().background(Bg).padding(16.dp)) {
        Text("Live", style = MaterialTheme.typography.headlineLarge, color = Fg)
        Row(Modifier.horizontalScroll(rememberScrollState())) {
            listOf("Hindi", "Malayalam", "Arabic", "Urdu", "Bengali", "Filipino", "Turkish").forEach { l ->
                FilterChip(selected = lang == l, onClick = { lang = l }, label = { Text(l) })
                Spacer(Modifier.width(6.dp))
            }
        }
        LazyColumn {
            items(channels, key = { it.id }) { ch ->
                ListItem(
                    headlineContent = { Text(ch.name) },
                    supportingContent = { Text(listOfNotNull(ch.language, ch.country).joinToString(" · ")) },
                    modifier = Modifier.clickable { nav.navigate("watchLive/${ch.id}") },
                    colors = ListItemDefaults.colors(containerColor = Bg),
                )
            }
        }
    }
}

@Composable
fun LibraryScreen(nav: NavHostController) {
    var vod by remember { mutableStateOf<VodDto?>(null) }
    LaunchedEffect(Unit) { runCatching { vod = Api.vod() } }
    LazyColumn(Modifier.fillMaxSize().background(Bg).padding(16.dp)) {
        item { Text("Library", style = MaterialTheme.typography.headlineLarge, color = Fg) }
        vod?.shelves?.forEach { shelf ->
            item { Text(shelf.name, color = Fg, style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(top = 16.dp)) }
            item {
                Row(Modifier.horizontalScroll(rememberScrollState())) {
                    shelf.items.forEach { t ->
                        Column(Modifier.padding(end = 8.dp).width(110.dp).clickable { nav.navigate("title/${t.slug}") }) {
                            AsyncImage(t.posterUrl, t.name, Modifier.height(160.dp).clip(RoundedCornerShape(12.dp)), contentScale = ContentScale.Crop)
                            Text(t.name, color = Fg, maxLines = 2)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun YouScreen() {
    Column(Modifier.fillMaxSize().background(Bg).padding(16.dp)) {
        Text("You", style = MaterialTheme.typography.headlineLarge, color = Fg)
        Text("Faces live in DataStore on this device. No account. Data Not Collected.", color = Muted)
        Spacer(Modifier.height(12.dp))
        Text("Android TV: the same Compose graph with d-pad focus. Media3 handles HDMI/Leanback without a second app if mosaic items are focusable.")
    }
}

@Composable
fun TitleScreen(slug: String, nav: NavHostController) {
    var detail by remember { mutableStateOf<TitleDetailDto?>(null) }
    LaunchedEffect(slug) { runCatching { detail = Api.title(slug).title } }
    Column(Modifier.fillMaxSize().background(Bg).verticalScroll(rememberScrollState())) {
        val t = detail ?: return
        AsyncImage(t.backdropUrl ?: t.posterUrl, t.name, Modifier.fillMaxWidth().height(200.dp), contentScale = ContentScale.Crop)
        Text(t.name, color = Fg, style = MaterialTheme.typography.headlineMedium, modifier = Modifier.padding(16.dp))
        Text(t.synopsis.orEmpty(), color = Muted, modifier = Modifier.padding(horizontal = 16.dp))
        t.seasons.forEach { season ->
            Text("Season ${season.number}", color = Fg, modifier = Modifier.padding(16.dp))
            season.episodes.forEach { ep ->
                Text(ep.name, color = Fg, modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp).clickable {
                    val id = ep.streamUrl?.substringAfter("/embed/")?.take(11)
                    if (id != null) nav.navigate("watchYt/$id")
                })
            }
        }
    }
}

@Composable
fun WatchLiveScreen(id: String) {
    val ctx = LocalContext.current
    var url by remember { mutableStateOf<String?>(null) }
    LaunchedEffect(id) { runCatching { url = Api.channel(id).streamUrl } }
    val player = remember {
        ExoPlayer.Builder(ctx).build()
    }
    DisposableEffect(url) {
        url?.let {
            player.setMediaItem(MediaItem.fromUri(it))
            player.prepare()
            player.playWhenReady = true
        }
        onDispose { player.release() }
    }
    Column(Modifier.fillMaxSize().background(Color.Black)) {
        AndroidView(factory = { PlayerView(it).apply { this.player = player } }, modifier = Modifier.fillMaxWidth().aspectRatio(16f / 9f))
        Text("No ads on the picture. Media3 plays HLS natively — CORS is a browser problem.", color = Muted, modifier = Modifier.padding(16.dp))
    }
}

@Composable
fun WatchYouTubeScreen(videoId: String) {
    Column(Modifier.fillMaxSize().background(Color.Black)) {
        AndroidView(
            factory = { c ->
                WebView(c).apply {
                    settings.javaScriptEnabled = true
                    webChromeClient = WebChromeClient()
                    webViewClient = WebViewClient()
                    loadUrl("https://www.youtube-nocookie.com/embed/$videoId?playsinline=1&rel=0")
                }
            },
            modifier = Modifier.fillMaxWidth().aspectRatio(16f / 9f),
        )
        Text("Official YouTube embed. We do not extract streams.", color = Muted, modifier = Modifier.padding(16.dp))
    }
}
