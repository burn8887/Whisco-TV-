import Foundation

struct CatalogTitle: Codable, Identifiable, Hashable {
    let id: String
    let slug: String
    let name: String
    let posterUrl: String?
    let backdropUrl: String?
    let type: String
    let releaseYear: Int?
    let imdbRating: Double?
    let collection: String?
    let isNew: Bool?
    let language: String?
}

struct Channel: Codable, Identifiable, Hashable {
    let id: String
    let name: String
    let logoUrl: String?
    let streamUrl: String?
    let country: String?
    let language: String?
    let category: String?
    let isHD: Bool?
}

struct LanguageFacet: Codable, Hashable {
    let language: String
    let count: Int
}

struct LivePayload: Codable {
    let page: Int
    let pageSize: Int
    let filteredCount: Int
    let total: Int
    let channels: [Channel]
    let facets: Facets
    struct Facets: Codable {
        let countries: [String]
        let categories: [String]
        let languages: [LanguageFacet]
    }
}

struct HomePayload: Codable {
    let stats: Stats
    let hero: [CatalogTitle]
    let rows: [Row]
    let featuredChannels: [Channel]
    struct Stats: Codable { let channels: Int; let titles: Int }
    struct Row: Codable { let key: String; let label: String; let items: [CatalogTitle] }
}

struct VodShelvesPayload: Codable {
    let mode: String
    let total: Int
    let shelves: [Shelf]
    struct Shelf: Codable, Identifiable {
        var id: String { name }
        let name: String
        let count: Int?
        let items: [CatalogTitle]
    }
}

struct Episode: Codable, Identifiable, Hashable {
    let id: String
    let number: FlexibleNumber
    let name: String
    let synopsis: String?
    let durationMins: FlexibleNumber?
    let stillUrl: String?
    let streamUrl: String?
}

struct Season: Codable, Hashable {
    let number: Int
    let episodes: [Episode]
}

struct TitleDetail: Codable, Identifiable {
    let id: String
    let slug: String
    let name: String
    let type: String
    let synopsis: String?
    let posterUrl: String?
    let backdropUrl: String?
    let releaseYear: Int?
    let rating: String?
    let imdbRating: Double?
    let durationMins: Int?
    let genres: String?
    let collection: String?
    let cast: String?
    let country: String?
    let language: String?
    let streamUrl: String?
    let seasons: [Season]?
}

struct TitlePayload: Codable {
    let title: TitleDetail
    let similar: [CatalogTitle]
}

/// API returns episode numbers as Int or String.
enum FlexibleNumber: Codable, Hashable {
    case int(Int)
    case string(String)
    init(from decoder: Decoder) throws {
        let c = try decoder.singleValueContainer()
        if let i = try? c.decode(Int.self) { self = .int(i); return }
        if let s = try? c.decode(String.self) { self = .string(s); return }
        self = .int(0)
    }
    func encode(to encoder: Encoder) throws {
        var c = encoder.singleValueContainer()
        switch self {
        case .int(let i): try c.encode(i)
        case .string(let s): try c.encode(s)
        }
    }
    var description: String {
        switch self {
        case .int(let i): return String(i)
        case .string(let s): return s
        }
    }
}

struct Face: Codable, Identifiable, Hashable {
    var id: String
    var name: String
    var languages: [String]
    var hue: Double
}

enum GccCountry: String, Codable, CaseIterable {
    case BH, AE, SA, KW, QA, OM
    var name: String {
        switch self {
        case .BH: return "Bahrain"
        case .AE: return "United Arab Emirates"
        case .SA: return "Saudi Arabia"
        case .KW: return "Kuwait"
        case .QA: return "Qatar"
        case .OM: return "Oman"
        }
    }
}

enum HomeTime {
    static let map: [String: (tz: String, city: String)] = [
        "Hindi": ("Asia/Kolkata", "Mumbai"),
        "Malayalam": ("Asia/Kolkata", "Kochi"),
        "Tamil": ("Asia/Kolkata", "Chennai"),
        "Telugu": ("Asia/Kolkata", "Hyderabad"),
        "Punjabi": ("Asia/Kolkata", "Amritsar"),
        "Bengali": ("Asia/Dhaka", "Dhaka"),
        "Urdu": ("Asia/Karachi", "Karachi"),
        "Arabic": ("Africa/Cairo", "Cairo"),
        "Filipino": ("Asia/Manila", "Manila"),
        "English": ("Asia/Dubai", "Gulf"),
        "Turkish": ("Europe/Istanbul", "Istanbul"),
        "Indonesian": ("Asia/Jakarta", "Jakarta"),
        "Nepali": ("Asia/Kathmandu", "Kathmandu"),
        "Sinhala": ("Asia/Colombo", "Colombo"),
    ]

    static func label(for language: String, now: Date = Date()) -> String {
        let pair = map[language] ?? ("Asia/Dubai", "Gulf")
        let tz = TimeZone(identifier: pair.tz) ?? .current
        let f = DateFormatter()
        f.timeZone = tz
        f.dateFormat = "h:mm a"
        return "\(f.string(from: now)) in \(pair.city)"
    }
}
