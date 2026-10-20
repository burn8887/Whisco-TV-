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
    func speak(_ text:String) {
        stop()
        do {
            let session=AVAudioSession.sharedInstance()
            try session.setCategory(.playback,mode:.voicePrompt,options:[.duckOthers,.interruptSpokenAudioAndMixWithOthers])
            try session.setActive(true)
            let utterance=AVSpeechUtterance(string:text);utterance.voice=AVSpeechSynthesisVoice(language:"en");current=utterance;speech.speak(utterance)
            watchdog=Task { [weak self] in try? await Task.sleep(for:.seconds(15));guard !Task.isCancelled else{return};self?.stop() }
        } catch {release()}
    }
    func stop() {current=nil;watchdog?.cancel();watchdog=nil;speech.stopSpeaking(at:.immediate);release()}
    private func release() {try? AVAudioSession.sharedInstance().setActive(false,options:.notifyOthersOnDeactivation)}
    private func finish(_ utterance:AVSpeechUtterance) {guard current === utterance else{return};current=nil;watchdog?.cancel();watchdog=nil;release()}
    func speechSynthesizer(_ synthesizer:AVSpeechSynthesizer,didFinish utterance:AVSpeechUtterance) {finish(utterance)}
    func speechSynthesizer(_ synthesizer:AVSpeechSynthesizer,didCancel utterance:AVSpeechUtterance) {finish(utterance)}
    deinit {if let observer {NotificationCenter.default.removeObserver(observer)}}
}
