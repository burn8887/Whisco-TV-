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
  {
    slug: "bollywood-classics-free",
    title: "Free Bollywood Movies Online: The Legal Way to Watch Hindi Cinema",
    h1: "Bollywood for Free, Legally: A Guide for Hindi Movie Lovers in the Gulf",
    intro:
      "Hindi cinema is the largest film industry on earth by output, and for the millions of Indians in the Gulf it is a direct line home. What many viewers do not know: thousands of Bollywood films are legally free to watch, published by the studios themselves. Whisco TV carries more than 2,500 Hindi titles from official studio channels — this guide explains what is there and how to make the most of it.",
    sections: [
      {
        heading: "Why studios give movies away free",
        paragraphs: [
          "Studios like Goldmines, Shemaroo, Rajshri, B4U and Pen own enormous film libraries, and advertising-supported streaming lets those libraries earn money forever instead of gathering dust. The studio uploads the full film to its official channel, advertising pays for it, and you watch free. It is the same bargain as television — except the catalog is tens of thousands of films deep.",
          "This is why you should never pay a pirate 'movie pack' seller: the legitimate owners are giving much of it away already, in better quality, with zero legal or malware risk.",
        ],
      },
      {
        heading: "What you will find on Whisco TV",
        paragraphs: [
          "The Hindi Cinema shelf runs from 1950s classics to recent releases — action with Akshay Kumar and Ajay Devgn, 90s romances, Salman and Shah Rukh hits, and the South-dubbed action films that dominate Hindi-speaking YouTube. Dedicated shelves for Malayalam, Tamil, Telugu and Punjabi cinema sit alongside, plus Hindi Serials for daily-soap viewers.",
          "Every title is checked automatically around the clock — if a studio pulls a film, it disappears from the catalog rather than wasting your evening with a dead link. New films are added automatically every week as studios publish them.",
        ],
      },
      {
        heading: "Tips for the best experience",
        paragraphs: [
          "Use the search box for actors or specific films — with 2,500+ Hindi titles, search is faster than scrolling. Add films to My List when you spot something interesting; your watch progress is remembered so an interrupted movie resumes where you stopped.",
          "On a phone, install the app (Android now, iPhone soon) or add whisco.tv to your home screen. On a laptop, whisco.tv works in any browser — and if your TV has a browser or casting, the big screen is one tap away.",
        ],
      },
    ],
    ctaLabel: "Browse Hindi Cinema",
    ctaHref: "/vod?collection=Hindi+Cinema",
  },
  {
    slug: "malayalam-movies-gulf",
    title: "Malayalam Movies Free Online: A Guide for Keralites in the Gulf",
    h1: "Malayalam Cinema, Free in the Gulf: From Mohanlal Classics to New Releases",
    intro:
      "No diaspora loves its cinema like Keralites love Malayalam film — and no expat community in the Gulf is prouder of its industry's golden run. From Mohanlal and Mammootty evergreens to the new-generation directors rewriting Indian cinema, Whisco TV carries close to 700 Malayalam titles, all free, all from official channels. Here is your orientation.",
    sections: [
      {
        heading: "The Gulf connection",
        paragraphs: [
          "Nearly three million Malayalis live and work in the GCC — in many Kerala households, the Gulf is simply part of the family map. Malayalam cinema knows this: Gulf-set stories from Pathemari to Aadujeevitham speak directly to the pravasi experience, and Friday releases in Dubai and Doha sell out as fast as in Kochi.",
          "Between cinema visits, the official channels of Malayalam studios and distributors publish full films legally — which is what fills our shelf. Matinee Now, Millennium, Amrita and others keep the classics and the mid-catalog available to everyone, everywhere, free.",
        ],
      },
      {
        heading: "Where to start on the shelf",
        paragraphs: [
          "For the classics: the Mohanlal and Mammootty catalogs of the 80s and 90s remain the industry's spine — comedy, drama and the films every Malayali quotes from memory. For newer sensibilities, look for the character-driven realism that made Malayalam cinema the critics' favorite industry in India.",
          "The shelf also carries Malayalam-dubbed South Indian action for family movie nights, and Kerala's TV channels stream live on the Live TV tab under the Malayalam filter — Asianet, Mathrubhumi News, Manorama and more, depending on current availability.",
        ],
      },
      {
        heading: "Watching together, at home and back home",
        paragraphs: [
          "Whisco TV is free with no account required, so recommending a film to family in Kerala is just sending a link. Progress sync, My List and the mobile apps make the nightly film-after-dinner ritual effortless — the same way you watched at home, just continued abroad.",
        ],
      },
    ],
    ctaLabel: "Browse Malayalam Cinema",
    ctaHref: "/vod?collection=Malayalam+Cinema",
  },
  {
    slug: "arabic-series-guide",
    title: "Classic Arabic Series Free Online: Khaleeji, Syrian and Lebanese Drama",
    h1: "Arabic Drama on Whisco TV: The Series the Whole Region Grew Up On",
    intro:
      "Before streaming, there was the Ramadan musalsal — and the golden decades of Kuwaiti theatre-drama, Syrian social realism and Lebanese romance that still define Arabic television. Whisco TV carries more than 300 Arabic series with over 7,000 episodes from official broadcaster channels, spanning Kuwait, Syria, Lebanon, the UAE, Jordan, Qatar and Bahrain. This guide maps the territory.",
    sections: [
      {
        heading: "The traditions on the shelf",
        paragraphs: [
          "Khaleeji drama — Kuwait above all — is the Gulf's own voice: family sagas, sharp social comedy and the theatre-trained actors whose plays and serials every Gulf household knows. Our Kuwaiti collection is the largest on the shelf at over 120 series.",
          "Syrian drama brought Arabic television its realism — Bab Al-Hara's old-Damascus courtyards became a pan-Arab Ramadan ritual, and Syrian social dramas remain the writers' room the region measures itself against. Lebanese production adds the romance and the polish, including the crime saga Al-Hayba that traveled the world.",
        ],
      },
      {
        heading: "Why these classics matter now",
        paragraphs: [
          "Arab satellite TV built a shared living-room culture across the region — an Emirati, a Jordanian and a Bahraini can quote the same Kuwaiti comedy. Broadcasters have published these libraries on their official channels to keep that heritage alive, which is exactly the legal, free source Whisco TV organizes.",
          "For younger viewers raised on subscription platforms, the shelf is a chance to meet the originals: the series your parents planned their evenings around, free and in one place.",
        ],
      },
      {
        heading: "Finding your way",
        paragraphs: [
          "Open On Demand and look for the Arabic Series & Shows shelf, or search a title directly. Series pages list episodes in broadcast order with progress remembered. Live Arabic channels — news, entertainment and religious programming from across the region — are under the Arabic filter on the Live TV tab.",
        ],
      },
    ],
    ctaLabel: "Browse Arabic Series",
    ctaHref: "/vod?collection=Arabic+Series+%26+Shows",
  },
  {
    slug: "cut-the-pirate-box",
    title: "Life After the Pirate IPTV Box: Legal Free TV for Gulf Expats",
    h1: "Cutting the Pirate Box: What Actually Works Instead",
    intro:
      "Every expat compound in the Gulf knows the ritual: someone sells you a loaded box or a Firestick 'subscription' — 10,000 channels for a few dinars a month. Then it freezes during the cricket, dies during the season finale, and the seller's number stops answering. This guide is the honest map of what replaces it: what is legally free, what genuinely requires a paid app, and how to set up a household that never depends on a pirate seller again.",
    sections: [
      {
        heading: "Why the box always fails you",
        paragraphs: [
          "Pirate IPTV services are illegal rebroadcasts. They freeze on big match nights precisely because that is when overloaded stolen streams collapse — and when rights holders hunt them hardest. The seller can vanish with your renewal money at any time, the apps are a documented malware vector, and in the UAE and other Gulf states, using them can carry real legal risk. None of this is bad luck. It is the business model.",
          "The uncomfortable truth the sellers rely on: most people never learn how much of what they watch is already legal and free. The box bundles 90% legally-free channels with 10% premium sports and charges you for the lot.",
        ],
      },
      {
        heading: "What is legally free right now",
        paragraphs: [
          "News, entertainment and general channels from India, Pakistan, Bangladesh, the Philippines, Indonesia, Nepal, Sri Lanka and across the Arab world broadcast free-to-air and stream legally without any subscription. Production houses publish full movie libraries on official channels: Goldmines and Shemaroo for Hindi cinema, HUM, ARY and Geo networks for Pakistani dramas with English subtitles, official Turkish broadcaster channels for dizi.",
          "Whisco TV exists to organize exactly this: 600+ legal live channels and 14,000+ on-demand titles in 13 languages, in one place, checked automatically around the clock — free because it is advertising-supported, the same bargain as TV back home. No box, no seller, no dish on the balcony, nothing to install beyond a browser or our free app.",
        ],
      },
      {
        heading: "What still honestly needs a paid app — and what it costs",
        paragraphs: [
          "Live premium sport is the big one: top cricket, Premier League football and major tournaments are exclusively licensed in MENA, mostly to TOD/beIN and platforms like Starzplay for cricket. If live sport matters to your household, that is the one subscription worth budgeting for — often cheaper per month than the pirate box that kept freezing anyway.",
          "Some day-one releases from Indian OTT platforms and specific catalog exclusives also stay behind their own apps. Our honest advice: pay for the one thing your family truly needs live, take everything else from the legal free layer, and you will usually spend less than the box cost — with none of the freezing.",
        ],
      },
      {
        heading: "The 15-minute household setup",
        paragraphs: [
          "On a Smart TV: open the browser to whisco.tv, or cast from your phone. On Android phones and tablets: our app is on Google Play. On iPhone: the App Store version is on its way, and Safari works today — Share, then Add to Home Screen. For the living room on a budget, any Android TV box running the official Play Store (not a 'loaded' one) does the job.",
          "Set the language filter once — Malayalam, Tamil, Urdu, Tagalog, Bahasa, Arabic, Turkish, whatever home sounds like — and the lineup is yours. Add shows to My List, and your episodes resume where you stopped. If a channel ever dies upstream, our systems remove it automatically instead of leaving you staring at a frozen screen wondering if the seller will answer this time.",
        ],
      },
    ],
    ctaLabel: "Browse Free Live TV",
    ctaHref: "/live",
  },
];
