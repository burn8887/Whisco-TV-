import AVFoundation
import Foundation

@MainActor final class AudioAlerts: NSObject, AVSpeechSynthesizerDelegate {
    private let speech=AVSpeechSynthesizer()
    private var current:AVSpeechUtterance?
    private var watchdog:Task<Void,Never>?
    private var observer:NSObjectProtocol?
    override init() {
        super.init();speech.delegate=self
        observer=NotificationCenter.default.addObserver(forName:AVAudioSession.interruptionNotification,object:nil,queue:.main) { [weak self] note in
            guard let raw=note.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,AVAudioSession.InterruptionType(rawValue:raw) == .began else {return}
            Task { @MainActor in self?.stop() }
        }
    }
    /// Arabic when the phone's first language is Arabic and an Arabic voice is installed.
    static var arabic:Bool {
        Ar.enabled && AVSpeechSynthesisVoice(language:"ar-SA") != nil
    }
    /// One alert sentence in the active language. Distances over 100 m are rounded to 50 m.
    static func alertText(_ hazard:Hazard,meters:Double,demo:Bool) -> String {
        let raw=Int(meters)
        let m:Int=raw > 100 ? ((raw+25)/50)*50 : raw
        if arabic {
            let titles:[String:String]=["CAMERA":"كاميرا سرعة","MOBILE_CAMERA":"كاميرا متنقلة","SEATBELT":"كاميرا حزام الأمان والهاتف","RED_LIGHT":"كاميرا الإشارة الحمراء",
                        "ROADWORK":"أعمال طرق","HAZARD":"خطر على الطريق","TRAFFIC":"ازدحام مروري","BUMP":"مطب"]
            let title:String=titles[hazard.kind] ?? "تنبيه"
            var text:String=demo ? "تنبيه تجريبي. " : ""
            text += "\(title) بعد \(m) متر"
            if let limit=hazard.limit { text += "، السرعة المحددة \(limit)" }
            text += ". التزم باللوحات المرورية."
            return text
        }
        var text:String=demo ? "Demo alert. " : ""
        text += "\(hazard.title) in \(m) metres"
        if let limit=hazard.limit { text += ", limit \(limit)" }
        text += ". Follow posted signs."
        return text
    }
    func speak(_ text:String) {
        // Only the speech is replaced here. Calling stop() would silence the chime that
        // was just played for this same alert.
        cancelSpeech()
        do {
            let session=AVAudioSession.sharedInstance()
            try session.setCategory(.playback,mode:.voicePrompt,options:[.duckOthers,.interruptSpokenAudioAndMixWithOthers])
            try session.setActive(true)
            let utterance=AVSpeechUtterance(string:text);utterance.voice=AVSpeechSynthesisVoice(language:AudioAlerts.arabic ? "ar-SA" : "en");current=utterance;speech.speak(utterance)
            watchdog=Task { [weak self] in try? await Task.sleep(for:.seconds(15));guard !Task.isCancelled else{return};self?.stop() }
        } catch {release()}
    }
    /// Short attention tone before the spoken alert. Synthesised rather than shipped as a
    /// file: one fewer asset, and the pitch stays in the driver's attention band.
    func beep() {
        let session=AVAudioSession.sharedInstance()
        try? session.setCategory(.playback,mode:.voicePrompt,options:[.duckOthers,.interruptSpokenAudioAndMixWithOthers])
        try? session.setActive(true)
        guard let player=try? AVAudioPlayer(data:AudioAlerts.chime()) else {return}
        player.volume=0.55
        player.play()
        chimePlayer=player
    }
    private var chimePlayer:AVAudioPlayer?

    /// 180 ms, two tones a fifth apart, with a short fade so it does not click.
    private static func chime() -> Data {
        let rate=44_100.0, duration=0.18
        let frames=Int(rate*duration)
        var samples=[Int16](repeating:0,count:frames)
        for index in 0..<frames {
            let t=Double(index)/rate
            let envelope=min(1.0,t/0.01)*min(1.0,(duration-t)/0.05)
            let tone=sin(2*Double.pi*880*t)*0.6+sin(2*Double.pi*1320*t)*0.4
            samples[index]=Int16(max(-1,min(1,tone*envelope))*16_000)
        }
        var data=Data("RIFF".utf8)
        func append32(_ value:UInt32) {withUnsafeBytes(of:value.littleEndian){data.append(contentsOf:$0)}}
        func append16(_ value:UInt16) {withUnsafeBytes(of:value.littleEndian){data.append(contentsOf:$0)}}
        append32(UInt32(36+samples.count*2));data.append(contentsOf:"WAVE".utf8)
        data.append(contentsOf:"fmt ".utf8);append32(16);append16(1);append16(1)
        append32(UInt32(rate));append32(UInt32(rate)*2);append16(2);append16(16)
        data.append(contentsOf:"data".utf8);append32(UInt32(samples.count*2))
        for sample in samples {withUnsafeBytes(of:sample.littleEndian){data.append(contentsOf:$0)}}
        return data
    }

    func stop() {chimePlayer?.stop();chimePlayer=nil;cancelSpeech()}
    private func cancelSpeech() {current=nil;watchdog?.cancel();watchdog=nil;speech.stopSpeaking(at:.immediate);release()}
    private func release() {try? AVAudioSession.sharedInstance().setActive(false,options:.notifyOthersOnDeactivation)}
    private func finish(_ utterance:AVSpeechUtterance) {guard current === utterance else{return};current=nil;watchdog?.cancel();watchdog=nil;release()}
    func speechSynthesizer(_ synthesizer:AVSpeechSynthesizer,didFinish utterance:AVSpeechUtterance) {finish(utterance)}
    func speechSynthesizer(_ synthesizer:AVSpeechSynthesizer,didCancel utterance:AVSpeechUtterance) {finish(utterance)}
    deinit {if let observer {NotificationCenter.default.removeObserver(observer)}}
}
