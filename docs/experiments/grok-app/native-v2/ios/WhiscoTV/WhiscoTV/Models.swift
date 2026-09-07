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

    init(
        id: String,
        slug: String,
        name: String,
        posterUrl: String?,
        backdropUrl: String? = nil,
        type: String,
        releaseYear: Int? = nil,
        imdbRating: Double? = nil,
        collection: String? = nil,
        isNew: Bool? = nil,
        language: String? = nil
    ) {
        self.id = id
        self.slug = slug
        self.name = name
        self.posterUrl = posterUrl
        self.backdropUrl = backdropUrl
        self.type = type
        self.releaseYear = releaseYear
        self.imdbRating = imdbRating
        self.collection = collection
        self.isNew = isNew
        self.language = language
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(String.self, forKey: .id) ?? UUID().uuidString
        slug = try c.decodeIfPresent(String.self, forKey: .slug) ?? id
        name = try c.decodeIfPresent(String.self, forKey: .name) ?? "Untitled"
        posterUrl = try c.decodeIfPresent(String.self, forKey: .posterUrl)
        backdropUrl = try c.decodeIfPresent(String.self, forKey: .backdropUrl)
        type = try c.decodeIfPresent(String.self, forKey: .type) ?? "SERIES"
        releaseYear = try c.decodeIfPresent(Int.self, forKey: .releaseYear)
        imdbRating = try c.decodeIfPresent(Double.self, forKey: .imdbRating)
        collection = try c.decodeIfPresent(String.self, forKey: .collection)
        isNew = try c.decodeIfPresent(Bool.self, forKey: .isNew)
        language = try c.decodeIfPresent(String.self, forKey: .language)
    }
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

    init(
        id: String,
        name: String,
        logoUrl: String? = nil,
        streamUrl: String? = nil,
        country: String? = nil,
        language: String? = nil,
        category: String? = nil,
        isHD: Bool? = nil
    ) {
        self.id = id
        self.name = name
        self.logoUrl = logoUrl
        self.streamUrl = streamUrl
        self.country = country
        self.language = language
        self.category = category
        self.isHD = isHD
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(String.self, forKey: .id) ?? UUID().uuidString
        name = try c.decodeIfPresent(String.self, forKey: .name) ?? "Channel"
        logoUrl = try c.decodeIfPresent(String.self, forKey: .logoUrl)
        streamUrl = try c.decodeIfPresent(String.self, forKey: .streamUrl)
        country = try c.decodeIfPresent(String.self, forKey: .country)
        language = try c.decodeIfPresent(String.self, forKey: .language)
        category = try c.decodeIfPresent(String.self, forKey: .category)
        isHD = try c.decodeIfPresent(Bool.self, forKey: .isHD)
    }
}

struct LanguageFacet: Codable, Hashable {
    let language: String
    let count: Int
}

struct LivePayload: Codable {
    let page: Int?
    let pageSize: Int?
    let filteredCount: Int?
    let total: Int?
    let channels: [Channel]
    let facets: Facets?
    struct Facets: Codable {
        let countries: [String]?
        let categories: [String]?
        let languages: [LanguageFacet]?
    }
}

struct HomePayload: Codable {
    let stats: Stats?
    let hero: [CatalogTitle]
    let rows: [Row]
    let featuredChannels: [Channel]?
    struct Stats: Codable { let channels: Int?; let titles: Int? }
    struct Row: Codable, Identifiable {
        var id: String { key }
        let key: String
        let label: String
        let items: [CatalogTitle]
    }
}

struct VodShelvesPayload: Codable {
    let mode: String?
    let total: Int?
    let shelves: [Shelf]
    struct Shelf: Codable, Identifiable, Hashable {
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

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(String.self, forKey: .id) ?? UUID().uuidString
        number = try c.decodeIfPresent(FlexibleNumber.self, forKey: .number) ?? .int(0)
        name = try c.decodeIfPresent(String.self, forKey: .name) ?? "Episode"
        synopsis = try c.decodeIfPresent(String.self, forKey: .synopsis)
        durationMins = try c.decodeIfPresent(FlexibleNumber.self, forKey: .durationMins)
        stillUrl = try c.decodeIfPresent(String.self, forKey: .stillUrl)
        streamUrl = try c.decodeIfPresent(String.self, forKey: .streamUrl)
    }
}

struct Season: Codable, Hashable {
    let number: Int
    let episodes: [Episode]
}

struct TitleDetail: Codable, Identifiable {
    let id: String
    let slug: String
    let name: String
    let type: String?
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

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(String.self, forKey: .id) ?? UUID().uuidString
        slug = try c.decodeIfPresent(String.self, forKey: .slug) ?? ""
        name = try c.decodeIfPresent(String.self, forKey: .name) ?? "Untitled"
        type = try c.decodeIfPresent(String.self, forKey: .type)
        synopsis = try c.decodeIfPresent(String.self, forKey: .synopsis)
        posterUrl = try c.decodeIfPresent(String.self, forKey: .posterUrl)
        backdropUrl = try c.decodeIfPresent(String.self, forKey: .backdropUrl)
        releaseYear = try c.decodeIfPresent(Int.self, forKey: .releaseYear)
        rating = try c.decodeIfPresent(String.self, forKey: .rating)
        imdbRating = try c.decodeIfPresent(Double.self, forKey: .imdbRating)
        durationMins = try c.decodeIfPresent(Int.self, forKey: .durationMins)
        genres = try c.decodeIfPresent(String.self, forKey: .genres)
        collection = try c.decodeIfPresent(String.self, forKey: .collection)
        cast = try c.decodeIfPresent(String.self, forKey: .cast)
        country = try c.decodeIfPresent(String.self, forKey: .country)
        language = try c.decodeIfPresent(String.self, forKey: .language)
        streamUrl = try c.decodeIfPresent(String.self, forKey: .streamUrl)
        seasons = try c.decodeIfPresent([Season].self, forKey: .seasons)
    }
}

struct TitlePayload: Codable {
    let title: TitleDetail
    let similar: [CatalogTitle]?
}

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
    var clockSource: String?
    var kidsMode: Bool?
}

enum GccCountry: String, Codable, CaseIterable, Identifiable {
    case BH, AE, SA, KW, QA, OM
    var id: String { rawValue }
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

struct ResumeEntry: Codable, Identifiable, Hashable {
    var id: String
    var kind: String
    var slug: String?
    var name: String
    var posterUrl: String?
    var language: String?
    var updatedAt: Double
}

enum Pack {
    static let gulf = ("gulf", "Gulf", "From here — Arabic & English", ["Arabic", "English"])
    static let all: [(id: String, title: String, subtitle: String, langs: [String])] = [
        gulf,
        ("india", "Indian", "9.1 million in the GCC", ["Hindi", "Malayalam", "Tamil", "Telugu", "Punjabi"]),
        ("bangladesh", "Bangladeshi", "5.04 million · Bangla", ["Bengali"]),
        ("pakistan", "Pakistani", "4.9 million · Urdu", ["Urdu"]),
        ("egypt", "Egyptian", "Arabic from Cairo", ["Arabic"]),
        ("philippines", "Filipino", "2.2 million · Filipino", ["Filipino"]),
    ]
    static let languages = [
        "Arabic", "English", "Hindi", "Malayalam", "Tamil", "Telugu", "Punjabi",
        "Bengali", "Urdu", "Filipino", "Turkish", "Indonesian", "Nepali", "Sinhala",
    ]
    static let categories = ["All", "News", "Sports", "Entertainment", "Kids", "Music", "Movies", "Lifestyle"]
    static let kidsShelves = ["Cartoons & Kids"]
    static let collectionLanguage: [String: String] = [
        "Turkish Dizi": "Turkish", "Hindi Cinema": "Hindi", "Hindi Serials & Shows": "Hindi",
        "Pakistani Dramas": "Urdu", "Malayalam Cinema": "Malayalam", "Bangla Natok & Cinema": "Bengali",
        "Tamil Cinema & Serials": "Tamil", "Telugu Cinema": "Telugu", "Filipino Shows": "Filipino",
        "Arabic Series & Shows": "Arabic", "Indonesian Shows": "Indonesian", "Nepali Cinema": "Nepali",
        "Punjabi Cinema": "Punjabi", "Sinhala Teledramas": "Sinhala", "Free Movies & TV": "English",
        "Game Shows": "English", "Cartoons & Kids": "English",
    ]
    static func isKidsShelf(_ name: String) -> Bool {
        let n = name.lowercased()
        return n.contains("cartoon") || n.contains("kid")
    }
    static func sponsor(languages: [String], clockSource: String?) -> (brand: String, line: String) {
        if clockSource == "gulf" {
            return ("Gulf Air", "Tonight in the Gulf, presented by Gulf Air")
        }
        let map: [String: (String, String)] = [
            "Malayalam": ("Air India Express", "Tonight’s Malayalam, presented by Air India Express"),
            "Hindi": ("Al Ansari Exchange", "Hindi cinema this week, presented by Al Ansari Exchange"),
            "Urdu": ("HBL", "Urdu dramas, presented by HBL"),
            "Bengali": ("Biman Bangladesh", "Bangla natok, presented by Biman Bangladesh Airlines"),
            "Arabic": ("stc", "Arabic series this week, presented by stc"),
            "Filipino": ("Cebu Pacific", "Filipino tonight, presented by Cebu Pacific"),
            "Turkish": ("Pegasus", "Turkish dizi, presented by Pegasus Airlines"),
        ]
        for lang in languages {
            if let s = map[lang] { return s }
        }
        return ("stc", "Arabic series this week, presented by stc")
    }
}
