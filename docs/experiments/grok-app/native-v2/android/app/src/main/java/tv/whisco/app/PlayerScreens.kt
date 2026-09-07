package tv.whisco.app

import android.util.Base64
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.annotation.OptIn
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import androidx.navigation.NavHostController
import kotlinx.coroutines.launch

@Composable
fun WatchLiveScreen(id: String, store: LocalStore, nav: NavHostController) {
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    var channel by remember { mutableStateOf<ChannelDto?>(null) }
    var related by remember { mutableStateOf<List<ChannelDto>>(emptyList()) }
    LaunchedEffect(id) {
        runCatching { channel = Api.channel(id) }
        val lang = channel?.language
        if (lang != null) runCatching { related = Api.liveAll(lang) }
        channel?.let {
            store.upsertResume(ResumeDto(it.id, "live", null, it.name, it.logoUrl, it.language, System.currentTimeMillis()))
            scope.launch { store.persist(ctx) }
        }
    }
    val idx = related.indexOfFirst { it.id == id }.let { if (it < 0) 0 else it }
    val size = related.size.coerceAtLeast(1)
    val prev = related.getOrNull((idx - 1 + size) % size)
    val next = related.getOrNull((idx + 1) % size)

    Column(Modifier.fillMaxSize().background(Color.Black)) {
        HlsPlayer(url = channel?.streamUrl)
        Column(Modifier.fillMaxSize().background(Bg).verticalScroll(rememberScrollState())) {
            TextButton(onClick = { nav.popBackStack() }) { Text("Back", color = Muted) }
            Row(Modifier.fillMaxWidth().padding(horizontal = 16.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                Column(Modifier.weight(1f)) {
                    Text("LIVE", color = Bg, modifier = Modifier.background(LivePink).padding(horizontal = 8.dp, vertical = 2.dp), style = MaterialTheme.typography.labelSmall)
                    Text(channel?.name.orEmpty(), color = Fg, style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(top = 6.dp))
                    Text(
                        listOfNotNull(channel?.language, channel?.country, channel?.category, if (channel?.isHD == true) "HD" else null).joinToString(" · "),
                        color = Muted,
                        style = MaterialTheme.typography.bodySmall,
                    )
                    Text(channel?.let { HomeTime.channelLabel(it) }.orEmpty(), color = Subtle, style = MaterialTheme.typography.labelSmall)
                }
                val ch = channel
                if (ch != null) {
                    TextButton(onClick = {
                        store.toggleFavorite(ch)
                        scope.launch { store.persist(ctx) }
                    }) {
                        Text(if (ch.id in store.favoriteIds) "Pinned" else "Pin", color = Accent)
                    }
                }
            }
            Text(
                "No ads on the picture. Media3 plays HLS natively — CORS is a browser problem. Pin lives on this device.",
                color = Muted,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(horizontal = 16.dp),
            )
            Row(Modifier.fillMaxWidth().padding(8.dp)) {
                TextButton(
                    onClick = { prev?.let { zap(nav, it.id) } },
                    modifier = Modifier.weight(1f),
                    enabled = prev != null && prev.id != id,
                ) {
                    Column {
                        Text("Ch −", color = Subtle, style = MaterialTheme.typography.labelSmall)
                        Text(prev?.name.orEmpty(), color = Fg, maxLines = 1)
                    }
                }
                TextButton(
                    onClick = { next?.let { zap(nav, it.id) } },
                    modifier = Modifier.weight(1f),
                    enabled = next != null && next.id != id,
                ) {
                    Column {
                        Text("Ch +", color = Subtle, style = MaterialTheme.typography.labelSmall)
                        Text(next?.name.orEmpty(), color = Fg, maxLines = 1)
                    }
                }
            }
            if (related.size > 1) {
                Text("More ${channel?.language.orEmpty()}", color = Fg, style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(16.dp))
                related.filter { it.id != id }.take(10).forEach { c ->
                    ChannelRow(c) { zap(nav, c.id) }
                }
            }
        }
    }
}

private fun zap(nav: NavHostController, id: String) {
    nav.navigate("watchLive/$id") {
        popUpTo("watchLive/{id}") { inclusive = true }
        launchSingleTop = true
    }
}

@OptIn(UnstableApi::class)
@Composable
fun HlsPlayer(url: String?) {
    val ctx = LocalContext.current
    val player = remember {
        ExoPlayer.Builder(ctx).build().apply {
            setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(C.USAGE_MEDIA)
                    .setContentType(C.AUDIO_CONTENT_TYPE_MOVIE)
                    .build(),
                true,
            )
        }
    }
    DisposableEffect(Unit) {
        onDispose { player.release() }
    }
    LaunchedEffect(url) {
        if (!url.isNullOrBlank() && Playback.isHls(url)) {
            player.setMediaItem(MediaItem.fromUri(url))
            player.prepare()
            player.playWhenReady = true
        }
    }
    AndroidView(
        factory = {
            PlayerView(it).apply {
                this.player = player
                useController = true
                keepScreenOn = true
                layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
            }
        },
        modifier = Modifier.fillMaxWidth().aspectRatio(16f / 9f),
    )
}

@Composable
fun WatchHlsScreen(b64: String) {
    val url = runCatching { String(Base64.decode(b64, Base64.URL_SAFE or Base64.NO_WRAP)) }.getOrDefault("")
    Column(Modifier.fillMaxSize().background(Color.Black)) {
        HlsPlayer(url)
        Text("Licensed or FTA HLS. No ads on the picture.", color = Muted, modifier = Modifier.padding(16.dp).background(Bg).fillMaxWidth())
    }
}

@Composable
fun WatchYouTubeScreen(videoId: String) {
    Column(Modifier.fillMaxSize().background(Color.Black)) {
        AndroidView(
            factory = { c ->
                WebView(c).apply {
                    settings.javaScriptEnabled = true
                    settings.domStorageEnabled = true
                    settings.mediaPlaybackRequiresUserGesture = false
                    webChromeClient = WebChromeClient()
                    webViewClient = WebViewClient()
                    loadUrl("https://www.youtube-nocookie.com/embed/$videoId?playsinline=1&rel=0&modestbranding=1")
                }
            },
            modifier = Modifier.fillMaxWidth().aspectRatio(16f / 9f),
        )
        Text(
            "Official YouTube embed. We do not extract streams. The broadcaster keeps the video ads.",
            color = Muted,
            modifier = Modifier.padding(16.dp).background(Bg).fillMaxWidth(),
        )
    }
}
