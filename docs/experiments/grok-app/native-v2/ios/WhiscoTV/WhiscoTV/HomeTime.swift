import Foundation

enum HomeTime {
    static let languageMap: [String: (tz: String, city: String)] = [
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

    static let countryMap: [String: (tz: String, city: String)] = [
        "Bahrain": ("Asia/Bahrain", "Manama"),
        "BH": ("Asia/Bahrain", "Manama"),
        "UAE": ("Asia/Dubai", "Dubai"),
        "AE": ("Asia/Dubai", "Dubai"),
        "United Arab Emirates": ("Asia/Dubai", "Dubai"),
        "Saudi Arabia": ("Asia/Riyadh", "Riyadh"),
        "SA": ("Asia/Riyadh", "Riyadh"),
        "Kuwait": ("Asia/Kuwait", "Kuwait City"),
        "KW": ("Asia/Kuwait", "Kuwait City"),
        "Qatar": ("Asia/Qatar", "Doha"),
        "QA": ("Asia/Qatar", "Doha"),
        "Oman": ("Asia/Muscat", "Muscat"),
        "OM": ("Asia/Muscat", "Muscat"),
        "Egypt": ("Africa/Cairo", "Cairo"),
        "India": ("Asia/Kolkata", "Mumbai"),
        "Pakistan": ("Asia/Karachi", "Karachi"),
        "Bangladesh": ("Asia/Dhaka", "Dhaka"),
        "Philippines": ("Asia/Manila", "Manila"),
        "Turkey": ("Europe/Istanbul", "Istanbul"),
        "France": ("Europe/Paris", "Paris"),
        "Jordan": ("Asia/Amman", "Amman"),
        "Palestine": ("Asia/Gaza", "Gaza"),
    ]

    static func pair(language: String, country: GccCountry, clockSource: String?) -> (tz: String, city: String) {
        if clockSource == "gulf" {
            return (country.tz, country.city)
        }
        return languageMap[language] ?? ("Asia/Dubai", "Gulf")
    }

    static func format(tz: String, now: Date = Date()) -> String {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_GB")
        f.timeZone = TimeZone(identifier: tz) ?? .current
        f.dateFormat = "h:mm a"
        return f.string(from: now)
    }

    static func label(for language: String, country: GccCountry = .BH, clockSource: String? = nil, now: Date = Date()) -> String {
        let pair = pair(language: language, country: country, clockSource: clockSource)
        return "\(format(tz: pair.tz, now: now)) in \(pair.city)"
    }

    static func channelLabel(_ channel: Channel, now: Date = Date()) -> String {
        if let country = channel.country, let pair = countryMap[country] {
            return "\(format(tz: pair.tz, now: now)) in \(pair.city)"
        }
        if let lang = channel.language {
            return label(for: lang, now: now)
        }
        return ""
    }

    static func greeting(tz: String, now: Date = Date()) -> String {
        var cal = Calendar.current
        cal.timeZone = TimeZone(identifier: tz) ?? .current
        let hour = cal.component(.hour, from: now)
        if hour < 5 { return "Still up" }
        if hour < 12 { return "Good morning" }
        if hour < 17 { return "Good afternoon" }
        if hour < 22 { return "Good evening" }
        return "Late night"
    }
}

extension GccCountry {
    var tz: String {
        switch self {
        case .BH: return "Asia/Bahrain"
        case .AE: return "Asia/Dubai"
        case .SA: return "Asia/Riyadh"
        case .KW: return "Asia/Kuwait"
        case .QA: return "Asia/Qatar"
        case .OM: return "Asia/Muscat"
        }
    }
    var city: String {
        switch self {
        case .BH: return "Manama"
        case .AE: return "Dubai"
        case .SA: return "Riyadh"
        case .KW: return "Kuwait City"
        case .QA: return "Doha"
        case .OM: return "Muscat"
        }
    }
}
