package tv.whisco.app

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import okhttp3.OkHttpClient
import okhttp3.Request
import java.net.URLEncoder
import java.util.concurrent.TimeUnit
import kotlin.math.ceil
import kotlin.math.min

object Api {
    private val http = OkHttpClient.Builder()
        .callTimeout(20, TimeUnit.SECONDS)
        .connectTimeout(12, TimeUnit.SECONDS)
        .build()
    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        coerceInputValues = true
    }
    private const val BASE = "https://www.whisco.tv/api/mobile/v1"
    private val memory = LinkedHashMap<String, Pair<Long, String>>()
    private const val MEMORY_CAP = 48

    suspend fun home(): HomeDto = json.decodeFromString(cached("/home", 240_000))

    suspend fun live(lang: String? = null, q: String? = null, page: Int = 1, category: String? = null): LiveDto {
        val params = mutableListOf("page=$page")
        if (lang != null) params += "language=${enc(lang)}"
        if (q != null) params += "q=${enc(q)}"
        if (category != null) params += "category=${enc(category)}"
        return json.decodeFromString(cached("/live?${params.joinToString("&")}", 90_000))
    }

    suspend fun liveAll(language: String): List<ChannelDto> {
        val first = live(language, page = 1)
        val all = first.channels.toMutableList()
        val pageSize = first.pageSize.coerceAtLeast(1)
        val total = when {
            first.filteredCount > 0 -> first.filteredCount
            first.total > 0 -> first.total
            else -> all.size
        }
        val pages = min(ceil(total / pageSize.toDouble()).toInt(), 8)
        if (pages > 1) {
            for (p in 2..pages) all += live(language, page = p).channels
        }
        return all.distinctBy { it.id }
    }

    suspend fun vod(): VodDto = json.decodeFromString(cached("/vod", 240_000))
    suspend fun searchVod(q: String): VodSearchDto =
        json.decodeFromString(cached("/vod?q=${enc(q)}", 30_000))
    suspend fun title(slug: String): TitleEnvelope =
        json.decodeFromString(cached("/title/${enc(slug)}", 240_000))
    suspend fun channel(id: String): ChannelDto {
        val raw = cached("/channel/${enc(id)}", 60_000)
        return runCatching { json.decodeFromString<ChannelWrap>(raw).channel ?: json.decodeFromString(raw) }
            .getOrElse { json.decodeFromString(raw) }
    }

    @kotlinx.serialization.Serializable
    private data class ChannelWrap(val channel: ChannelDto? = null)

    private fun enc(s: String) = URLEncoder.encode(s, "UTF-8")

    private suspend fun cached(path: String, ttlMs: Long): String = withContext(Dispatchers.IO) {
        val key = path
        val hit = synchronized(memory) { memory[key] }
        if (hit != null && System.currentTimeMillis() - hit.first < ttlMs) return@withContext hit.second
        val req = Request.Builder()
            .url("$BASE$path")
            .header("Accept", "application/json")
            .header("User-Agent", "WhiscoTV/1.0 (Android)")
            .build()
        val body = http.newCall(req).execute().use { resp ->
            if (!resp.isSuccessful) error("HTTP ${resp.code}")
            resp.body?.string().orEmpty()
        }
        synchronized(memory) {
            memory[key] = System.currentTimeMillis() to body
            while (memory.size > MEMORY_CAP) memory.remove(memory.keys.first())
        }
        body
    }
}
