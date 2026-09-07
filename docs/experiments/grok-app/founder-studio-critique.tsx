import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { FIVE_COMMUNITIES } from "@/lib/communities";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
});

const TABS = ["Product", "Design", "Native", "Critique"] as const;
type Tab = (typeof TABS)[number];

function StudioPage() {
  const [tab, setTab] = useState<Tab>("Product");
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <p className="text-sm text-muted">
        <Link to="/you" className="hover:text-fg">
          You
        </Link>{" "}
        / Founder studio
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Clean-room build
      </h1>
      <p className="mt-2 text-sm text-muted">
        What a founding mobile team would ship with the same brand and rails.
        This preview is the product. Native trees sit beside it.
      </p>
      <div className="mt-6 flex gap-1 rounded-2xl border border-border bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-xl px-3 py-2 text-sm",
              tab === t ? "bg-elevated text-fg" : "text-muted",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <article className="prose-whisco mt-8 space-y-6 text-[15px] leading-relaxed text-muted">
        {tab === "Product" ? <Product /> : null}
        {tab === "Design" ? <Design /> : null}
        {tab === "Native" ? <Native /> : null}
        {tab === "Critique" ? <Critique /> : null}
      </article>
    </div>
  );
}

function H({ children }: { children: string }) {
  return (
    <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
      {children}
    </h2>
  );
}

function Product() {
  return (
    <>
      <H>Five communities (not a guess)</H>
      <p>
        Al Jazeera, 9 March 2026, citing Global Media Insight; repeated by Times
        of India (25 Mar 2026) and Times Kuwait (11 Mar 2026). ~35 million
        foreigners in the six GCC states. Ranked:
      </p>
      <ol className="list-decimal space-y-3 pl-5 text-fg">
        {FIVE_COMMUNITIES.map((c) => (
          <li key={c.id}>
            <span className="font-medium">{c.name} · {c.population}</span>
            <span className="mt-1 block text-sm text-muted">
              {c.populationNote} Watches: {c.watches}
            </span>
          </li>
        ))}
      </ol>
      <p>
        Yemen is tied with the Philippines at ~2.2M but is a refugee/adjacent
        Arabic audience already served by the Egyptian/Arabic hub. We did not
        collapse “Indian” into Hindi — Malayalam, Tamil, Telugu, Punjabi are
        first-class, because that is how those households actually watch.
      </p>

      <H>The app is a home, not a catalog</H>
      <p>
        Every streaming app — including the current whisco.tv — is organised by
        content type: Live, Movies, Series. Expats don’t open an app to “browse
        VOD.” They open it to feel like they are home for forty minutes.
      </p>
      <p>
        Information architecture is language-first, household-aware,
        live-leaning. Bottom tabs: Tonight · Live · Library · You. Search is a
        tool, not a tab. Hubs are languages, not genres.
      </p>
      <p>
        Tuesday night loop: icon → Tonight already showing your language’s live
        mosaic + continue + tonight’s serial → play. Eight seconds. Weekend
        loop: Library → your cinema shelf. Shared-phone loop: swap Face on You,
        the whole mosaic changes, no password.
      </p>
      <p>
        Premium-while-free is structure, speed, and restraint. Warm paper-on-ink
        type, one orange→pink stroke used like a signature not a theme park,
        one ad per screen and never on the picture, Home Time clocks that make
        the product feel like it knows Kochi is 2.5 hours ahead of Manama.
      </p>

      <H>Three bold bets</H>
      <ol className="list-decimal space-y-3 pl-5">
        <li>
          <span className="font-medium text-fg">Faces, not accounts.</span> Up
          to four device-local household faces. Privacy-native (“Data Not
          Collected”) and the actual social unit of Gulf viewing: one phone,
          three generations.
        </li>
        <li>
          <span className="font-medium text-fg">Home Time.</span> Live tiles
          and hubs annotated in the origin timezone. “Asianet News · 8:02 PM in
          Kochi.” Nobody else in this market does this. It is a one-line
          feature with outsized belonging.
        </li>
        <li>
          <span className="font-medium text-fg">The legal Jadoo.</span> Pirate
          boxes won the living room because the UX was “phone is the remote.”
          AirPlay / Cast / a room code. Same ritual, legal signal.
        </li>
      </ol>

      <H>Monetization that isn’t “show ads”</H>
      <p>
        Hub sponsorship. One brand owns a language hub for a week. “Tonight’s
        Malayalam, presented by Air India Express.” Never on the player. Never
        more than one. Sold as a diaspora media package to remittance houses,
        GCC-India/Pakistan/PH airlines, and telcos. This is closer to BBC
        weather sponsorship than to AVOD.
      </p>
      <p>
        Display ads: max one per screen, native, labeled, never adjacent to
        playback. Licensed own-player titles (Filmhub path): one 15s pre-roll,
        skippable at 5s, once per session per title. YouTube embeds: we never
        wrap them — the broadcaster keeps that inventory; wrapping is a ToS
        violation.
      </p>
      <p>
        B2B “Whisco for staff” (camps, hospitals, hotels) is a sponsorship of
        the living room, not a user subscription. Users stay free forever.
      </p>

      <H>Whisco, the dog</H>
      <p>
        He is the icon, the empty-state companion, and the buffering waiter. He
        is not a cartoon overlay and he does not say “Woof.” Voice is dry and
        short: “This channel’s napping. Try Asianet.” Motion is 180ms ease-out,
        no bounce. Sound is off by default.
      </p>

      <H>Assumption log — Phase 1</H>
      <ul className="list-disc space-y-1 pl-5">
        <li>GMI 2026 aggregates are the best public GCC-wide stack; national stats disagree on Pakistan-in-UAE by ~1M. Rank order is stable.</li>
        <li>No signup is a rail, so personalisation is device-local. Cloud profiles are a v1.1 maybe, never a gate.</li>
        <li>Sports rights (IPL, PSL, beIN) are not in the legal catalog today. We do not fake them.</li>
        <li>This web preview is the playable product; Swift/Kotlin trees are the native specification.</li>
      </ul>
    </>
  );
}

function Design() {
  return (
    <>
      <H>Tokens</H>
      <ul className="list-disc space-y-1 pl-5">
        <li>Background #0a0a0f · surface #12121a · elevated #1a1a24</li>
        <li>Foreground #f4f0ea (warm) · muted #9a948c</li>
        <li>Accent orange #f97316 → pink #db2777, used on the wordmark, LIVE badge, one CTA stroke</li>
        <li>Type: Sora (display) + Outfit (body). Two families, no Inter.</li>
        <li>Radius 8 / 14 / 20 / 28, concentric. Spacing 4-base.</li>
        <li>Motion 150–250ms ease-out. Reduced-motion respected.</li>
      </ul>

      <H>Screen inventory</H>
      <ul className="list-disc space-y-1 pl-5">
        <li>Onboarding (3 steps: community pack → GCC country → face name)</li>
        <li>Tonight (home) — greeting, hero, sponsor, continue, live mosaic, serials, 1 ad</li>
        <li>Live — language mosaic + Home Time + channel grid</li>
        <li>Library — language hubs first, then other shelves</li>
        <li>Language hub — live + VOD for one origin</li>
        <li>Title — play, save, seasons; ad only below episodes</li>
        <li>Watch — HLS or YouTube; zero ads on chrome</li>
        <li>Search — live + VOD</li>
        <li>You — faces, country, saved, sound, reset</li>
        <li>Cast — legal Jadoo pairing ritual</li>
        <li>Studio — this document</li>
      </ul>

      <H>Live vs VOD browsing</H>
      <p>
        Live is a mosaic of languages you chose, each tile a clock. Drill in,
        get that language’s channels, HD and country as metadata not as the
        organising axis. VOD is the same axis: Malayalam Cinema is a hub, not a
        row buried under “Movies.” Genre rows exist as a lower shelf for
        English-library grazing.
      </p>

      <H>Ad experience</H>
      <p>
        Where ads live: one native card on Tonight (between shelf 2 and 3), one
        at the end of Library, one below episodes on Title. Where they never
        live: player, live grid, onboarding, Cast, Studio. Why this won’t be
        the region’s #1 complaint: the competitive brief is full of “5 ads
        together none stop.” We cap at one, fail open, never freeze the
        picture, never put a paywall next to “free.”
      </p>

      <H>Assumption log — Phase 2</H>
      <ul className="list-disc space-y-1 pl-5">
        <li>Tablet and desktop share the phone IA with a left rail, not a fake phone frame.</li>
        <li>YouTube thumbs are ugly 16:9 in a 2:3 poster. We still use them — they’re the legal art.</li>
      </ul>
    </>
  );
}

function Native() {
  return (
    <>
      <H>iOS · SwiftUI</H>
      <p>
        Minimum: iOS 17. Observation, SwiftData-not-needed (UserDefaults faces),
        NavigationStack, AVPlayer for HLS. YouTube-sourced VOD is an
        official WKWebView of youtube-nocookie embeds — we do not extract
        media streams (ToS). iOS 17 still covers the cheap-phone tail in 2026
        without dropping NavigationSplitView for tablets.
      </p>
      <p className="font-mono text-xs text-subtle">
        native/ios/WhiscoTV — WhiscoTVApp, RootTabView, APIClient, LocalStore,
        HomeView, LiveView, LibraryView, TitleDetailView, WatchView (AVPlayer +
        YouTube), CastView, FacesStore
      </p>
      <H>Android · Compose</H>
      <p>
        minSdk 24 (Android 7.0) — the labour-camp phone floor. targetSdk 35.
        Media3 ExoPlayer for HLS. YouTube Android Player / IFrame in a WebView
        for official embeds, never InnerTube scraping. DataStore for faces and
        resume. Android TV: the same Compose graph with a d-pad focus
        overlay; Leanback is not required if we keep focusable mosaics.
      </p>
      <p className="font-mono text-xs text-subtle">
        native/android — Application, MainActivity, Navigation, NetworkModule,
        HomeScreen, LiveScreen, PlayerScreen (Media3), DataStoreFaces
      </p>
      <p>
        Both clients hit the same public mobile API this preview uses. No
        analytics SDK until store v1.1. Privacy labels: Data Not Collected.
      </p>
    </>
  );
}

function Critique() {
  return (
    <>
      <H>Visited whisco.tv with fresh eyes</H>
      <p>
        The marketing homepage is a manifesto that has not yet become a product.
        “575+ live / 16,871 titles / $0” is a press release. The browse surface
        is a single scroll of mixed live + VOD with no search, no language
        filter, no nav chrome, and eleven live tiles of which every visible
        badge says News. That is not how an expat in Hamad Town opens television.
      </p>

      <H>Keep</H>
      <ul className="list-disc space-y-1 pl-5">
        <li>The rail: free forever, no signup to watch, legal-only. This is the brand.</li>
        <li>The catalog scale and the language spread — the asset nobody else has.</li>
        <li>The real dog. Use him. Just stop writing “Woof! I’m Whisco.”</li>
        <li>Honesty about ads. Keep saying it. Then make the UI prove it.</li>
      </ul>

      <H>Change</H>
      <ul className="list-disc space-y-1 pl-5">
        <li>Organise by language/community, not by Movies/Series/Docs. The current rows are a Netflix cargo-cult on a catalog that is actually Malayalam + Turkish + Hindi + Arabic.</li>
        <li>Put a persistent nav and a search field on browse. A landing page that is also the watch UI, with one “View all,” is an unfinished app.</li>
        <li>Separate marketing site from the watching app. The manifesto can live at /; the product should open on Tonight.</li>
        <li>Poster art: YouTube hqdefault is a 4:3 letterbox. Accept it or generate letterbox-safe crops. Don’t pretend it’s a theatrical one-sheet.</li>
        <li>Live needs health + language mosaic, not a 575-item country dump starting at Bahrain TV because the database is sorted that way.</li>
      </ul>

      <H>Kill</H>
      <ul className="list-disc space-y-1 pl-5">
        <li>The paw-emoji mascot copy. It’s a luxury dog photographed well; treat him that way.</li>
        <li>“Featured on demand” as a random YouTube-title dump (What’s My Line next to Naag Bhoomi). Curation is the product.</li>
        <li>Any implication of profiles-in-the-cloud before privacy labels are settled. Faces on-device first.</li>
        <li>Stats-as-hero. Nobody loves a library for its SKU count. They love that Asianet is on and Ezel is in the next row.</li>
      </ul>

      <H>The one thing to port first</H>
      <p className="text-fg">
        Home Time on the live mosaic. It is a timezone format string and a
        language→city map. It costs nothing, requires no licensing, and it is
        the first moment the product feels like it was made for a Malayali in
        Bahrain rather than for a content CMS. Ship it on web this week; the
        apps inherit it.
      </p>

      <H>Assumption log — Phase 5</H>
      <ul className="list-disc space-y-1 pl-5">
        <li>Critique is of the public site as of 7 Sep 2026, not of the in-review store apps (those were out of scope on purpose).</li>
        <li>Catalog quality issues (What’s My Line in Trending) may be a ranking bug, not a strategy. Still a user-facing wound.</li>
      </ul>
    </>
  );
}
