import Foundation

/// The bundled camera pack, read from `cameras.csv` in the app bundle.
///
/// Same file, same columns as Android. It is deliberately data rather than code: a camera
/// list that can be corrected without a rebuild is the only kind that can be kept honest.
/// A malformed row costs one camera, never the drive.
///
/// Columns: id,kind,lat,lon,road,speed_limit,heading,precision,source
enum CameraPack {
    /// Rows are only trusted inside the GCC envelope. Anything outside is a typo, not a camera.
    static func load(bundle: Bundle = .main) -> [Hazard] {
        guard let url = bundle.url(forResource: "cameras", withExtension: "csv"),
              let text = try? String(contentsOf: url, encoding: .utf8) else { return [] }
        return parse(text)
    }

    static func parse(_ text: String) -> [Hazard] {
        var out: [Hazard] = []
        var seen = Set<String>()
        for raw in text.split(whereSeparator: \.isNewline) {
            let line = String(raw).trimmingCharacters(in: .whitespaces)
            if line.isEmpty || line.hasPrefix("#") || line.hasPrefix("id,") { continue }
            // Strings, not Substrings: Foundation's trimming and numeric initialisers are
            // written against String, and a silent overload miss here would be a compile
            // error on a machine I cannot see.
            let cells = line.split(separator: ",", omittingEmptySubsequences: false)
                .map { String($0).trimmingCharacters(in: .whitespaces) }
            if cells.count < 9 { continue }
            let id = cells[0], kind = cells[1].uppercased()
            if id.isEmpty || seen.contains(id) { continue }
            guard ["CAMERA", "SEATBELT", "RED_LIGHT", "MOBILE_CAMERA"].contains(kind),
                  let lat = Double(cells[2]), let lon = Double(cells[3]) else { continue }
            let point = Point(lat: lat, lon: lon)
            // Reuses the same boxes the live feed uses, so a pack row and a fetched row
            // are attributed to a country by one rule, not two that can drift apart.
            guard point.valid, let country = CameraFeed.country(at: point) else { continue }
            seen.insert(id)
            let limit = Int(cells[5]).flatMap { (30...160).contains($0) ? $0 : nil }
            let heading = Double(cells[6]).flatMap { (0..<360).contains($0) ? $0 : nil }
            out.append(Hazard(
                id: id,
                country: country,
                kind: kind,
                point: point,
                heading: heading,
                road: String((cells[4].isEmpty ? "Unnamed road" : cells[4]).prefix(200)),
                expiresAt: DemoData.expiry,
                precision: cells[7].lowercased() == "exact" ? "exact" : "approximate",
                limit: limit
            ))
        }
        return out
    }
}
