package tv.whisco.app

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay

val Bg = Color(0xFF0A0A0F)
val SurfaceCol = Color(0xFF12121A)
val Elevated = Color(0xFF1A1A24)
val Fg = Color(0xFFF4F0EA)
val Muted = Color(0xFF9A948C)
val Subtle = Color(0xFF6B665F)
val Accent = Color(0xFFF97316)
val Accent2 = Color(0xFFDB2777)
val LivePink = Color(0xFFFB7185)

val LocalTick = compositionLocalOf { System.currentTimeMillis() }

@Composable
fun WhiscoTheme(content: @Composable () -> Unit) {
    var now by remember { mutableLongStateOf(System.currentTimeMillis()) }
    LaunchedEffect(Unit) {
        while (true) {
            delay(15_000)
            now = System.currentTimeMillis()
        }
    }
    CompositionLocalProvider(LocalTick provides now) {
        MaterialTheme(
            colorScheme = darkColorScheme(
                background = Bg,
                surface = SurfaceCol,
                onBackground = Fg,
                onSurface = Fg,
                primary = Accent,
                secondary = Accent2,
            ),
            content = content,
        )
    }
}

@Composable
fun PrimaryButton(label: String, enabled: Boolean = true, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier.fillMaxWidth().height(48.dp),
        shape = RoundedCornerShape(14.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Fg,
            contentColor = Bg,
            disabledContainerColor = Fg.copy(alpha = 0.3f),
            disabledContentColor = Bg.copy(alpha = 0.5f),
        ),
        contentPadding = PaddingValues(horizontal = 16.dp),
    ) { Text(label) }
}

@Composable
fun GhostButton(label: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    TextButton(onClick = onClick, modifier = modifier.fillMaxWidth().height(48.dp)) {
        Text(label, color = Fg)
    }
}
