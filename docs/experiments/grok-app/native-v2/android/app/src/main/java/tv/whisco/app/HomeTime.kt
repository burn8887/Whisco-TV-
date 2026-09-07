package tv.whisco.app

import java.util.Calendar
import java.util.TimeZone

object HomeTime {
    private val languageMap = mapOf(
        "Hindi" to ("Asia/Kolkata" to "Mumbai"),
        "Malayalam" to ("Asia/Kolkata" to "Kochi"),
        "Tamil" to ("Asia/Kolkata" to "Chennai"),
        "Telugu" to ("Asia/Kolkata" to "Hyderabad"),
        "Punjabi" to ("Asia/Kolkata" to "Amritsar"),
        "Bengali" to ("Asia/Dhaka" to "Dhaka"),
        "Urdu" to ("Asia/Karachi" to "Karachi"),
        "Arabic" to ("Africa/Cairo" to "Cairo"),
        "Filipino" to ("Asia/Manila" to "Manila"),
        "English" to ("Asia/Dubai" to "Gulf"),
        "Turkish" to ("Europe/Istanbul" to "Istanbul"),
        "Indonesian" to ("Asia/Jakarta" to "Jakarta"),
        "Nepali" to ("Asia/Kathmandu" to "Kathmandu"),
        "Sinhala" to ("Asia/Colombo" to "Colombo"),
    )

    private val countryMap = mapOf(
        "Bahrain" to ("Asia/Bahrain" to "Manama"),
        "BH" to ("Asia/Bahrain" to "Manama"),
        "UAE" to ("Asia/Dubai" to "Dubai"),
        "AE" to ("Asia/Dubai" to "Dubai"),
        "United Arab Emirates" to ("Asia/Dubai" to "Dubai"),
        "Saudi Arabia" to ("Asia/Riyadh" to "Riyadh"),
        "SA" to ("Asia/Riyadh" to "Riyadh"),
        "Kuwait" to ("Asia/Kuwait" to "Kuwait City"),
        "KW" to ("Asia/Kuwait" to "Kuwait City"),
        "Qatar" to ("Asia/Qatar" to "Doha"),
        "QA" to ("Asia/Qatar" to "Doha"),
        "Oman" to ("Asia/Muscat" to "Muscat"),
        "OM" to ("Asia/Muscat" to "Muscat"),
        "Egypt" to ("Africa/Cairo" to "Cairo"),
        "India" to ("Asia/Kolkata" to "Mumbai"),
        "Pakistan" to ("Asia/Karachi" to "Karachi"),
        "Bangladesh" to ("Asia/Dhaka" to "Dhaka"),
        "Philippines" to ("Asia/Manila" to "Manila"),
        "Turkey" to ("Europe/Istanbul" to "Istanbul"),
    )

    fun pair(language: String, country: String, clockSource: String?): Pair<String, String> {
        if (clockSource == "gulf") return countryMap[country] ?: ("Asia/Bahrain" to "Manama")
        return languageMap[language] ?: ("Asia/Dubai" to "Gulf")
    }

    fun format(tzId: String, now: Long = System.currentTimeMillis()): String {
        val cal = Calendar.getInstance(TimeZone.getTimeZone(tzId))
        cal.timeInMillis = now
        val h = cal.get(Calendar.HOUR).let { if (it == 0) 12 else it }
        val min = cal.get(Calendar.MINUTE).toString().padStart(2, '0')
        val am = cal.get(Calendar.AM_PM) == Calendar.AM
        return "$h:$min ${if (am) "AM" else "PM"}"
    }

    fun label(language: String, country: String = "BH", clockSource: String? = null, now: Long = System.currentTimeMillis()): String {
        val (tz, city) = pair(language, country, clockSource)
        return "${format(tz, now)} in $city"
    }

    fun channelLabel(ch: ChannelDto, now: Long = System.currentTimeMillis()): String {
        ch.country?.let { countryMap[it] }?.let { (tz, city) -> return "${format(tz, now)} in $city" }
        ch.language?.let { return label(it, now = now) }
        return ""
    }

    fun greeting(tzId: String, now: Long = System.currentTimeMillis()): String {
        val cal = Calendar.getInstance(TimeZone.getTimeZone(tzId))
        cal.timeInMillis = now
        return when (cal.get(Calendar.HOUR_OF_DAY)) {
            in 0..4 -> "Still up"
            in 5..11 -> "Good morning"
            in 12..16 -> "Good afternoon"
            in 17..21 -> "Good evening"
            else -> "Late night"
        }
    }

    fun countryName(code: String) = Pack.countries.firstOrNull { it.first == code }?.second ?: code
    fun countryCity(code: String) = countryMap[code]?.second ?: "Gulf"
}
