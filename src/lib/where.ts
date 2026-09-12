// "Where to watch" pages — the Gulf Where-to-Watch product (v1, 5 pages).
// Each page answers ONE real content-gap query (SEO research 5 Sep 2026,
// gaps #1, #4, #8, #14, #20) with the three-column honesty format:
//   free legal · paid legal · not here (and we say so).
// Doctrine: never a VPN coupon, never an IPTV link, never a sports promise.
// Disclosed self-reference allowed (Whisco TV rows marked "ours").

export type WhereOption = {
  name: string;
  detail: string;
  ours?: boolean; // true = Whisco TV row (disclosed)
};

export type WhereGuide = {
  slug: string;
  title: string; // <title>
  h1: string;
  query: string; // the exact gap query this answers
  intro: string;
  freeLegal: WhereOption[];
  paidLegal: WhereOption[];
  notHere: WhereOption[]; // honest "you cannot get this free/legally here" rows
  verdict: string; // one-paragraph honest bottom line
  ctaLabel: string;
  ctaHref: string;
};

export const WHERE_GUIDES: WhereGuide[] = [
  {
    slug: "turkish-series-english-subtitles",
    title: "Turkish Series with English Subtitles — Free & Legal Options (2026)",
    h1: "Where to watch Turkish series with English subtitles — legally",
    query: "best free legal HD Turkish series English subtitles",
    intro:
      "If you search for Turkish dramas with English subtitles you mostly land on 360p bootleg sites buried in pop-up ads — or Telegram channels that vanish every few weeks. The frustrating truth is that a lot of dizi is already available free and legal in HD. Here is the honest map: what is genuinely free, what needs a subscription, and what simply is not available with English subtitles anywhere legal yet.",
    freeLegal: [
      { name: "Official broadcaster YouTube channels (ATV, Kanal D, Star TV, Show TV, NOW, TRT)", detail: "The broadcasters upload full episodes in HD to their own channels, free and ad-supported. English auto-captions cover many popular titles; quality varies by show. This is the single most under-used legal source on the internet." },
      { name: "Whisco TV (ours)", detail: "We organize 61 series / 3,600+ episodes (as of early September 2026) from those official channels into one catalog with resume and watchlist — free, no signup. We built this site; that is a declared interest.", ours: true },
      { name: "TRT's own platforms", detail: "TRT publishes several historical dramas with official English subtitles on its international channels and site — the cleanest EN-sub source for shows like Diriliş: Ertuğrul." },
    ],
    paidLegal: [
      { name: "Netflix", detail: "Licenses a rotating selection of dizi with professional English subtitles (and produces Turkish originals). Small catalog in MENA, but subtitle quality is the best available." },
      { name: "Shahid VIP", detail: "The largest Gulf-legal dizi catalog — but subtitles/dubs are Arabic-first. Choose it for Arabic, not English." },
      { name: "Viu", detail: "Carries selected Turkish titles in some Gulf markets, usually Arabic-subbed; occasionally English." },
    ],
    notHere: [
      { name: "Current-season episodes with same-day professional English subs", detail: "This does not legally exist for most shows. Fan-sub sites fill the gap illegally; we will not link them. Official EN subs typically lag weeks to months — or never come." },
      { name: "Every classic dizi ever aired", detail: "Rights lapse and channels remove uploads. If a show is not on any legal service, the honest answer is: it is not legally watchable right now." },
    ],
    verdict:
      "For English speakers: start with the official YouTube uploads (or our catalog of them) and accept auto-captions on most shows; pay for Netflix when a title you love is there with real subtitles. Nothing legal delivers same-day English subs for current episodes — anyone promising that is streaming pirated fan-subs.",
    ctaLabel: "Browse Turkish series free on Whisco TV",
    ctaHref: "/vod?language=Turkish",
  },
  {
    slug: "hindi-serials-firestick-uae",
    title: "Hindi Serials on Firestick in the UAE — Legal Setup, No IPTV (2026)",
    h1: "Hindi serials on a Firestick in the UAE — the legal way",
    query: "Hindi serials on Firestick legal UAE not IPTV",
    intro:
      "Search this and you get pages of grey IPTV sellers — the five-dinar boxes that freeze mid-episode and disappear when the reseller does. But a Firestick is a perfectly good legal device: it is just an app player. The question is only which apps. Here is the legal Hindi stack for a UAE household, and what each part actually costs.",
    freeLegal: [
      { name: "Official studio channels via YouTube app", detail: "Goldmines, Shemaroo, Rajshri, B4U and other studios publish thousands of full Hindi movies on their official channels — free, ad-supported, legal, in the Firestick's YouTube app." },
      { name: "Whisco TV (ours)", detail: "Open whisco.tv in the Firestick browser (or our app when it lands on stores): 600+ live channels and 16,000+ titles including a large Hindi shelf from official sources — free, no signup. We built this; declared interest.", ours: true },
      { name: "Free-to-air Hindi news & entertainment channels", detail: "Several Hindi channels broadcast free-to-air and stream openly; they appear in our live guide and in FTA apps." },
    ],
    paidLegal: [
      { name: "ZEE5 Global", detail: "The deepest legal Hindi serial catalog available on UAE IP; has a native Fire TV app and Gulf pricing." },
      { name: "JioHotstar", detail: "Largely geo-locked to India; some content appears in MENA via partners. Do not build your setup around it in the UAE — see the next column." },
      { name: "YuppTV / Watcho and similar packs", detail: "Legal multi-channel Indian TV bundles for the Gulf with Fire TV apps; compare current channel lists before paying." },
      { name: "Amazon Prime Video", detail: "Strong Hindi film catalog on the device's native store; MENA library is thinner than India's." },
    ],
    notHere: [
      { name: "Star Plus serials same-day without a subscription", detail: "Current Star content legally requires the right paid service in your region; anyone offering it 'free on Firestick' is selling pirated IPTV." },
      { name: "Hotstar-with-a-VPN as a 'legal' route", detail: "Streaming services' terms prohibit it, banks flag Indian billing from UAE cards, and platforms actively block VPN IP ranges. We do not recommend it and will not link VPN coupons." },
      { name: "Live cricket, free", detail: "IPL and international cricket rights in MENA are paid (currently with the licensed sports platforms). No legal free service carries the match — including us." },
    ],
    verdict:
      "A legal UAE Firestick Hindi setup is: YouTube app for official studio movies + one paid serial service if your household follows current shows (ZEE5 is the usual pick) + Whisco TV for free live channels and the film library. Total cost: one subscription instead of a box that breaks during the season finale.",
    ctaLabel: "Browse Hindi movies free on Whisco TV",
    ctaHref: "/vod?language=Hindi",
  },
  {
    slug: "malayalam-smart-tv-bahrain",
    title: "Malayalam TV on a Smart TV in Bahrain — Legal Options (2026)",
    h1: "The legal Malayalam stack for a Smart TV in Bahrain",
    query: "best legal Malayalam OTT for Smart TV Bahrain",
    intro:
      "Bahrain has one of the Gulf's biggest Malayali communities, and the most common living-room question is simple: how do we get Asianet serials, new Mollywood films and Malayalam news on the big TV — legally, without a dish, and without three different remotes? Here is the honest stack.",
    freeLegal: [
      { name: "Official Malayalam channels on YouTube (Smart TV app)", detail: "Several Malayalam broadcasters and studios publish full shows, films and 24/7 news streams on official channels — free and legal on any Smart TV's YouTube app." },
      { name: "Whisco TV (ours)", detail: "Our Malayalam shelf — 670+ titles from official sources, plus live Malayalam channels — plays in the Smart TV browser today and in our apps as they reach stores. Free, no signup. We built this; declared interest.", ours: true },
      { name: "Free-to-air Malayalam news channels", detail: "Malayalam news broadcasts openly; the major channels stream live legally without subscription." },
    ],
    paidLegal: [
      { name: "ManoramaMAX", detail: "The Asianet-adjacent catalog most families actually want (current serials, shows). Works in Bahrain with local billing; check the current Smart TV app availability for your TV brand." },
      { name: "Saina Play", detail: "Strong Malayalam film library targeted at the diaspora; useful complement rather than a Manorama replacement." },
      { name: "Disney+ Hotstar alternatives note", detail: "Hotstar's Malayalam content is India-locked; in Bahrain the legal paths are the diaspora services above plus film releases appearing on global platforms (Prime Video, Netflix) region by region." },
    ],
    notHere: [
      { name: "Day-and-date new Mollywood theatrical releases, free", detail: "New films legally reach OTT weeks after theatres, on paid services first. Sites offering them free during the theatrical window are pirated — every time." },
      { name: "Asianet's current serial lineup without any subscription", detail: "Current serials are the paid catalog's core value; there is no legal free route to them. We say so rather than pretend." },
    ],
    verdict:
      "For a Malayali household in Bahrain: YouTube app + Whisco TV cover news, classics and a deep free film shelf; add ManoramaMAX if the household follows current serials. That is the whole legal stack — one subscription, no dish, no box.",
    ctaLabel: "Browse Malayalam cinema free on Whisco TV",
    ctaHref: "/vod?language=Malayalam",
  },
  {
    slug: "indonesian-tv-gulf",
    title: "Indonesian TV in Qatar & Saudi Arabia — Legal Options, No VPN (2026)",
    h1: "Watching Indonesian TV in the Gulf — what is actually legal",
    query: "best legal app for Indonesian TV in Qatar / RCTI+ Saudi without VPN",
    intro:
      "For the hundreds of thousands of Indonesians working in the Gulf, the search results are a swamp: VPN ads, dead mirrors, and apps that turn out to be geo-locked after download. The real picture is simpler and partly good news — a meaningful slice of Indonesian TV is legally reachable from Qatar, Saudi Arabia and the rest of the GCC.",
    freeLegal: [
      { name: "RCTI+ (with limits)", detail: "RCTI's own app streams a portion of its content internationally, free — but live channels and some shows are Indonesia-only. Working from a Gulf IP, expect the VOD sections rather than full live TV." },
      { name: "Official Indonesian channels on YouTube", detail: "Sinetron clips and full episodes, music shows and 24/7 news streams on official broadcaster channels — legal and free everywhere." },
      { name: "Whisco TV (ours)", detail: "Our Indonesian shelf (500+ titles from official sources) plus Indonesian and international live channels, free with no signup, verified to play on Gulf IPs. We built this; declared interest.", ours: true },
    ],
    paidLegal: [
      { name: "Vidio (international access varies)", detail: "Indonesia's biggest local platform; international availability is title-by-title. Check before subscribing from a Gulf card." },
      { name: "Netflix / Prime Video Indonesian titles", detail: "Both carry growing Indonesian film and series catalogs that are watchable in the Gulf — the most friction-free paid route." },
    ],
    notHere: [
      { name: "Full Indonesian live-channel lineups (SCTV, TransTV live) on Gulf IPs", detail: "The live streams are geo-fenced to Indonesia for rights reasons. VPN workarounds violate the platforms' terms and get blocked; we will not recommend them." },
      { name: "Liga 1 football, free", detail: "Sports rights are sold separately and are paid in most territories. No legal free route from the Gulf." },
    ],
    verdict:
      "From Qatar or Saudi Arabia the honest legal stack is: official YouTube channels + RCTI+'s international sections + our free Indonesian shelf, with Netflix/Prime covering premium films. Full live home-channel lineups are geo-locked — that is a rights problem no honest service can fix from outside Indonesia.",
    ctaLabel: "Browse Indonesian titles free on Whisco TV",
    ctaHref: "/vod?language=Indonesian",
  },
  {
    slug: "arabic-series-smart-tv-gulf",
    title: "Free Arabic Series Apps for Smart TV — UAE, Saudi, Qatar (2026)",
    h1: "Arabic series on a Smart TV — free and legal, no IPTV box",
    query: "free legal Arabic series apps UAE Saudi Qatar Smart TV no IPTV",
    intro:
      "Arabic-speaking households are the one audience the pirate-box sellers chase hardest — yet Arabic TV is the easiest case for going fully legal, because so much of it is genuinely free: national broadcasters, free-to-air satellite networks and official catch-up channels. Here is the Smart TV setup that costs nothing and breaks no laws.",
    freeLegal: [
      { name: "Broadcaster catch-up apps & channels (MBC's Shahid free tier, national broadcasters)", detail: "The region's broadcasters run legal free tiers: Shahid's free catalog, plus national channels (Bahrain TV, Dubai TV, Sharjah TV, KTV, Saudi channels) streaming openly." },
      { name: "Official YouTube drama channels", detail: "Enormous libraries of classic Egyptian cinema, Khaleeji and Levantine series published by official rights-holder channels — free with ads." },
      { name: "Whisco TV (ours)", detail: "333 Arabic series / 7,100+ episodes (as of early September 2026) from official sources — Kuwaiti, Syrian, Lebanese, Emirati, Jordanian, Qatari and Bahraini drama — plus Arabic live channels. Free, no signup. We built this; declared interest.", ours: true },
    ],
    paidLegal: [
      { name: "Shahid VIP", detail: "The premium Arabic catalog: originals, current Ramadan seasons, ad-free. The one subscription that meaningfully upgrades an Arabic household's stack." },
      { name: "StarzPlay / TOD", detail: "Carry selected Arabic content alongside Western catalogs and sports; relevant if the household already pays for sports." },
    ],
    notHere: [
      { name: "Current-season Ramadan premieres, free and ad-free", detail: "The newest premium series are the paid tier's core product. Free-with-ads versions appear on official channels for many shows — but not all, and not always day-one." },
      { name: "beIN's channel package without a beIN subscription", detail: "The pirate boxes' main selling point is stolen beIN feeds. There is no legal free version of that package — from us or anyone." },
    ],
    verdict:
      "An Arabic Smart TV setup needs no box and can cost nothing: national FTA channels + official YouTube drama libraries + our organized catalog of both. Add Shahid VIP only if the household wants current premium originals ad-free. Anyone selling you a box with 'all beIN channels included' is selling stolen goods that will die mid-season.",
    ctaLabel: "Browse Arabic series free on Whisco TV",
    ctaHref: "/vod?language=Arabic",
  },
];
