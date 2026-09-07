import Foundation
import Observation

@Observable
final class LocalStore {
    var onboarded: Bool
    var faces: [Face]
    var activeFaceId: String
    var country: GccCountry
    var watchlist: [CatalogTitle]
    var favoriteChannels: [Channel]
    var resume: [ResumeEntry]
    var recentSearches: [String]
    var soundEnabled: Bool

    var activeFace: Face {
        faces.first(where: { $0.id == activeFaceId }) ?? faces[0]
    }

    init() {
        let d = UserDefaults.standard
        onboarded = d.bool(forKey: "onboarded")
        country = GccCountry(rawValue: d.string(forKey: "country") ?? "BH") ?? .BH
        soundEnabled = d.bool(forKey: "sound")
        if let data = d.data(forKey: "faces"),
           let decoded = try? JSONDecoder().decode([Face].self, from: data),
           !decoded.isEmpty {
            faces = decoded
        } else {
            faces = [Face(id: "you", name: "You", languages: ["Arabic", "English"], hue: 18, clockSource: "gulf", kidsMode: false)]
        }
        activeFaceId = d.string(forKey: "activeFace") ?? "you"
        watchlist = Self.decode(d.data(forKey: "watchlist"), as: [CatalogTitle].self) ?? []
        favoriteChannels = Self.decode(d.data(forKey: "favCh"), as: [Channel].self) ?? []
        resume = Self.decode(d.data(forKey: "resume"), as: [ResumeEntry].self) ?? []
        recentSearches = Self.decode(d.data(forKey: "recents"), as: [String].self) ?? []
    }

    func persist() {
        let d = UserDefaults.standard
        d.set(onboarded, forKey: "onboarded")
        d.set(country.rawValue, forKey: "country")
        d.set(soundEnabled, forKey: "sound")
        d.set(activeFaceId, forKey: "activeFace")
        d.set(try? JSONEncoder().encode(faces), forKey: "faces")
        d.set(try? JSONEncoder().encode(watchlist), forKey: "watchlist")
        d.set(try? JSONEncoder().encode(favoriteChannels), forKey: "favCh")
        d.set(try? JSONEncoder().encode(resume), forKey: "resume")
        d.set(try? JSONEncoder().encode(recentSearches), forKey: "recents")
    }

    func completeOnboarding(name: String, languages: [String], country: GccCountry, clockSource: String = "origin", kidsMode: Bool = false) {
        faces = [Face(id: "you", name: name.isEmpty ? "You" : name, languages: languages.isEmpty ? ["Arabic", "English"] : languages, hue: 18, clockSource: clockSource, kidsMode: kidsMode)]
        activeFaceId = "you"
        self.country = country
        onboarded = true
        persist()
    }

    func setActiveFace(_ id: String) {
        activeFaceId = id
        persist()
    }

    func addFace(name: String, languages: [String], kidsMode: Bool) {
        guard faces.count < 4 else { return }
        let face = Face(id: UUID().uuidString, name: name, languages: languages, hue: Double.random(in: 10...340), clockSource: languages.contains("Arabic") && languages.contains("English") ? "gulf" : "origin", kidsMode: kidsMode)
        faces.append(face)
        activeFaceId = face.id
        persist()
    }

    func updateActive(_ patch: (inout Face) -> Void) {
        guard let i = faces.firstIndex(where: { $0.id == activeFaceId }) else { return }
        patch(&faces[i])
        persist()
    }

    func removeFace(_ id: String) {
        guard faces.count > 1, id != "you" else { return }
        faces.removeAll { $0.id == id }
        if activeFaceId == id { activeFaceId = faces[0].id }
        persist()
    }

    func toggleSaved(_ title: CatalogTitle) {
        if let i = watchlist.firstIndex(where: { $0.id == title.id }) {
            watchlist.remove(at: i)
        } else {
            watchlist.insert(title, at: 0)
            if watchlist.count > 80 { watchlist = Array(watchlist.prefix(80)) }
        }
        persist()
    }

    func isSaved(_ id: String) -> Bool { watchlist.contains(where: { $0.id == id }) }

    func toggleFavorite(_ channel: Channel) {
        if let i = favoriteChannels.firstIndex(where: { $0.id == channel.id }) {
            favoriteChannels.remove(at: i)
        } else {
            favoriteChannels.insert(channel, at: 0)
            if favoriteChannels.count > 16 { favoriteChannels = Array(favoriteChannels.prefix(16)) }
        }
        persist()
    }

    func isFavorite(_ id: String) -> Bool { favoriteChannels.contains(where: { $0.id == id }) }

    func upsertResume(_ entry: ResumeEntry) {
        resume.removeAll { $0.id == entry.id }
        resume.insert(entry, at: 0)
        if resume.count > 24 { resume = Array(resume.prefix(24)) }
        persist()
    }

    func pushSearch(_ q: String) {
        let t = q.trimmingCharacters(in: .whitespacesAndNewlines)
        guard t.count >= 2 else { return }
        recentSearches.removeAll { $0.caseInsensitiveCompare(t) == .orderedSame }
        recentSearches.insert(t, at: 0)
        if recentSearches.count > 8 { recentSearches = Array(recentSearches.prefix(8)) }
        persist()
    }

    func reset() {
        onboarded = false
        faces = [Face(id: "you", name: "You", languages: ["Arabic", "English"], hue: 18, clockSource: "gulf", kidsMode: false)]
        activeFaceId = "you"
        country = .BH
        watchlist = []
        favoriteChannels = []
        resume = []
        recentSearches = []
        soundEnabled = false
        persist()
    }

    private static func decode<T: Decodable>(_ data: Data?, as: T.Type) -> T? {
        guard let data else { return nil }
        return try? JSONDecoder().decode(T.self, from: data)
    }
}
