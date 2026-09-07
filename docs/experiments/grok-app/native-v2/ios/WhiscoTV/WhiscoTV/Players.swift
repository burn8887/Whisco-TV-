import SwiftUI
import AVKit
import WebKit

struct HLSPlayer: UIViewControllerRepresentable {
    let url: String

    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIViewController(context: Context) -> AVPlayerViewController {
        let vc = AVPlayerViewController()
        vc.allowsPictureInPicturePlayback = true
        vc.canStartPictureInPictureAutomaticallyFromInline = true
        if let u = URL(string: url) {
            let player = AVPlayer(url: u)
            vc.player = player
            player.play()
            context.coordinator.current = url
        }
        return vc
    }

    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {
        guard url != context.coordinator.current, let u = URL(string: url) else { return }
        context.coordinator.current = url
        uiViewController.player?.pause()
        let p = AVPlayer(url: u)
        uiViewController.player = p
        p.play()
    }

    static func dismantleUIViewController(_ uiViewController: AVPlayerViewController, coordinator: Coordinator) {
        uiViewController.player?.pause()
        uiViewController.player = nil
    }

    final class Coordinator {
        var current: String = ""
    }
}

struct YouTubeEmbed: UIViewRepresentable {
    let url: String
    func makeUIView(context: Context) -> WKWebView {
        let cfg = WKWebViewConfiguration()
        cfg.allowsInlineMediaPlayback = true
        cfg.allowsPictureInPictureMediaPlayback = true
        cfg.mediaTypesRequiringUserActionForPlayback = []
        let w = WKWebView(frame: .zero, configuration: cfg)
        w.scrollView.isScrollEnabled = false
        w.isOpaque = false
        w.backgroundColor = .black
        w.load(URLRequest(url: embedURL))
        return w
    }
    func updateUIView(_ uiView: WKWebView, context: Context) {
        if uiView.url != embedURL {
            uiView.load(URLRequest(url: embedURL))
        }
    }
    private var embedURL: URL {
        var s = url
        s = s.replacingOccurrences(of: "youtube.com/embed", with: "youtube-nocookie.com/embed")
        if let id = YouTube.id(from: s) {
            return URL(string: "https://www.youtube-nocookie.com/embed/\(id)?rel=0&modestbranding=1&playsinline=1")!
        }
        return URL(string: s) ?? URL(string: "about:blank")!
    }
}

struct AirPlayButton: UIViewRepresentable {
    func makeUIView(context: Context) -> AVRoutePickerView {
        let v = AVRoutePickerView()
        v.tintColor = UIColor(WhiscoTheme.fg)
        v.activeTintColor = UIColor(WhiscoTheme.accent)
        v.prioritizesVideoDevices = true
        return v
    }
    func updateUIView(_ uiView: AVRoutePickerView, context: Context) {}
}

enum YouTube {
    static func id(from url: String) -> String? {
        let patterns = [
            #"youtube\.com/embed/([A-Za-z0-9_-]{11})"#,
            #"youtu\.be/([A-Za-z0-9_-]{11})"#,
            #"v=([A-Za-z0-9_-]{11})"#,
            #"i\.ytimg\.com/vi/([A-Za-z0-9_-]{11})/"#,
        ]
        for p in patterns {
            if let r = try? NSRegularExpression(pattern: p),
               let m = r.firstMatch(in: url, range: NSRange(url.startIndex..., in: url)),
               let range = Range(m.range(at: 1), in: url) {
                return String(url[range])
            }
        }
        return nil
    }
    static func isYouTube(_ url: String?) -> Bool {
        guard let url else { return false }
        return url.contains("youtube") || url.contains("youtu.be") || url.contains("ytimg")
    }
    static func isHLS(_ url: String?) -> Bool {
        guard let url else { return false }
        return url.contains(".m3u8")
    }
}
