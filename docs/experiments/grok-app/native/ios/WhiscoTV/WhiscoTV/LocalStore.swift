import Foundation
import Observation

@Observable
final class LocalStore {
    var onboarded: Bool
    var faces: [Face]
    var activeFaceId: String
    var country: GccCountry
    var watchlist: [CatalogTitle]
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
            faces = [Face(id: "you", name: "You", languages: ["Hindi", "English"], hue: 18)]
        }
        activeFaceId = d.string(forKey: "activeFace") ?? "you"
        if let data = d.data(forKey: "watchlist"),
           let decoded = try? JSONDecoder().decode([CatalogTitle].self, from: data) {
            watchlist = decoded
        } else {
            watchlist = []
        }
    }

    func persist() {
        let d = UserDefaults.standard
        d.set(onboarded, forKey: "onboarded")
        d.set(country.rawValue, forKey: "country")
        d.set(soundEnabled, forKey: "sound")
        d.set(activeFaceId, forKey: "activeFace")
        d.set(try? JSONEncoder().encode(faces), forKey: "faces")
        d.set(try? JSONEncoder().encode(watchlist), forKey: "watchlist")
    }

    func completeOnboarding(name: String, languages: [String], country: GccCountry) {
        self.faces = [Face(id: "you", name: name, languages: languages, hue: 18)]
        self.activeFaceId = "you"
        self.country = country
        self.onboarded = true
        persist()
    }

    func toggleSaved(_ title: CatalogTitle) {
        if let i = watchlist.firstIndex(where: { $0.id == title.id }) {
            watchlist.remove(at: i)
        } else {
            watchlist.insert(title, at: 0)
        }
        persist()
    }
}
