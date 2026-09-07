package tv.whisco.app

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage

@Composable
fun ChipRow(items: List<String>, selected: String, onPick: (String) -> Unit) {
    Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        items.forEach { item ->
            FilterChip(
                selected = item == selected,
                onClick = { onPick(item) },
                label = { Text(item) },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = Accent.copy(alpha = 0.18f),
                    selectedLabelColor = Fg,
                    labelColor = Muted,
                    containerColor = SurfaceCol,
                ),
            )
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun FlowChips(items: List<String>, selected: Set<String>, onToggle: (String) -> Unit) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        items.forEach { item ->
            val on = item in selected
            FilterChip(
                selected = on,
                onClick = { onToggle(item) },
                label = { Text(item) },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = Accent.copy(alpha = 0.18f),
                    selectedLabelColor = Fg,
                    labelColor = Muted,
                    containerColor = SurfaceCol,
                ),
            )
        }
    }
}

@Composable
fun MosaicCell(ch: ChannelDto, modifier: Modifier = Modifier, onClick: () -> Unit) {
    val tick = LocalTick.current
    Column(
        modifier
            .clickable(onClick = onClick)
            .semantics { contentDescription = "${ch.name}, live" },
    ) {
        Box {
            AsyncImage(
                model = ch.logoUrl,
                contentDescription = ch.name,
                modifier = Modifier.fillMaxWidth().aspectRatio(1f).clip(RoundedCornerShape(14.dp)),
                contentScale = ContentScale.Crop,
            )
            Box(
                Modifier
                    .align(Alignment.TopEnd)
                    .padding(6.dp)
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(LivePink),
            )
        }
        Spacer(Modifier.height(6.dp))
        Text(ch.name, color = Fg, maxLines = 2, style = MaterialTheme.typography.bodySmall)
        Text(HomeTime.channelLabel(ch, tick), color = Subtle, maxLines = 1, style = MaterialTheme.typography.labelSmall)
    }
}

@Composable
fun MosaicGrid(channels: List<ChannelDto>, onClick: (ChannelDto) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        channels.chunked(3).forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                row.forEach { ch ->
                    Box(Modifier.weight(1f)) { MosaicCell(ch) { onClick(ch) } }
                }
                repeat(3 - row.size) { Spacer(Modifier.weight(1f)) }
            }
        }
    }
}

@Composable
fun Poster(title: TitleDto, onClick: () -> Unit) {
    Column(Modifier.width(168.dp).clickable(onClick = onClick)) {
        Box {
            AsyncImage(
                model = title.posterUrl,
                contentDescription = title.name,
                modifier = Modifier.fillMaxWidth().height(94.dp).clip(RoundedCornerShape(12.dp)),
                contentScale = ContentScale.Crop,
            )
            Box(
                Modifier.matchParentSize().background(
                    Brush.verticalGradient(listOf(Color.Transparent, Bg.copy(alpha = 0.9f))),
                ),
            )
            Text(
                title.name,
                color = Fg,
                maxLines = 2,
                modifier = Modifier.align(Alignment.BottomStart).padding(8.dp),
                style = MaterialTheme.typography.bodySmall,
            )
        }
    }
}

@Composable
fun ChannelRow(ch: ChannelDto, onClick: () -> Unit) {
    val tick = LocalTick.current
    Row(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceCol)
            .clickable(onClick = onClick)
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box {
            AsyncImage(
                model = ch.logoUrl,
                contentDescription = null,
                modifier = Modifier.size(44.dp).clip(RoundedCornerShape(10.dp)),
                contentScale = ContentScale.Crop,
            )
            Box(Modifier.align(Alignment.TopEnd).size(8.dp).clip(CircleShape).background(LivePink))
        }
        Spacer(Modifier.width(10.dp))
        Column(Modifier.weight(1f)) {
            Text(ch.name, color = Fg, maxLines = 1, style = MaterialTheme.typography.bodyMedium)
            Text(
                listOfNotNull(ch.language, ch.country, ch.category).joinToString(" · "),
                color = Muted,
                maxLines = 1,
                style = MaterialTheme.typography.labelSmall,
            )
            Text(HomeTime.channelLabel(ch, tick), color = Subtle, style = MaterialTheme.typography.labelSmall)
        }
    }
}

@Composable
fun AdCard(kicker: String, title: String, body: String) {
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceCol)
            .padding(16.dp)
            .semantics { contentDescription = "Advertisement. $title" },
    ) {
        Text(kicker.uppercase(), color = Subtle, style = MaterialTheme.typography.labelSmall)
        Spacer(Modifier.height(6.dp))
        Text(title, color = Fg, style = MaterialTheme.typography.titleMedium)
        Text(body, color = Muted, style = MaterialTheme.typography.bodySmall)
        Spacer(Modifier.height(8.dp))
        Box(Modifier.width(88.dp).height(4.dp).clip(RoundedCornerShape(99.dp)).background(Accent))
    }
}

@Composable
fun SponsorStrip(brand: String, line: String) {
    Row(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(16.dp)).background(SurfaceCol).padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text("PRESENTED BY ${brand.uppercase()}", color = Subtle, style = MaterialTheme.typography.labelSmall)
            Text(line, color = Fg, style = MaterialTheme.typography.bodyMedium)
        }
        Text(
            "Sponsor",
            color = Muted,
            style = MaterialTheme.typography.labelSmall,
            modifier = Modifier
                .border(1.dp, Muted.copy(alpha = 0.3f), RoundedCornerShape(99.dp))
                .padding(horizontal = 8.dp, vertical = 4.dp),
        )
    }
}

@Composable
fun EmptyState(title: String, detail: String) {
    Column(Modifier.fillMaxWidth().padding(vertical = 32.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        androidx.compose.foundation.Image(
            painter = painterResource(R.drawable.whisco_sit),
            contentDescription = null,
            modifier = Modifier.size(88.dp),
        )
        Spacer(Modifier.height(12.dp))
        Text(title, color = Fg, style = MaterialTheme.typography.titleMedium)
        Text(detail, color = Muted, style = MaterialTheme.typography.bodySmall)
    }
}

@Composable
fun SectionTitle(text: String) {
    Text(text, color = Fg, style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(top = 8.dp, bottom = 8.dp))
}
