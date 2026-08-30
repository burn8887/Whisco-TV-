// Original editorial guides — real written content for the communities we
// serve. These exist for viewers first (genuinely useful orientation pages)
// and are also the site's answer to "low value content": unique, substantial,
// human-readable pages that no other site has.

export type Guide = {
  slug: string;
  title: string;
  h1: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  ctaLabel: string;
  ctaHref: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "turkish-series-guide",
    title: "The Complete Guide to Turkish Series (Dizi) on Whisco TV",
    h1: "Turkish Series on Whisco TV: What to Watch and Where to Start",
    intro:
      "Turkish dramas — dizi — have become one of the most-watched television genres on earth, and nowhere is the love stronger than in the Gulf. Whisco TV carries more than 50 series with thousands of full episodes, all free, all from the shows' official channels. This guide explains what makes dizi special, which shows to start with, and how to find them here.",
    sections: [
      {
        heading: "Why Turkish drama conquered the Gulf",
        paragraphs: [
          "Dizi episodes are long — often two hours or more — and built around family, honor, love and sacrifice, themes that resonate deeply with Arab and South Asian audiences. Dubbed and subtitled versions have aired on Gulf satellite channels since the late 2000s, and shows like Noor (Gümüş) became cultural phenomena from Riyadh to Manama.",
          "Unlike Western seasons of 8–10 episodes, a single dizi can run 30–100+ episodes, making it a nightly ritual rather than a weekend binge. That rhythm — an episode with dinner, every night — is exactly how millions of households in the region watch television.",
        ],
      },
      {
        heading: "Where to start: five essential series",
        paragraphs: [
          "Aşk-ı Memnu (Forbidden Love) is the classic — the 2008 adaptation of Halid Ziya's novel remains the most iconic dizi ever made, and its finale is still one of the most-watched episodes in Turkish history.",
          "Ezel is the revenge masterpiece: a man betrayed by his closest friends returns years later with a new face and a plan. If you like Prison Break or The Count of Monte Cristo, start here.",
          "Kuruluş Osman is the Ottoman epic — battles, brotherhood and empire-founding, hugely popular with viewers from Pakistan to Palestine. Esaret (Redemption) is the daily drama that swept the Arab world with its captive-turned-love story. And Kara Sevda (Endless Love) won the International Emmy — the only dizi ever to do so.",
        ],
      },
      {
        heading: "How to watch on Whisco TV",
        paragraphs: [
          "Open On Demand and the Turkish Dizi shelf is the first row — every series page lists seasons and episodes in order, and your progress is remembered so you can continue where you stopped.",
          "Episodes play from the broadcasters' official channels, which means production-quality video and no shady streams. Some series include English or Arabic subtitles; for others, the player's caption settings offer auto-translated subtitles in dozens of languages.",
        ],
      },
    ],
    ctaLabel: "Browse Turkish Dizi",
    ctaHref: "/vod?collection=Turkish+Dizi",
  },
  {
    slug: "free-tv-for-expats-gulf",
    title: "How Expats in the Gulf Can Watch Home TV for Free",
    h1: "TV From Home, Free in the Gulf: The Honest Guide",
    intro:
      "More than 30 million expatriates live in the GCC — Indians, Pakistanis, Bangladeshis, Filipinos, Indonesians, Nepalis, Sri Lankans, Arabs from across the region. Everyone misses TV from home. This guide explains the legitimate free options — and why you never need to pay a 'subscription' to a pirate IPTV seller again.",
    sections: [
      {
        heading: "The trap to avoid: pirate IPTV subscriptions",
        paragraphs: [
          "In every Gulf expat community, sellers offer '10,000 channels for 5 dinars a month'. These services are illegal rebroadcasts: they can vanish overnight with your money, their apps are a common malware vector, and using them can put you on the wrong side of local law. The give-away is always the same — if someone charges money for channels they obviously don't own, walk away.",
          "The good news: an enormous amount of home-country television is legally free. Broadcasters publish free-to-air streams and official channels because they want their diaspora audiences.",
        ],
      },
      {
        heading: "What's legally free right now",
        paragraphs: [
          "News and general entertainment from most home countries broadcasts free-to-air: Indian, Pakistani, Bangladeshi, Filipino, Indonesian, Nepali, Sri Lankan and Arabic channels stream legally without any subscription. Production houses like Goldmines and Shemaroo publish full Bollywood movies on their official channels; HUM, ARY and GEO do the same for Pakistani dramas — with English subtitles.",
          "Whisco TV brings these legitimate sources together in one place: 500+ live channels and 14,000+ on-demand titles, organized by language and community, checked automatically around the clock so dead links never waste your evening. It costs nothing because it's advertising-supported — the same model as broadcast TV back home.",
        ],
      },
      {
        heading: "Watching on your phone, TV and laptop",
        paragraphs: [
          "whisco.tv works in any browser. On Android, our app is arriving on Google Play, and the site can be installed today from Chrome's menu (Add to Home Screen). On iPhone, Safari's Share → Add to Home Screen does the same. Nothing to pay, nothing to configure, no dish on the balcony.",
        ],
      },
    ],
    ctaLabel: "Browse Live TV",
    ctaHref: "/live",
  },
  {
    slug: "pakistani-dramas-guide",
    title: "Pakistani Dramas on Whisco TV: A Starter Guide",
    h1: "Pakistani Dramas, Free and Subtitled: Where to Begin",
    intro:
      "Pakistani dramas are having a golden age — tight 25–40 episode stories, powerhouse acting, and productions from HUM, ARY, GEO and Express that regularly outclass much bigger industries. Whisco TV carries over a thousand full episodes from the networks' official channels, most with English subtitles.",
    sections: [
      {
        heading: "Why Pakistani dramas are different",
        paragraphs: [
          "Where other industries stretch stories across years, Pakistani serials say what they came to say and end — usually inside 40 episodes. Writing drives everything: family politics, class, marriage, faith and ambition told with a realism that made shows like Humsafar and Zindagi Gulzar Hai beloved far beyond Pakistan, Kaun kisi ka in every Urdu-speaking household in the Gulf.",
          "Because the networks publish full episodes on their official channels with English subtitles, this is also one of the most accessible drama traditions for non-Urdu speakers.",
        ],
      },
      {
        heading: "How to watch here",
        paragraphs: [
          "Open On Demand and find the Pakistani Dramas shelf — episodes come straight from HUM, ARY Digital, HAR PAL GEO, Express and Green TV official channels. Look for [Eng Sub] in episode titles for subtitled runs. Live channels from Pakistan are on the Live TV tab under the Urdu filter.",
        ],
      },
    ],
    ctaLabel: "Browse Pakistani Dramas",
    ctaHref: "/vod?collection=Pakistani+Dramas",
  },
];
