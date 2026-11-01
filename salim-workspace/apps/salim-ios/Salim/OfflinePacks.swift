import Foundation

/// Premium: every mapped camera in a GCC country, downloaded once and kept on the phone, so
/// alerts keep working with no signal. Built from OpenStreetMap's own country boundary.
enum OfflinePacks {
    static let countries: [(String, String)] = [("BH", "Bahrain"), ("SA", "Saudi Arabia"), ("AE", "United Arab Emirates"), ("QA", "Qatar"), ("KW", "Kuwait"), ("OM", "Oman")]
    /// Set from the subscription state; packs are used only while Premium is active.
    nonisolated(unsafe) static var active = false
    nonisolated(unsafe) private static var cache: [String: [Hazard]] = [:]

    private static var folder: URL {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0].appendingPathComponent("packs", isDirectory: true)
        try? FileManager.default.createDirectory(at: base, withIntermediateDirectories: true)
        return base
    }
    private static func file(_ code: String) -> URL { folder.appendingPathComponent("\(code).json") }

    struct Info: Codable { let count: Int; let updatedAt: Date }
    private struct Pack: Codable { let updatedAt: Date; let cameras: [Hazard] }

    static func info(_ code: String) -> Info? {
        guard let data = try? Data(contentsOf: file(code)), let pack = try? JSONDecoder().decode(Pack.self, from: data) else { return nil }
        return Info(count: pack.cameras.count, updatedAt: pack.updatedAt)
    }

    static func cameras(_ code: String) -> [Hazard] {
        if let hit = cache[code] { return hit }
        guard let data = try? Data(contentsOf: file(code)), let pack = try? JSONDecoder().decode(Pack.self, from: data) else { return [] }
        cache[code] = pack.cameras
        return pack.cameras
    }

    static func download(_ code: String) async throws -> Int {
        let endpoint: URL = {
            if let custom = Bundle.main.object(forInfoDictionaryKey: "SalimOverpassURL") as? String, !custom.isEmpty, let url = URL(string: custom) { return url }
            return URL(string: "https://overpass-api.de/api/interpreter")!
        }()
        let query = "[out:json][timeout:90];area[\"ISO3166-1\"=\"\(code)\"][\"admin_level\"=\"2\"]->.c;(" +
            "node[\"highway\"=\"speed_camera\"](area.c);" +
            "node[\"highway\"=\"enforcement\"][\"enforcement\"~\"^(maxspeed|average_speed|traffic_signals|red_light|seatbelt|seat_belt)$\"](area.c););out body;"
        var request = URLRequest(url: endpoint, timeoutInterval: 95)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        request.setValue("Salim/0.8 (iOS offline pack; support@salimdrive.com)", forHTTPHeaderField: "User-Agent")
        var allowed = CharacterSet.alphanumerics; allowed.insert(charactersIn: "-._~")
        request.httpBody = ("data=" + (query.addingPercentEncoding(withAllowedCharacters: allowed) ?? "")).data(using: .utf8)
        let (data, response) = try await URLSession.shared.data(for: request)
        guard (response as? HTTPURLResponse)?.statusCode == 200, let text = String(data: data, encoding: .utf8) else { throw URLError(.badServerResponse) }
        let far = Date().timeIntervalSince1970 + 120 * 24 * 3600
        let cameras = CameraFeed.parse(text).map {
            Hazard(id: $0.id, country: code, kind: $0.kind, point: $0.point, heading: $0.heading, road: $0.road, expiresAt: far, limit: $0.limit)
        }
        try JSONEncoder().encode(Pack(updatedAt: Date(), cameras: cameras)).write(to: file(code), options: .atomic)
        cache[code] = cameras
        return cameras.count
    }

    static func remove(_ code: String) {
        try? FileManager.default.removeItem(at: file(code))
        cache[code] = nil
    }
}
