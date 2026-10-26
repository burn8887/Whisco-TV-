import Foundation

/// Live camera data from OpenStreetMap, fetched on the device.
///
/// Mirrors the Android `CameraFeed` deliberately, including the limits: one identifying
/// User-Agent, at most one query per area per 30 minutes, a 12 km window, and results kept
/// so the next drive costs nothing. Overpass is a shared volunteer service.
///
/// Two OSM taggings are read, because OSM has moved:
///   highway=speed_camera                       original, still the most common
///   highway=enforcement + enforcement=maxspeed newer scheme
enum CameraFeed {
    private static let endpoint = URL(string: "https://overpass-api.de/api/interpreter")!
    private static let userAgent = "Salim/0.6 (iOS; road-awareness; support@salimdrive.com)"
    private static let radiusMeters = 12_000.0
    private static let minimumInterval: TimeInterval = 30 * 60
    private static let cacheKey = "salim.cameras"
    private static let stampKey = "salim.cameras.stamp"

    /// Country boxes as (code, south, west, north, east). Small states first, because Saudi
    /// Arabia's rectangle would otherwise swallow Qatar, Bahrain and the UAE coast.
    static let boxes: [(String, Double, Double, Double, Double)] = [
        ("BH", 25.50, 50.20, 26.40, 50.90),
        ("QA", 24.40, 50.70, 26.20, 51.70),
        ("KW", 28.50, 46.50, 30.10, 48.50),
        ("AE", 22.60, 51.50, 26.10, 56.40),
        ("OM", 16.60, 52.00, 26.40, 59.90),
        ("SA", 16.00, 34.50, 32.20, 55.70),
    ]

    static func country(at point: Point) -> String? {
        boxes.first { $0.1...$0.3 ~= point.lat && $0.2...$0.4 ~= point.lon }?.0
    }

    /// Cameras kept from the last successful query.
    static func cached() -> [Hazard] {
        guard let data = UserDefaults.standard.data(forKey: cacheKey),
              let values = try? JSONDecoder().decode([Hazard].self, from: data) else { return [] }
        return values
    }

    /// Cached rows close enough to be about *this* area. The cache survives between drives,
    /// and a drive from Manama to Dubai would otherwise keep showing Manama's cameras:
    /// caching must not turn yesterday's city into today's false alert.
    private static func cachedNear(_ point: Point) -> [Hazard] {
        cached().filter { Geo.distance(point, $0.point) <= 25_000 }
    }

    private static func store(_ hazards: [Hazard]) {
        guard let data = try? JSONEncoder().encode(hazards) else { return }
        UserDefaults.standard.set(data, forKey: cacheKey)
        UserDefaults.standard.set(Date().timeIntervalSince1970, forKey: stampKey)
    }

    /// Cameras near a point. Falls back to the cache when the request is still fresh, when
    /// offline, or when Overpass is unavailable: losing the network must never cost the
    /// driver an alert they already had.
    static func fetch(near point: Point) async -> [Hazard] {
        guard country(at: point) != nil else { return cachedNear(point) }
        let last = UserDefaults.standard.double(forKey: stampKey)
        if last > 0, Date().timeIntervalSince1970 - last < minimumInterval { return cachedNear(point) }

        guard let body = await query(point) else { return cachedNear(point) }
        store(body)
        return body
    }

    private static func query(_ point: Point) async -> [Hazard]? {
        let dLat = radiusMeters / 111_574.0
        let dLon = radiusMeters / (111_320.0 * max(0.05, cos(point.lat * .pi / 180)))
        let box = "\(point.lat - dLat),\(point.lon - dLon),\(point.lat + dLat),\(point.lon + dLon)"

        // Two taggings, one request. `out body` keeps the payload to the tags we read.
        let overpass = "[out:json][timeout:25];" +
            "(node[\"highway\"=\"speed_camera\"](\(box));" +
            "node[\"highway\"=\"enforcement\"][\"enforcement\"=\"maxspeed\"](\(box));" +
            ");out body;"

        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.timeoutInterval = 25
        request.setValue(userAgent, forHTTPHeaderField: "User-Agent")
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        request.httpBody = Data(("data=" + formEncode(overpass)).utf8)

        guard let (data, response) = try? await URLSession.shared.data(for: request),
              let http = response as? HTTPURLResponse, http.statusCode == 200,
              let text = String(data: data, encoding: .utf8) else { return nil }
        return parse(text)
    }

    /// Overpass expects form encoding. Percent-encoding the reserved characters by hand
    /// avoids pulling in a UIKit dependency for `addingPercentAllowed`.
    private static func formEncode(_ value: String) -> String {
        var allowed = CharacterSet.alphanumerics
        allowed.insert(charactersIn: "-._~")
        return value.addingPercentEncoding(withAllowedCharacters: allowed) ?? ""
    }

    /// Also used by the offline importer path, so the parsing rules live in one place.
    static func parse(_ text: String) -> [Hazard] {
        guard let root = try? JSONSerialization.jsonObject(with: Data(text.utf8)) as? [String: Any],
              let elements = root["elements"] as? [[String: Any]] else { return [] }
        let now = Date().timeIntervalSince1970
        var out: [String: Hazard] = [:]

        for element in elements {
            guard element["type"] as? String == "node",
                  let id = (element["id"] as? NSNumber)?.int64Value, id != 0,
                  let lat = (element["lat"] as? NSNumber)?.doubleValue,
                  let lon = (element["lon"] as? NSNumber)?.doubleValue else { continue }
            let point = Point(lat: lat, lon: lon)
            guard point.valid, let country = country(at: point) else { continue }

            let tags = element["tags"] as? [String: Any] ?? [:]
            // Only genuine camera tags. An untagged node would become a phantom alert.
            let highway = tags["highway"] as? String ?? ""
            let enforcement = tags["enforcement"] as? String ?? ""
            guard highway == "speed_camera" || (highway == "enforcement" && enforcement == "maxspeed") else { continue }

            let name = (tags["name"] as? String).flatMap { $0.isEmpty ? nil : $0 }
                ?? (tags["ref"] as? String).flatMap { $0.isEmpty ? nil : $0 }
                ?? "Mapped camera"
            let heading = (tags["direction"] as? String).flatMap { Double($0.filter { $0.isNumber || $0 == "." }) }
                .flatMap { (0..<360).contains($0) ? $0 : nil }

            let hazard = Hazard(
                id: "osm:node/\(id)",
                country: country,
                kind: "CAMERA",
                point: point,
                heading: heading,
                road: String(name.prefix(200)),
                expiresAt: now + 30 * 24 * 60 * 60
            )
            out[hazard.id] = hazard
        }
        return Array(out.values)
    }
}
