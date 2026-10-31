package app.salim

import androidx.compose.material3.LocalTextStyle
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.TextUnit

/** IBM Plex Sans Arabic (SIL OFL 1.1, licence in docs/brand). Used for any text that contains Arabic. */
val ArabicFont = FontFamily(
    Font(R.font.ibm_plex_sans_arabic_regular, FontWeight.Normal),
    Font(R.font.ibm_plex_sans_arabic_bold, FontWeight.Bold)
)

/**
 * The app's Text. Same-package declarations take priority over the `material3.*` star import,
 * so every `Text("…")` in app.salim comes here: the string is translated by [Ar], Arabic text
 * gets the Arabic typeface, and letter-spacing is dropped for Arabic because tracking breaks
 * the joins between Arabic letters. Numbers-only readouts keep their monospaced font.
 */
@Composable
fun Text(
    text: String,
    modifier: Modifier = Modifier,
    color: Color = Color.Unspecified,
    fontSize: TextUnit = TextUnit.Unspecified,
    fontWeight: FontWeight? = null,
    fontFamily: FontFamily? = null,
    letterSpacing: TextUnit = TextUnit.Unspecified,
    textAlign: TextAlign? = null,
    lineHeight: TextUnit = TextUnit.Unspecified,
    overflow: TextOverflow = TextOverflow.Clip,
    maxLines: Int = Int.MAX_VALUE,
    style: TextStyle = LocalTextStyle.current
) {
    val shown = Ar.t(text)
    val arabic = Ar.hasArabic(shown)
    androidx.compose.material3.Text(
        text = shown,
        modifier = modifier,
        color = color,
        fontSize = fontSize,
        fontWeight = fontWeight,
        fontFamily = if (arabic) ArabicFont else fontFamily,
        letterSpacing = if (arabic) TextUnit.Unspecified else letterSpacing,
        textAlign = textAlign,
        lineHeight = lineHeight,
        overflow = overflow,
        maxLines = maxLines,
        style = style
    )
}
