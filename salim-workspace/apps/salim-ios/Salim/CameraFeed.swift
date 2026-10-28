import Foundation

/// On-demand OpenStreetMap Overpass queries. Mapped records are community data, not an
/// official or complete GCC register, and are displayed as unverified/approximate.
enum CameraFeed {
    private static let endpoint = URL(string: "https://overpass-api.de/api/interpreter")!
    private static let radius = 15_000
    private static let expiry: TimeInterval = 6 * 60 * 60
    private static let cacheInterval: TimeInterval = 15 * 60
    private static let snapGrid = 20.0
    private static let lock = NSLock()
    private static var cache: [String: (Date, [Hazard])] = [:]
    private static var requested: [String: Date] = [:]
    private static let countries: Set<String> = ["BH", "SA", "AE", "QA", "KW", "OM"]

    static func cachedNear(_ point: Point) -> [Hazard] {
        lock.lock(); defer { lock.unlock() }
        let all = cache.values.flatMap { $0.1 }
        let unique = Dictionary(all.map { ($0.id, $0) }, uniquingKeysWith: { first, _ in first })
        return unique.values.filter { $0.expiresAt > Date().timeIntervalSince1970 && Geo.distance($0.point, point) <= 25_000 }
    }

    static func fetch(near point: Point, country: String) async -> [Hazard] {
        guard point.valid, countries.contains(country) else { return [] }
        let snappedLat = (floor(point.lat * snapGrid) + 0.5) / snapGrid
        let snappedLon = (floor(point.lon * snapGrid) + 0.5) / snapGrid
        let key = "\(country):\(Int(snappedLat * snapGrid)):\(Int(snappedLon * snapGrid))"
        let now = Date()
        let existing = entry(for: key)
        if let existing, now.timeIntervalSince(existing.0) < cacheInterval {
            return nearby(existing.1, point: point, now: now)
        }
        if !claim(key, at: now) {
            return nearby(existing?.1 ?? [], point: point, now: now)
        }

        let query = """
        [out:json][timeout:20];
        (
          node(around:\(radius),\(snappedLat),\(snappedLon))["highway"="speed_camera"];
          node(around:\(radius),\(snappedLat),\(snappedLon))["enforcement"="maxspeed"];
          node(around:\(radius),\(snappedLat),\(snappedLon))["camera:type"="red_light"];
          node(around:\(radius),\(snappedLat),\(snappedLon))["enforcement"="red_light"];
        );out body;
        """
        guard var components = URLComponents(url: endpoint, resolvingAgainstBaseURL: false) else { return [] }
        components.queryItems = [URLQueryItem(name: "data", value: query)]
        guard let encoded = components.percentEncodedQuery?.data(using: .utf8) else { return [] }
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.timeoutInterval = 25
        request.setValue("application/x-www-form-urlencoded; charset=utf-8", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("Salim/0.7 (https://www.salimdrive.com; support@salimdrive.com)", forHTTPHeaderField: "User-Agent")
        request.httpBody = encoded
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard data.count <= 2_000_000, (response as? HTTPURLResponse)?.statusCode == 200,
                  let root = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let elements = root["elements"] as? [[String: Any]] else { return cachedFor(key, near: point) }
            let expiryTime = Date().timeIntervalSince1970 + expiry
            let rows = elements.compactMap { node -> Hazard? in
                guard node["type"] as? String == "node", let id = node["id"] as? Int,
                      let lat = node["lat"] as? Double, let lon = node["lon"] as? Double,
                      let tags = node["tags"] as? [String: String] else { return nil }
                if tags["mobile"] == "yes" || tags["deployment"] == "mobile" { return nil }
                let kind: String
                if tags["camera:type"]?.lowercased() == "red_light" || tags["enforcement"] == "red_light" { kind = "RED_LIGHT" }
                else if ["seatbelt", "phone"].contains(tags["camera:type"]?.lowercased() ?? "") { kind = "SEATBELT" }
                else if tags["highway"] == "speed_camera" || tags["enforcement"] == "maxspeed" { kind = "CAMERA" }
                else { return nil }
                let label = tags["name"].flatMap { $0.isEmpty ? nil : $0 }
                    ?? tags["ref"].flatMap { $0.isEmpty ? nil : $0 }
                    ?? "Mapped camera · OpenStreetMap"
                let direction = tags["camera:direction"].flatMap { Double($0) }.flatMap { (0..<360).contains($0) ? $0 : nil }
                let hazard = Hazard(id: "osm:node/\(id)", country: country, kind: kind,
                                    point: Point(lat: lat, lon: lon), heading: direction,
                                    road: String(label.prefix(200)), expiresAt: expiryTime,
                                    precision: "approximate")
                do { try hazard.validate(); return hazard } catch { return nil }
            }
            store(rows, for: key, at: Date())
            return nearby(rows, point: point, now: Date())
        } catch {
            return cachedFor(key, near: point)
        }
    }

    /// Country selection remains explicit until Salim has a licensed boundary dataset.
    static func country(at point: Point) -> String? { nil }

    private static func entry(for key: String) -> (Date, [Hazard])? {
        lock.lock(); defer { lock.unlock() }
        return cache[key]
    }

    private static func claim(_ key: String, at date: Date) -> Bool {
        lock.lock(); defer { lock.unlock() }
        if let last = requested[key], date.timeIntervalSince(last) < cacheInterval { return false }
        requested[key] = date
        return true
    }

    private static func store(_ rows: [Hazard], for key: String, at date: Date) {
        lock.lock(); cache[key] = (date, rows); lock.unlock()
    }

    private static func nearby(_ rows: [Hazard], point: Point, now: Date) -> [Hazard] {
        rows.filter { $0.expiresAt > now.timeIntervalSince1970 && Geo.distance($0.point, point) <= 25_000 }
    }

    private static func cachedFor(_ key: String, near point: Point) -> [Hazard] {
        nearby(entry(for: key)?.1 ?? [], point: point, now: Date())
    }
}
