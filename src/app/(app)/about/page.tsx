import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";

// NOTE (2026-09-17): this page carries no catalogue counts, by design.
// /about is the App Store Marketing URL, and a reviewer comparing it against
// the apps must never find two different catalogues described. The website
// indexes broadly; the apps ship a smaller, fully documented catalogue. Say
// that in words and never in numbers. Do not reintroduce a stat tile here.
//
// NOTE (2026-10-04): the iOS 1.0 build 8 app is live-news only. The old
// sentence here ("Our iPhone and Android apps carry ... public-domain short
// films") described the Android app's shelf as if it were both apps' shelf —
// false for iOS, and visible to an Apple reviewer through this page. The
// paragraph below now states each platform separately: website = full index,
// iPhone app = eight news lives only, Android app = the same eight plus the
// Archive films. Do not merge the platforms back into one sentence.
export const metadata: Metadata = {
  title: "About Us",
  description:
    "Whisco TV is a free, ad-supported service for Gulf households — nationals and expats alike. We host no video files: everything plays from the source that owns it. No subscription, ever.",
};

export default async function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-2">About Whisco TV</h1>
      <p className="text-zinc-400 mb-10">Free TV for the communities that call the Gulf home.</p>

      <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">What we are</h2>
          <p>
            Whisco TV is a <span className="text-emerald-400 font-semibold">100% free, ad-supported</span> streaming
            service built for every household in Bahrain, Saudi Arabia, the UAE, Kuwait, Qatar, and Oman — Gulf
            nationals and the region’s expatriate communities alike — and for anyone, anywhere, who wants the news
            from home. News, sport, and film in the languages the Gulf actually watches. There is no subscription, no
            credit card, and no catch: advertising keeps the lights on.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">The website and the apps</h2>
          <p>
            Whisco TV on the web is the <span className="text-white font-semibold">full index</span>. It brings together
            live channels and films that are streamed from the source that owns them — the broadcaster&apos;s own
            player, or archive.org&apos;s own player. We host no video files of our own.
          </p>
          <p className="mt-3">
            The <span className="text-white font-semibold">iPhone app</span> (1.0 build 8, still in Apple review)
            plays <span className="text-white font-semibold">eight official news live streams only</span> — no films,
            no series, no downloads. The <span className="text-white font-semibold">Android app on Google Play</span>{" "}
            plays those same eight news streams plus{" "}
            <span className="text-white font-semibold">eight public-domain short films from the Internet Archive</span>.
            Neither app is an Android TV or Fire TV app. There is no subscription in either app.
          </p>
          <p className="mt-3">
            Google Play:{" "}
            <a
              href="https://play.google.com/store/apps/details?id=tv.whisco.app"
              className="text-orange-400 hover:underline"
            >
              Android phone and tablet
            </a>
          </p>
          <p className="mt-3">
            Rights holders: if you&apos;d like a source reviewed, updated, or removed, contact{" "}
            <a href="mailto:legal@whisco.tv" className="text-orange-400 hover:underline">legal@whisco.tv</a> and
            we&apos;ll respond promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Where our content comes from</h2>
          <p>
            Everything on Whisco TV comes from legitimate sources: free-to-air broadcaster streams, official
            broadcaster and production-company channels (which keep their own advertising and control), public-domain
            catalogs, and licensed distribution partners. Our catalog is monitored automatically around the clock —
            dead or unavailable sources are removed within hours, and content that isn&apos;t available in our viewers&apos;
            region is filtered out rather than shown broken.
          </p>
          <p className="mt-2">
            Rights holders: if you&apos;d like a source reviewed, updated, or removed, contact us and we&apos;ll respond
            promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Work with us</h2>
          <p>
            We partner with content owners, distributors, and advertisers who want to reach Gulf households — national and expatriate audiences across all six GCC states.
            If you have content to license to us or want to advertise on Whisco TV, we&apos;d love to talk.
          </p>
        </section>

        <section className="rounded-2xl bg-zinc-900/70 ring-1 ring-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Mail size={18} className="text-orange-400" /> Contact
          </h2>
          <ul className="space-y-2">
            <li>
              <span className="text-zinc-500 w-32 inline-block">Partnerships:</span>
              <a href="mailto:partnerships@whisco.tv" className="text-orange-400 hover:underline">partnerships@whisco.tv</a>
            </li>
            <li>
              <span className="text-zinc-500 w-32 inline-block">Rights &amp; privacy:</span>
              <a href="mailto:legal@whisco.tv" className="text-orange-400 hover:underline">legal@whisco.tv</a>
            </li>
          </ul>
          <p className="text-xs text-zinc-500 mt-4">
            See also our <Link href="/privacy" className="text-zinc-300 hover:underline">Privacy Policy</Link> and{" "}
            <Link href="/terms" className="text-zinc-300 hover:underline">Terms of Use</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
