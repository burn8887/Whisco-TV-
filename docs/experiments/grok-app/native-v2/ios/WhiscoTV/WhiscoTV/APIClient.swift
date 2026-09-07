import Foundation

actor APIClient {
    static let shared = APIClient()
    private let root = "https://www.whisco.tv/api/mobile/v1"
    private let decoder: JSONDecoder = {
        let d = JSONDecoder()
        d.keyDecodingStrategy = .useDefaultKeys
        return d
    }()
    private var memory: [String: (at: Date, data: Data)] = [:]
    private let ttl: TimeInterval = 240

    func home() async throws -> HomePayload { try await get("/home", ttl: ttl) }

    func live(language: String? = nil, q: String? = nil, page: Int = 1, category: String? = nil) async throws -> LivePayload {
        var items: [URLQueryItem] = [.init(name: "page", value: String(page))]
        if let language { items.append(.init(name: "language", value: language)) }
        if let q { items.append(.init(name: "q", value: q)) }
        if let category { items.append(.init(name: "category", value: category)) }
        return try await get("/live", query: items, ttl: 90)
    }

    func liveAll(language: String) async throws -> [Channel] {
        let first = try await live(language: language, page: 1)
        var all = first.channels
        let pageSize = max(first.pageSize ?? 60, 1)
        let total = first.filteredCount ?? first.total ?? all.count
        let pages = min(Int(ceil(Double(total) / Double(pageSize))), 8)
        if pages > 1 {
            for p in 2...pages {
                let next = try await live(language: language, page: p)
                all.append(contentsOf: next.channels)
            }
        }
        var seen = Set<String>()
        return all.filter { seen.insert($0.id).inserted }
    }

    func vod() async throws -> VodShelvesPayload { try await get("/vod", ttl: ttl) }

    func searchVod(_ q: String) async throws -> VodSearch {
        try await get("/vod", query: [.init(name: "q", value: q)], ttl: 30)
    }

    func title(slug: String) async throws -> TitlePayload {
        let encoded = slug.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? slug
        return try await get("/title/\(encoded)", ttl: ttl)
    }

    func channel(id: String) async throws -> Channel {
        struct Envelope: Codable { let channel: Channel? }
        let encoded = id.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? id
        let data = try await data(for: "/channel/\(encoded)", query: [], ttl: 60)
        if let env = try? decoder.decode(Envelope.self, from: data), let ch = env.channel {
            return ch
        }
        return try decoder.decode(Channel.self, from: data)
    }

    struct VodSearch: Codable {
        let items: [CatalogTitle]
        let filteredCount: Int?
    }

    private func get<T: Decodable>(_ path: String, query: [URLQueryItem] = [], ttl: TimeInterval) async throws -> T {
        let data = try await data(for: path, query: query, ttl: ttl)
        return try decoder.decode(T.self, from: data)
    }

    private func data(for path: String, query: [URLQueryItem], ttl: TimeInterval) async throws -> Data {
        let clean = path.hasPrefix("/") ? path : "/\(path)"
        guard var comps = URLComponents(string: root + clean) else { throw URLError(.badURL) }
        if !query.isEmpty { comps.queryItems = query }
        guard let url = comps.url else { throw URLError(.badURL) }
        let key = url.absoluteString
        if let hit = memory[key], Date().timeIntervalSince(hit.at) < ttl {
            return hit.data
        }
        var req = URLRequest(url: url)
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        req.setValue("WhiscoTV/1.0 (iOS)", forHTTPHeaderField: "User-Agent")
        req.timeoutInterval = 20
        let (data, response) = try await URLSession.shared.data(for: req)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw URLError(.badServerResponse)
        }
        memory[key] = (Date(), data)
        return data
    }
}
