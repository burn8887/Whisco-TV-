import Foundation

actor APIClient {
    static let shared = APIClient()
    private let base = URL(string: "https://www.whisco.tv/api/mobile/v1")!
    private let decoder: JSONDecoder = {
        let d = JSONDecoder()
        return d
    }()

    func home() async throws -> HomePayload {
        try await get("/home")
    }

    func live(language: String? = nil, q: String? = nil, page: Int = 1) async throws -> LivePayload {
        var items: [URLQueryItem] = [.init(name: "page", value: String(page))]
        if let language { items.append(.init(name: "language", value: language)) }
        if let q { items.append(.init(name: "q", value: q)) }
        return try await get("/live", query: items)
    }

    func vod() async throws -> VodShelvesPayload {
        try await get("/vod")
    }

    func searchVod(_ q: String) async throws -> VodSearch {
        try await get("/vod", query: [.init(name: "q", value: q)])
    }

    func title(slug: String) async throws -> TitlePayload {
        try await get("/title/\(slug)")
    }

    func channel(id: String) async throws -> Channel {
        struct Envelope: Codable { let channel: Channel? }
        let url = base.appending(path: "channel/\(id)")
        let (data, _) = try await URLSession.shared.data(from: url)
        if let env = try? decoder.decode(Envelope.self, from: data), let ch = env.channel {
            return ch
        }
        return try decoder.decode(Channel.self, from: data)
    }

    struct VodSearch: Codable {
        let items: [CatalogTitle]
        let filteredCount: Int?
    }

    private func get<T: Decodable>(_ path: String, query: [URLQueryItem] = []) async throws -> T {
        var comps = URLComponents(url: base.appending(path: path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))), resolvingAgainstBaseURL: false)!
        if !query.isEmpty { comps.queryItems = query }
        let (data, response) = try await URLSession.shared.data(from: comps.url!)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw URLError(.badServerResponse)
        }
        return try decoder.decode(T.self, from: data)
    }
}
