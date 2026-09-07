package tv.whisco.app

import android.content.Context
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.util.UUID

private val Context.dataStore by preferencesDataStore("whisco")
private val KEY = stringPreferencesKey("state")
private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }

class LocalStore {
    var ready by mutableStateOf(false)
    var onboarded by mutableStateOf(false)
    var face by mutableStateOf(FaceDto())
    var faces by mutableStateOf(listOf(FaceDto()))
    var country by mutableStateOf("BH")
    var favoriteChannels by mutableStateOf(listOf<ChannelDto>())
    var watchlist by mutableStateOf(listOf<TitleDto>())
    var resume by mutableStateOf(listOf<ResumeDto>())
    var recentSearches by mutableStateOf(listOf<String>())
    var soundEnabled by mutableStateOf(false)

    val favoriteIds: Set<String> get() = favoriteChannels.map { it.id }.toSet()

    suspend fun load(context: Context) {
        val raw = context.dataStore.data.first()[KEY]
        if (raw != null) {
            runCatching {
                val s = json.decodeFromString<Persisted>(raw)
                onboarded = s.onboarded
                face = s.face
                faces = s.faces.ifEmpty { listOf(s.face) }
                country = s.country
                favoriteChannels = s.favoriteChannels.ifEmpty {
                    s.favoriteIds.map { ChannelDto(id = it, name = it) }
                }
                watchlist = s.watchlist
                resume = s.resume
                recentSearches = s.recentSearches
                soundEnabled = s.soundEnabled
            }
        }
        ready = true
    }

    suspend fun persist(context: Context) {
        context.dataStore.edit {
            it[KEY] = json.encodeToString(snapshot())
        }
    }

    fun completeOnboarding(
        name: String,
        languages: List<String>,
        country: String,
        clockSource: String,
        kidsMode: Boolean,
    ) {
        face = FaceDto(
            id = "you",
            name = name.ifBlank { "You" },
            languages = languages.ifEmpty { listOf("Arabic", "English") },
            hue = 18f,
            clockSource = clockSource,
            kidsMode = kidsMode,
        )
        faces = listOf(face)
        this.country = country
        onboarded = true
    }

    fun setActiveFace(id: String) {
        faces.firstOrNull { it.id == id }?.let { face = it }
    }

    fun addFace(name: String, languages: List<String>, kidsMode: Boolean) {
        if (faces.size >= 4) return
        val next = FaceDto(
            id = UUID.randomUUID().toString(),
            name = name,
            languages = languages,
            hue = (10..340).random().toFloat(),
            clockSource = if (languages.contains("Arabic") && languages.contains("English")) "gulf" else "origin",
            kidsMode = kidsMode,
        )
        faces = faces + next
        face = next
    }

    fun updateActive(patch: FaceDto.() -> FaceDto) {
        face = face.patch()
        faces = faces.map { if (it.id == face.id) face else it }
    }

    fun removeFace(id: String) {
        if (faces.size <= 1 || id == "you") return
        faces = faces.filterNot { it.id == id }
        if (face.id == id) face = faces.first()
    }

    fun toggleFavorite(ch: ChannelDto) {
        favoriteChannels = if (favoriteChannels.any { it.id == ch.id }) {
            favoriteChannels.filterNot { it.id == ch.id }
        } else {
            (listOf(ch) + favoriteChannels).take(16)
        }
    }

    fun toggleSaved(t: TitleDto) {
        watchlist = if (watchlist.any { it.id == t.id || it.slug == t.slug }) {
            watchlist.filterNot { it.id == t.id || it.slug == t.slug }
        } else {
            (listOf(t) + watchlist).take(80)
        }
    }

    fun isSaved(id: String, slug: String = id) =
        watchlist.any { it.id == id || it.slug == slug }

    fun upsertResume(entry: ResumeDto) {
        resume = (listOf(entry) + resume.filterNot { it.id == entry.id }).take(24)
    }

    fun pushSearch(q: String) {
        val t = q.trim()
        if (t.length < 2) return
        recentSearches = (listOf(t) + recentSearches.filterNot { it.equals(t, true) }).take(8)
    }

    fun reset() {
        onboarded = false
        face = FaceDto()
        faces = listOf(FaceDto())
        country = "BH"
        favoriteChannels = emptyList()
        watchlist = emptyList()
        resume = emptyList()
        recentSearches = emptyList()
        soundEnabled = false
    }

    private fun snapshot() = Persisted(
        onboarded, face, faces, country,
        favoriteChannels.map { it.id }, favoriteChannels,
        watchlist, resume, recentSearches, soundEnabled,
    )

    @Serializable
    private data class Persisted(
        val onboarded: Boolean = false,
        val face: FaceDto = FaceDto(),
        val faces: List<FaceDto> = emptyList(),
        val country: String = "BH",
        val favoriteIds: List<String> = emptyList(),
        val favoriteChannels: List<ChannelDto> = emptyList(),
        val watchlist: List<TitleDto> = emptyList(),
        val resume: List<ResumeDto> = emptyList(),
        val recentSearches: List<String> = emptyList(),
        val soundEnabled: Boolean = false,
    )
}
