package app.salim

import java.util.Locale
import java.util.concurrent.ConcurrentHashMap

/**
 * Arabic interface. English is the source language; when the phone (or the per-app language
 * setting) is Arabic, every string shown through [Text] is looked up in the generated
 * AR_EXACT table, then matched against AR_PATTERNS for strings that carry numbers.
 * Anything not in the table (road names, user drafts) is shown as is.
 *
 * Source of truth: salim-workspace/i18n/ar.json → tools/gen_arabic.py → ArabicStrings.kt.
 */
object Ar {
    @Volatile var forced: Boolean? = null
    val enabled: Boolean get() = forced ?: (Locale.getDefault().language == "ar")
    private val lower by lazy { AR_EXACT.entries.associate { it.key.lowercase() to it.value } }
    private val patterns by lazy { AR_PATTERNS.map { (p, t) -> Regex(p) to t } }
    private val slot = Regex("\\{(t?)(\\d)\\}")
    private val cache = ConcurrentHashMap<String, String>()

    fun t(s: String): String {
        if (!enabled || s.isBlank()) return s
        cache[s]?.let { return it }
        if (cache.size > 2_000) cache.clear()
        return translate(s).also { cache[s] = it }
    }

    private fun translate(s: String): String {
        AR_EXACT[s]?.let { return it }
        lower[s.lowercase()]?.let { return it }
        for ((re, template) in patterns) {
            val m = re.matchEntire(s) ?: continue
            return slot.replace(template) { r ->
                val group = m.groupValues.getOrNull(r.groupValues[2].toInt()).orEmpty()
                if (r.groupValues[1] == "t") translate(group) else group
            }
        }
        return s
    }

    /** True when the text contains Arabic letters (used to pick the Arabic font and drop tracking). */
    fun hasArabic(s: String) = s.any { it in '\u0600'..'\u06FF' || it in '\u0750'..'\u077F' }
}
