package tv.whisco.app

import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import kotlinx.serialization.json.JsonDecoder
import kotlinx.serialization.json.JsonPrimitive

@Serializable
data class HomeDto(
    val stats: StatsDto? = null,
    val hero: List<TitleDto> = emptyList(),
    val rows: List<RowDto> = emptyList(),
    val featuredChannels: List<ChannelDto> = emptyList(),
)

@Serializable
data class StatsDto(val channels: Int = 0, val titles: Int = 0)

@Serializable
data class RowDto(val key: String = "", val label: String = "", val items: List<TitleDto> = emptyList())

@Serializable
data class TitleDto(
    val id: String = "",
    val slug: String = "",
    val name: String = "",
    val posterUrl: String? = null,
    val backdropUrl: String? = null,
    val type: String = "SERIES",
    val collection: String? = null,
    val language: String? = null,
    val releaseYear: Int? = null,
    val imdbRating: Double? = null,
)

@Serializable
data class LiveDto(
    val channels: List<ChannelDto> = emptyList(),
    val total: Int = 0,
    val filteredCount: Int = 0,
    val page: Int = 1,
    val pageSize: Int = 60,
)

@Serializable
data class ChannelDto(
    val id: String = "",
    val name: String = "",
    val logoUrl: String? = null,
    val streamUrl: String? = null,
    val language: String? = null,
    val country: String? = null,
    val category: String? = null,
    val isHD: Boolean? = null,
)

@Serializable
data class VodDto(val shelves: List<ShelfDto> = emptyList(), val total: Int = 0)

@Serializable
data class ShelfDto(val name: String = "", val count: Int? = null, val items: List<TitleDto> = emptyList())

@Serializable
data class TitleEnvelope(val title: TitleDetailDto? = null, val similar: List<TitleDto> = emptyList())

@Serializable
data class TitleDetailDto(
    val id: String = "",
    val slug: String = "",
    val name: String = "",
    val synopsis: String? = null,
    val posterUrl: String? = null,
    val backdropUrl: String? = null,
    val language: String? = null,
    val collection: String? = null,
    val releaseYear: Int? = null,
    val type: String? = null,
    val streamUrl: String? = null,
    val seasons: List<SeasonDto> = emptyList(),
)

@Serializable
data class SeasonDto(val number: Int = 1, val episodes: List<EpisodeDto> = emptyList())

@Serializable
data class EpisodeDto(
    val id: String = "",
    @Serializable(with = FlexibleStringSerializer::class)
    val number: String = "1",
    val name: String = "",
    val streamUrl: String? = null,
    val stillUrl: String? = null,
)

@Serializable
data class VodSearchDto(val items: List<TitleDto> = emptyList(), val filteredCount: Int = 0)

@Serializable
data class FaceDto(
    val id: String = "you",
    val name: String = "You",
    val languages: List<String> = listOf("Arabic", "English"),
    val hue: Float = 18f,
    val clockSource: String = "gulf",
    val kidsMode: Boolean = false,
)

@Serializable
data class ResumeDto(
    val id: String,
    val kind: String,
    val slug: String? = null,
    val name: String,
    val posterUrl: String? = null,
    val language: String? = null,
    val updatedAt: Long = 0L,
)

object FlexibleStringSerializer : KSerializer<String> {
    override val descriptor = PrimitiveSerialDescriptor("FlexibleString", PrimitiveKind.STRING)
    override fun deserialize(decoder: Decoder): String {
        val json = decoder as? JsonDecoder ?: return decoder.decodeString()
        val el = json.decodeJsonElement()
        return if (el is JsonPrimitive) el.content else "1"
    }
    override fun serialize(encoder: Encoder, value: String) = encoder.encodeString(value)
}

object Pack {
    val languages = listOf(
        "Arabic", "English", "Hindi", "Malayalam", "Tamil", "Telugu", "Punjabi",
        "Bengali", "Urdu", "Filipino", "Turkish", "Indonesian", "Nepali", "Sinhala",
    )
    val categories = listOf("All", "News", "Sports", "Entertainment", "Kids", "Music", "Movies", "Lifestyle")
    val countries = listOf(
        "BH" to "Bahrain",
        "AE" to "United Arab Emirates",
        "SA" to "Saudi Arabia",
        "KW" to "Kuwait",
        "QA" to "Qatar",
        "OM" to "Oman",
    )
    val collectionLanguage = mapOf(
        "Turkish Dizi" to "Turkish",
        "Hindi Cinema" to "Hindi",
        "Hindi Serials & Shows" to "Hindi",
        "Pakistani Dramas" to "Urdu",
        "Malayalam Cinema" to "Malayalam",
        "Bangla Natok & Cinema" to "Bengali",
        "Tamil Cinema & Serials" to "Tamil",
        "Telugu Cinema" to "Telugu",
        "Filipino Shows" to "Filipino",
        "Arabic Series & Shows" to "Arabic",
        "Indonesian Shows" to "Indonesian",
        "Nepali Cinema" to "Nepali",
        "Punjabi Cinema" to "Punjabi",
        "Sinhala Teledramas" to "Sinhala",
        "Free Movies & TV" to "English",
        "Game Shows" to "English",
        "Cartoons & Kids" to "English",
    )

    fun isKidsShelf(name: String) =
        name.contains("Kid", true) || name.contains("Cartoon", true)

    fun sponsor(languages: List<String>, clockSource: String?): Pair<String, String> {
        if (clockSource == "gulf") return "Gulf Air" to "Tonight in the Gulf, presented by Gulf Air"
        val map = mapOf(
            "Malayalam" to ("Air India Express" to "Tonight’s Malayalam, presented by Air India Express"),
            "Hindi" to ("Al Ansari Exchange" to "Hindi cinema this week, presented by Al Ansari Exchange"),
            "Urdu" to ("HBL" to "Urdu dramas, presented by HBL"),
            "Bengali" to ("Biman Bangladesh" to "Bangla natok, presented by Biman Bangladesh Airlines"),
            "Arabic" to ("stc" to "Arabic series this week, presented by stc"),
            "Filipino" to ("Cebu Pacific" to "Filipino tonight, presented by Cebu Pacific"),
            "Turkish" to ("Pegasus" to "Turkish dizi, presented by Pegasus Airlines"),
        )
        for (lang in languages) map[lang]?.let { return it }
        return "stc" to "Arabic series this week, presented by stc"
    }
}

object Playback {
    fun youTubeId(url: String?): String? {
        if (url.isNullOrBlank()) return null
        val patterns = listOf(
            Regex("youtube\\.com/embed/([A-Za-z0-9_-]{11})"),
            Regex("youtu\\.be/([A-Za-z0-9_-]{11})"),
            Regex("[?&]v=([A-Za-z0-9_-]{11})"),
            Regex("i\\.ytimg\\.com/vi/([A-Za-z0-9_-]{11})/"),
        )
        for (p in patterns) p.find(url)?.groupValues?.getOrNull(1)?.let { return it }
        return if (url.length == 11) url else null
    }

    fun isYouTube(url: String?) =
        url?.let { it.contains("youtube") || it.contains("youtu.be") || it.contains("ytimg") } == true

    fun isHls(url: String?) = url?.contains(".m3u8") == true
}
