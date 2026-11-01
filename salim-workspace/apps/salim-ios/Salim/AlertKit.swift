import AVFoundation
import Foundation
import UIKit

/// Alert sound family. Each is synthesised on the device; no audio files ship.
enum TonePreset: String, CaseIterable, Identifiable {
    case chime, pulse, sonar, classic
    var id: String { rawValue }
    var label: String { ["chime": "Chime", "pulse": "Pulse", "sonar": "Sonar", "classic": "Classic beep"][rawValue] ?? "Chime" }
}

/// How early a camera is announced: speed × seconds, clamped to a distance window.
enum LeadOption: String, CaseIterable, Identifiable {
    case early, standard, late
    var id: String { rawValue }
    var label: String { self == .early ? "Early" : self == .late ? "Late" : "Standard" }
    var seconds: Double { self == .early ? 40 : self == .late ? 20 : 30 }
    var range: (Double, Double) { self == .early ? (500, 1300) : self == .late ? (300, 700) : (400, 1000) }
    var detail: String {
        self == .early ? "About 40 seconds ahead, at least 500 m."
            : self == .late ? "About 20 seconds ahead, at least 300 m." : "About 30 seconds ahead, at least 400 m."
    }
}

/// Which navigation app "Drive & navigate" hands the destination to.
enum NavAppOption: String, CaseIterable, Identifiable {
    case apple, google, waze
    var id: String { rawValue }
    var label: String { self == .google ? "Google Maps" : self == .waze ? "Waze" : "Apple Maps" }
}

/// Driver options, stored on this device only. Views bind the same keys with @AppStorage.
enum DriverOptions {
    static let toneKey = "salim.opt.tone", voiceKey = "salim.opt.voice", rateKey = "salim.opt.rate"
    static let countdownKey = "salim.opt.countdown", hapticsKey = "salim.opt.haptics", leadKey = "salim.opt.lead"
    static let navKey = "salim.opt.nav", screenKey = "salim.opt.screen", homeKey = "salim.opt.home", workKey = "salim.opt.work", recentsKey = "salim.opt.recents"
    private static var d: UserDefaults { .standard }
    static var tone: TonePreset { TonePreset(rawValue: d.string(forKey: toneKey) ?? "") ?? .chime }
    static var voiceID: String? { d.string(forKey: voiceKey).flatMap { $0.isEmpty ? nil : $0 } }
    static var rate: Double { let r = d.double(forKey: rateKey); return r == 0 ? 1.0 : min(1.3, max(0.8, r)) }
    static var countdown: Bool { d.object(forKey: countdownKey) as? Bool ?? true }
    static var haptics: Bool { d.object(forKey: hapticsKey) as? Bool ?? true }
    static var lead: LeadOption { LeadOption(rawValue: d.string(forKey: leadKey) ?? "") ?? .standard }
    static var nav: NavAppOption { NavAppOption(rawValue: d.string(forKey: navKey) ?? "") ?? .apple }
    static var keepScreenOn: Bool { d.object(forKey: screenKey) as? Bool ?? true }
    static var recents: [String] { (d.array(forKey: recentsKey) as? [String]) ?? [] }
    static func remember(_ destination: String) {
        let value = String(destination.trimmingCharacters(in: .whitespacesAndNewlines).prefix(120))
        guard !value.isEmpty else { return }
        d.set(Array(([value] + recents.filter { $0.caseInsensitiveCompare(value) != .orderedSame }).prefix(5)), forKey: recentsKey)
    }
}

/// Synthesised alert sounds (16-bit mono WAV in memory).
enum ToneSynth {
    private static let rate = 44_100.0
    private static func tone(_ freq: Double, _ ms: Double, volume: Double = 0.75, decay: Double = 0) -> [Int16] {
        let frames = Int(rate * ms / 1000)
        return (0..<frames).map { (i: Int) -> Int16 in
            let t = Double(i) / rate
            var env = min(1.0, t / 0.006) * min(1.0, (ms / 1000 - t) / 0.04)
            if decay > 0 { env *= exp(-decay * t) }
            return Int16(max(-1, min(1, sin(2 * .pi * freq * t) * env * volume)) * 30_000)
        }
    }
    private static func silence(_ ms: Double) -> [Int16] { [Int16](repeating: 0, count: Int(rate * ms / 1000)) }
    static func alert(_ p: TonePreset) -> Data {
        switch p {
        case .chime: return wav(tone(880, 140) + silence(25) + tone(1320, 240))
        case .pulse: return wav(tone(1000, 90) + silence(70) + tone(1000, 90) + silence(70) + tone(1000, 90))
        case .sonar: return wav(tone(1180, 520, volume: 0.8, decay: 7))
        case .classic: return wav(tone(1500, 180) + silence(60) + tone(1500, 180))
        }
    }
    static func tick(_ p: TonePreset) -> Data {
        switch p {
        case .chime: return wav(tone(1320, 70))
        case .pulse: return wav(tone(1000, 60))
        case .sonar: return wav(tone(1180, 160, volume: 0.8, decay: 14))
        case .classic: return wav(tone(1500, 70))
        }
    }
    static func flat() -> Data { wav(tone(1050, 1200, volume: 0.7)) }
    private static func wav(_ samples: [Int16]) -> Data {
        var data = Data("RIFF".utf8)
        func u32(_ v: UInt32) { withUnsafeBytes(of: v.littleEndian) { data.append(contentsOf: $0) } }
        func u16(_ v: UInt16) { withUnsafeBytes(of: v.littleEndian) { data.append(contentsOf: $0) } }
        u32(UInt32(36 + samples.count * 2)); data.append(contentsOf: "WAVE".utf8)
        data.append(contentsOf: "fmt ".utf8); u32(16); u16(1); u16(1); u32(UInt32(rate)); u32(UInt32(rate) * 2); u16(2); u16(16)
        data.append(contentsOf: "data".utf8); u32(UInt32(samples.count * 2))
        for s in samples { withUnsafeBytes(of: s.littleEndian) { data.append(contentsOf: $0) } }
        return data
    }
}

/// Plays synthesised tones over other audio (ducking music), including in the background.
@MainActor final class TonePlayer {
    static let shared = TonePlayer()
    private var players: [AVAudioPlayer] = []
    func play(_ data: Data, volume: Float = 0.6) {
        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.playback, mode: .voicePrompt, options: [.duckOthers, .interruptSpokenAudioAndMixWithOthers])
        try? session.setActive(true)
        guard let player = try? AVAudioPlayer(data: data) else { return }
        player.volume = volume
        player.play()
        players.removeAll { !$0.isPlaying }
        players.append(player)
    }
}

/// Phone haptics. iOS only plays these while Salim is on screen.
@MainActor enum Haptics {
    static func pulse(_ intensity: Double) {
        guard UIApplication.shared.applicationState == .active else { return }
        UIImpactFeedbackGenerator(style: .heavy).impactOccurred(intensity: CGFloat(min(1, max(0.2, intensity))))
    }
}

/// Parking-sensor countdown to a camera: ticks speed up as the distance falls, then one flat
/// tone right before the detection zone. Stops once the camera is behind the driver.
@MainActor final class CountdownController {
    private var task: Task<Void, Never>?
    private var meters = Double.greatestFiniteMagnitude
    private var closest = Double.greatestFiniteMagnitude
    private var active = false

    func start(meters: Double) {
        self.meters = meters; closest = meters; active = true
        task?.cancel()
        task = Task { [weak self] in
            try? await Task.sleep(for: .milliseconds(1_500))
            while let self, self.active, !Task.isCancelled {
                let m = self.meters
                if m <= 60 {
                    if DriverOptions.countdown { TonePlayer.shared.play(ToneSynth.flat()) }
                    if DriverOptions.haptics { Haptics.pulse(1) }
                    self.active = false
                    break
                }
                let interval = m > 600 ? 3.0 : m > 400 ? 2.0 : m > 250 ? 1.3 : m > 150 ? 0.8 : 0.45
                if DriverOptions.countdown { TonePlayer.shared.play(ToneSynth.tick(DriverOptions.tone)) }
                if DriverOptions.haptics { Haptics.pulse(1 - (min(700, max(60, m)) - 60) / 640) }
                try? await Task.sleep(for: .seconds(interval))
            }
        }
    }
    func update(_ distance: Double) {
        guard active else { return }
        meters = distance
        closest = min(closest, distance)
        if distance > closest + 60 { stop() }
    }
    func stop() { active = false; task?.cancel(); task = nil }
}
