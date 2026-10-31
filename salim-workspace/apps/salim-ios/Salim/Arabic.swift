import Foundation
import SwiftUI

/// Arabic interface. English is the source language; when the app runs in Arabic (device
/// language, or Settings › Salim › Language) every string shown through `Text` is looked up in
/// the generated `arExact` table, then matched against `arPatterns` for strings with numbers.
/// Anything not in the table (road names, user drafts) is shown as is.
///
/// Source of truth: salim-workspace/i18n/ar.json → tools/gen_arabic.py → ArabicStrings.swift.
enum Ar {
    /// The language iOS picked for this app from its localizations (en, ar). This also decides
    /// right-to-left layout, so text and layout always agree.
    static let enabled: Bool = Bundle.main.preferredLocalizations.first?.hasPrefix("ar") ?? false
    private static let lower: [String: String] = Dictionary(arExact.map { ($0.key.lowercased(), $0.value) }, uniquingKeysWith: { first, _ in first })
    private static let patterns: [(NSRegularExpression, String)] = arPatterns.compactMap { pair in
        (try? NSRegularExpression(pattern: pair.0)).map { ($0, pair.1) }
    }
    private static let slot = try! NSRegularExpression(pattern: "\\{(t?)(\\d)\\}")

    static func t(_ s: String) -> String {
        guard enabled, !s.isEmpty else { return s }
        return translate(s)
    }

    private static func translate(_ s: String) -> String {
        if let hit = arExact[s] ?? lower[s.lowercased()] { return hit }
        let whole = NSRange(s.startIndex..., in: s)
        for (regex, template) in patterns {
            guard let match = regex.firstMatch(in: s, range: whole), match.range == whole else { continue }
            var out = ""
            var cursor = template.startIndex
            let range = NSRange(template.startIndex..., in: template)
            for slotMatch in slot.matches(in: template, range: range) {
                guard let full = Range(slotMatch.range, in: template),
                      let flag = Range(slotMatch.range(at: 1), in: template),
                      let digit = Range(slotMatch.range(at: 2), in: template),
                      let index = Int(template[digit]) else { continue }
                out += template[cursor..<full.lowerBound]
                var value = ""
                if index < match.numberOfRanges, let group = Range(match.range(at: index), in: s) { value = String(s[group]) }
                out += template[flag].isEmpty ? value : translate(value)
                cursor = full.upperBound
            }
            out += template[cursor...]
            return out
        }
        return s
    }

    static func hasArabic(_ s: String) -> Bool {
        s.unicodeScalars.contains { (0x0600...0x06FF).contains($0.value) || (0x0750...0x077F).contains($0.value) }
    }
}

/// The app's Text. A type declared in this module shadows SwiftUI.Text for every file here, so
/// each `Text("…")` is translated by `Ar` without touching call sites. Arabic letter-spacing is
/// reset to zero because tracking breaks the joins between Arabic letters. Where an API needs
/// SwiftUI's own Text type, write `SwiftUI.Text(Ar.t("…"))`.
struct Text: View {
    private let shown: String
    init<S: StringProtocol>(_ content: S) { shown = Ar.t(String(content)) }
    var body: some View {
        if Ar.hasArabic(shown) {
            SwiftUI.Text(verbatim: shown).tracking(0)
        } else {
            SwiftUI.Text(verbatim: shown)
        }
    }
}
