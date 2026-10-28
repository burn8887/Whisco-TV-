import Foundation

struct CommunityReport: Decodable, Identifiable {
    let id: String
    let reportType: String
    let cameraId: String?
    let country: String
    let kind: String?
    let lat: Double?
    let lon: Double?
    let heading: Double?
    let road: String?
    let status: String
    let createdAt: Int
    let confirmations: Int
    let disputes: Int

    enum CodingKeys: String, CodingKey {
        case id, country, kind, lat, lon, heading, road, status, confirmations, disputes
        case reportType = "report_type"
        case cameraId = "camera_id"
        case createdAt = "created_at"
    }
}

private struct CommunityReportList: Decodable { let reports: [CommunityReport] }
private struct CommunityReceipt: Decodable { let id: String?; let error: String?; let message: String? }
private struct CommunityCameraList: Decodable { let cameras: [CommunityCamera] }
private struct CommunityOverrideList: Decodable { let overrides: [CommunityOverride] }
private struct CommunityCamera: Decodable {
    let id: String; let country: String; let kind: String; let lat: Double; let lon: Double
    let heading: Double?; let road: String; let updatedAt: Int
    enum CodingKeys: String, CodingKey { case id, country, kind, lat, lon, heading, road; case updatedAt = "updated_at" }
}
private struct CommunityOverride: Decodable {
    let cameraId: String; let status: String; let kind: String?; let lat: Double?; let lon: Double?
    let heading: Double?; let road: String?
    enum CodingKeys: String, CodingKey { case status, kind, lat, lon, heading, road; case cameraId = "camera_id" }
}

/// Public, privacy-minimal client for Salim's human-moderated camera service.
enum CommunityReports {
    private static let installationKey = "salim.community.installation-id"
    private static let allowedCountries: Set<String> = ["BH", "SA", "AE", "QA", "KW", "OM"]
    private static let allowedKinds: Set<String> = ["SPEED", "RED_LIGHT", "SEATBELT"]

    private static var baseURL: URL? {
        let configured = (Bundle.main.object(forInfoDictionaryKey: "SalimReportAPIBaseURL") as? String ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        guard let url = URL(string: configured), url.scheme == "https", url.host == "www.salimdrive.com", url.path == "/v1", url.query == nil, url.fragment == nil, url.user == nil, url.password == nil else { return nil }
        return url
    }

    private static var installationID: String {
        if let existing = UserDefaults.standard.string(forKey: installationKey) { return existing }
        let value = UUID().uuidString.lowercased()
        UserDefaults.standard.set(value, forKey: installationKey)
        return value
    }

    static func pending(country: String) async throws -> [CommunityReport] {
        guard allowedCountries.contains(country), let baseURL else { throw URLError(.notConnectedToInternet) }
        let url = baseURL.appendingPathComponent("reports").appending(queryItems: [URLQueryItem(name: "country", value: country)])
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.timeoutInterval = 10
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        let (data, response) = try await URLSession.shared.data(for: request)
        try validate(response, data: data)
        return try JSONDecoder().decode(CommunityReportList.self, from: data).reports
    }

    static func applyApproved(country: String, baseline: [Hazard], around point: Point) async -> [Hazard] {
        guard allowedCountries.contains(country), point.valid, let baseURL else { return baseline }
        do {
            var cameraComponents = URLComponents(url: baseURL.appendingPathComponent("cameras"), resolvingAgainstBaseURL: false)!
            cameraComponents.queryItems = [URLQueryItem(name: "country", value: country)]
            guard let cameraURL = cameraComponents.url else { return baseline }
            let (cameraData, _) = try await getJSON(cameraURL)
            let added = try JSONDecoder().decode(CommunityCameraList.self, from: cameraData).cameras.compactMap { record -> Hazard? in
                guard record.country == country, let kind = hazardKind(record.kind) else { return nil }
                let hazard = Hazard(id: record.id, country: country, kind: kind, point: Point(lat: record.lat, lon: record.lon),
                                    heading: record.heading, road: String((record.road.isEmpty ? "Human-reviewed community camera" : record.road).prefix(200)),
                                    expiresAt: Double.greatestFiniteMagnitude, precision: "approximate")
                do { try hazard.validate(); return hazard } catch { return nil }
            }
            var overrides: [CommunityOverride] = []
            var components = URLComponents(url: baseURL.appendingPathComponent("camera-overrides"), resolvingAgainstBaseURL: false)!
            components.queryItems = [URLQueryItem(name: "country", value: country)]
            if let url = components.url {
                let (data, _) = try await getJSON(url)
                overrides = try JSONDecoder().decode(CommunityOverrideList.self, from: data).overrides
            }
            let byID = Dictionary(overrides.map { ($0.cameraId, $0) }, uniquingKeysWith: { _, latest in latest })
            let adjusted = baseline.compactMap { hazard -> Hazard? in
                guard let change = byID[hazard.id] else { return hazard }
                if change.status == "REMOVED" { return nil }
                guard change.status == "ACTIVE" else { return hazard }
                let kind = change.kind.flatMap(hazardKind) ?? hazard.kind
                let correctedPoint: Point
                if let lat = change.lat, let lon = change.lon, Point(lat: lat, lon: lon).valid { correctedPoint = Point(lat: lat, lon: lon) }
                else { correctedPoint = hazard.point }
                let road = change.road.flatMap { $0.isEmpty ? nil : String($0.prefix(200)) } ?? hazard.road
                let copy = Hazard(id: hazard.id, country: hazard.country, kind: kind, point: correctedPoint,
                                  heading: change.heading ?? hazard.heading, road: road,
                                  expiresAt: hazard.expiresAt, precision: "approximate", limit: hazard.limit)
                do { try copy.validate(); return copy } catch { return hazard }
            }
            return (adjusted + added.filter { Geo.distance($0.point, point) <= 25_000 }).reduce(into: [String: Hazard]()) { $0[$1.id] = $1 }.map(\.value)
        } catch { return baseline }
    }

    static func submitCamera(_ hazard: Hazard, reportType: String) async throws -> String {
        guard ["VERIFY_PRESENT", "FLAG_REMOVED"].contains(reportType), ["CAMERA", "RED_LIGHT", "SEATBELT"].contains(hazard.kind), allowedCountries.contains(hazard.country), let baseURL else {
            throw URLError(.notConnectedToInternet)
        }
        var body: [String: Any] = [
            "installation_id": installationID,
            "report_type": reportType,
            "camera_id": hazard.id,
            "country": hazard.country,
            "kind": serverKind(hazard.kind),
            "lat": hazard.point.lat,
            "lon": hazard.point.lon,
            "road": String(hazard.road.prefix(120))
        ]
        if let heading = hazard.heading { body["heading"] = heading }
        return try await post(baseURL.appendingPathComponent("reports"), body: body)
    }

    static func proposeCamera(country: String, kind: String, lat: Double, lon: Double, accuracy: Double, road: String) async throws -> String {
        guard allowedCountries.contains(country), allowedKinds.contains(kind), lat.isFinite, lon.isFinite,
              (-90...90).contains(lat), (-180...180).contains(lon), accuracy.isFinite, (1...50).contains(accuracy), let baseURL else {
            throw URLError(.cannotConnectToHost)
        }
        let body: [String: Any] = [
            "installation_id": installationID,
            "report_type": "ADD_CAMERA",
            "country": country,
            "kind": kind,
            "lat": lat,
            "lon": lon,
            "accuracy_m": accuracy,
            "road": String(road.prefix(120))
        ]
        return try await post(baseURL.appendingPathComponent("reports"), body: body)
    }

    static func vote(reportID: String, vote: String) async throws {
        guard UUID(uuidString: reportID) != nil, ["CONFIRM", "DISPUTE"].contains(vote), let baseURL else {
            throw URLError(.badURL)
        }
        let url = baseURL.appendingPathComponent("reports").appendingPathComponent(reportID).appendingPathComponent("votes")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.timeoutInterval = 10
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: ["installation_id": installationID, "vote": vote])
        let (data, response) = try await URLSession.shared.data(for: request)
        try validate(response, data: data)
    }

    private static func getJSON(_ url: URL) async throws -> (Data, HTTPURLResponse) {
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.timeoutInterval = 10
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        let (data, response) = try await URLSession.shared.data(for: request)
        guard data.count <= 1_000_000, let http = response as? HTTPURLResponse else { throw URLError(.badServerResponse) }
        try validate(http, data: data)
        return (data, http)
    }

    private static func hazardKind(_ value: String) -> String? {
        switch value {
        case "SPEED": return "CAMERA"
        case "RED_LIGHT": return "RED_LIGHT"
        case "SEATBELT": return "SEATBELT"
        default: return nil
        }
    }

    private static func post(_ url: URL, body: [String: Any]) async throws -> String {
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.timeoutInterval = 10
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        let (data, response) = try await URLSession.shared.data(for: request)
        try validate(response, data: data)
        let receipt = try JSONDecoder().decode(CommunityReceipt.self, from: data)
        guard let id = receipt.id, !id.isEmpty else { throw URLError(.cannotParseResponse) }
        return id
    }

    private static func validate(_ response: URLResponse, data: Data) throws {
        guard let http = response as? HTTPURLResponse else { throw URLError(.badServerResponse) }
        guard (200...299).contains(http.statusCode) else {
            let error = (try? JSONDecoder().decode(CommunityReceipt.self, from: data).error) ?? nil
            throw NSError(domain: "SalimCommunityReports", code: http.statusCode,
                          userInfo: [NSLocalizedDescriptionKey: error ?? "Shared camera service returned HTTP \(http.statusCode)"])
        }
    }

    private static func serverKind(_ kind: String) -> String {
        switch kind {
        case "RED_LIGHT": return "RED_LIGHT"
        case "SEATBELT": return "SEATBELT"
        case "CAMERA": return "SPEED"
        default: return "SPEED"
        }
    }
}
