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
    /// Overridable with an Info.plist `SalimOverpassURL` entry so release builds can use a
    /// Salim proxy instead of the public volunteer server.
    private static let endpoint: URL = {
        if let custom = Bundle.main.object(forInfoDictionaryKey: "SalimOverpassURL") as? String,
           !custom.isEmpty, let url = URL(string: custom) { return url }
        return URL(string: "https://overpass-api.de/api/interpreter")!
    }()
    private static let userAgent = "Salim/0.7 (iOS; road-awareness; support@salimdrive.com)"
    private static let radiusMeters = 12_000.0
    private static let minimumInterval: TimeInterval = 30 * 60
    private static let cacheKey = "salim.cameras"
    private static let stampKey = "salim.cameras.stamp"
    private static let areaLatStep = 0.12
    private static let areaLonStep = 0.15

    /// Country boxes as (code, south, west, north, east). Small states first, because Saudi
    /// Arabia's rectangle would otherwise swallow Qatar, Bahrain and the UAE coast.
    static let boxes: [(String, Double, Double, Double, Double)] = [
        // West edge at the King Fahd Causeway border (≈50.32°E); 50.20 put Al Khobar in Bahrain.
        ("BH", 25.50, 50.32, 26.40, 50.90),
        ("QA", 24.40, 50.70, 26.20, 51.70),
        ("KW", 28.50, 46.50, 30.10, 48.50),
        ("AE", 22.60, 51.50, 26.10, 56.40),
        ("OM", 16.60, 52.00, 26.40, 59.90),
        ("SA", 16.00, 34.50, 32.20, 55.70),
    ]

    /// Countries confirmed by OpenStreetMap's national boundaries (`is_in`) per area cell.
    /// The rectangles cannot separate Al Ain from Buraimi or Ras Al Khaimah from Musandam.
    private static let resolvedKey = "salim.cameras.countries"
    private static func cell(_ point: Point) -> String {
        "\(Int(floor(point.lat / areaLatStep))):\(Int(floor(point.lon / areaLonStep)))"
    }
    static func country(at point: Point) -> String? {
        if let known = (UserDefaults.standard.dictionary(forKey: resolvedKey) as? [String: String])?[cell(point)] { return known }
        return boxes.first { $0.1...$0.3 ~= point.lat && $0.2...$0.4 ~= point.lon }?.0
    }
    private static func remember(country: String, at point: Point) {
        var all = UserDefaults.standard.dictionary(forKey: resolvedKey) as? [String: String] ?? [:]
        all[cell(point)] = country
        UserDefaults.standard.set(all, forKey: resolvedKey)
    }

    /// Cameras kept from the last successful query.
    static func cached() -> [Hazard] {
        guard let data = UserDefaults.standard.data(forKey: cacheKey),
              let values = try? JSONDecoder().decode([Hazard].self, from: data) else { return [] }
        return values
    }

    /// Cached rows close enough to be about this area. Multiple areas are retained so a trip
    /// across the GCC does not replace the previous city or suppress a new-area fetch.
    static func cachedNear(_ point: Point, now: TimeInterval = Date().timeIntervalSince1970) -> [Hazard] {
        cached().filter { $0.expiresAt > now && Geo.distance(point, $0.point) <= 25_000 }
    }

    private static func areaKey(_ point: Point) -> String {
        let country = country(at: point) ?? "outside"
        return "\(country):\(Int(floor(point.lat / areaLatStep))):\(Int(floor(point.lon / areaLonStep)))"
    }

    private static func store(_ hazards: [Hazard], near point: Point, now: TimeInterval) {
        let current = cached().filter { $0.expiresAt > now }
        var merged: [String: Hazard] = [:]
        for hazard in current { merged[hazard.id] = hazard }
        for hazard in hazards { merged[hazard.id] = hazard }
        let retained = Array(merged.values.sorted { $0.expiresAt > $1.expiresAt }.prefix(5_000))
        guard let data = try? JSONEncoder().encode(retained) else { return }
        UserDefaults.standard.set(data, forKey: cacheKey)
        UserDefaults.standard.set(now, forKey: "\(stampKey).\(areaKey(point))")
    }

    /// Cameras near a point. Falls back to the cache when the request is still fresh, when
    /// offline, or when Overpass is unavailable: losing the network must never cost the
    /// driver an alert they already had.
    static func fetch(near point: Point) async -> [Hazard] {
        guard country(at: point) != nil else { return cachedNear(point) }
        let now = Date().timeIntervalSince1970
        let area = areaKey(point)
        let last = UserDefaults.standard.double(forKey: "\(stampKey).\(area)")
        let retryAfterKey = "\(stampKey).retry.\(area)"
        if (last > 0 && now - last < minimumInterval) || now < UserDefaults.standard.double(forKey: retryAfterKey) {
            return cachedNear(point, now: now)
        }

        guard let text = await query(point) else {
            UserDefaults.standard.set(now + 60, forKey: retryAfterKey)
            return cachedNear(point, now: now)
        }
        UserDefaults.standard.removeObject(forKey: retryAfterKey)
        if let code = parseCountry(text) { remember(country: code, at: point) }
        store(parse(text), near: point, now: now)
        return cachedNear(point, now: now)
    }

    /// Raw Overpass response, or nil on any failure. Only a point rounded to ~1 km is sent.
    private static func query(_ exact: Point) async -> String? {
        let point = Point(lat: (exact.lat * 100).rounded() / 100, lon: (exact.lon * 100).rounded() / 100)
        let dLat = radiusMeters / 111_574.0
        let dLon = radiusMeters / (111_320.0 * max(0.05, cos(point.lat * .pi / 180)))
        let box = "\(point.lat - dLat),\(point.lon - dLon),\(point.lat + dLat),\(point.lon + dLon)"

        // Two taggings, one request. `out body` keeps the payload to the tags we read.
        let overpass = "[out:json][timeout:25];" +
            "(node[\"highway\"=\"speed_camera\"](\(box));" +
            "node[\"highway\"=\"enforcement\"][\"enforcement\"~\"^(maxspeed|average_speed|traffic_signals|red_light|seatbelt|seat_belt)$\"](\(box));" +
            ");out body;" +
            // The country this point is in, from OSM's national boundaries: same request, same recipient.
            "is_in(\(point.lat),\(point.lon))->.a;area.a[\"admin_level\"=\"2\"];out tags;"

        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.timeoutInterval = 25
        request.setValue(userAgent, forHTTPHeaderField: "User-Agent")
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        request.httpBody = Data(("data=" + formEncode(overpass)).utf8)

        guard let (data, response) = try? await URLSession.shared.data(for: request),
              let http = response as? HTTPURLResponse, http.statusCode == 200,
              let text = String(data: data, encoding: .utf8) else { return nil }
        return text
    }

    /// Overpass expects form encoding. Percent-encoding the reserved characters by hand
    /// avoids pulling in a UIKit dependency for `addingPercentAllowed`.
    private static func formEncode(_ value: String) -> String {
        var allowed = CharacterSet.alphanumerics
        allowed.insert(charactersIn: "-._~")
        return value.addingPercentEncoding(withAllowedCharacters: allowed) ?? ""
    }

    /// ISO code of the GCC national boundary `is_in` returned, if any.
    static func parseCountry(_ text: String) -> String? {
        guard let root = try? JSONSerialization.jsonObject(with: Data(text.utf8)) as? [String: Any],
              let elements = root["elements"] as? [[String: Any]] else { return nil }
        for element in elements where element["type"] as? String == "area" {
            let tags = element["tags"] as? [String: Any] ?? [:]
            let code = (tags["ISO3166-1"] as? String) ?? (tags["ISO3166-1:alpha2"] as? String) ?? ""
            if DemoData.countries.contains(code) { return code }
        }
        return nil
    }

    /// OSM `maxspeed` in km/h: "80", "80 km/h", "50 mph". Anything else is unknown.
    static func parseLimit(_ value: String?) -> Int? {
        guard let text = value?.trimmingCharacters(in: .whitespaces).lowercased() else { return nil }
        let digits = text.prefix { $0.isNumber }
        guard !digits.isEmpty, digits.count <= 3, let number = Int(digits) else { return nil }
        let kmh = text.contains("mph") ? Int(Double(number) * 1.609344) : number
        return (5...200).contains(kmh) ? kmh : nil
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
            let supportedEnforcement = ["maxspeed", "average_speed", "traffic_signals", "red_light", "seatbelt", "seat_belt"]
            guard highway == "speed_camera" || (highway == "enforcement" && supportedEnforcement.contains(enforcement)) else { continue }
            let kind = ["traffic_signals", "red_light"].contains(enforcement) ? "RED_LIGHT"
                : ["seatbelt", "seat_belt"].contains(enforcement) ? "SEATBELT" : "CAMERA"

            let name = (tags["name"] as? String).flatMap { $0.isEmpty ? nil : $0 }
                ?? (tags["ref"] as? String).flatMap { $0.isEmpty ? nil : $0 }
                ?? "Mapped camera"
            let heading = (tags["direction"] as? String).flatMap { Double($0.filter { $0.isNumber || $0 == "." }) }
                .flatMap { (0..<360).contains($0) ? $0 : nil }

            let hazard = Hazard(
                id: "osm:node/\(id)",
                country: country,
                kind: kind,
                point: point,
                heading: heading,
                road: String(name.prefix(200)),
                expiresAt: now + 30 * 24 * 60 * 60,
                limit: parseLimit(tags["maxspeed"] as? String)
            )
            out[hazard.id] = hazard
        }
        return Array(out.values)
    }
}
