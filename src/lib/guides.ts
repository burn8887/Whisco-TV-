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
      "Turkish dramas — dizi — have become one of the most-watched television genres on earth, and nowhere is the love stronger than in the Gulf. Every series we list plays from the show's own official channel — free, and legal. This guide explains what makes dizi special, which shows to start with, and how to find them here.",
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
          "Whisco TV brings these legitimate sources together in one place, organized by language and community and checked automatically around the clock so dead links never waste your evening. Everything plays from an official broadcaster channel or a public-domain archive; we host no video files of our own. Our apps carry a smaller, fully documented shelf — official YouTube news live, plus public-domain films from archive.org. It costs nothing because it's advertising-supported — the same model as broadcast TV back home.",
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
      "Pakistani dramas are having a golden age — tight 25–40 episode stories, powerhouse acting, and productions from HUM, ARY, GEO and Express that regularly outclass much bigger industries. Whisco TV lists full episodes from the networks' official channels, most with English subtitles.",
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
      "Hindi cinema is the largest film industry on earth by output, and for the millions of Indians in the Gulf it is a direct line home. What many viewers do not know: thousands of Bollywood films are legally free to watch, published by the studios themselves. Whisco TV lists Hindi titles published by the studios' own official channels — this guide explains what is there and how to make the most of it.",
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
          "Use the search box for actors or specific films — search is faster than scrolling. Add films to My List when you spot something interesting; your watch progress is remembered so an interrupted movie resumes where you stopped.",
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
      "No diaspora loves its cinema like Keralites love Malayalam film — and no expat community in the Gulf is prouder of its industry's golden run. From Mohanlal and Mammootty evergreens to the new-generation directors rewriting Indian cinema, Whisco TV lists Malayalam titles from the films' own official channels, all free. Here is your orientation.",
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
      "Before streaming, there was the Ramadan musalsal — and the golden decades of Kuwaiti theatre-drama, Syrian social realism and Lebanese romance that still define Arabic television. Whisco TV lists Arabic series from official broadcaster channels, spanning Kuwait, Syria, Lebanon, the UAE, Jordan, Qatar and Bahrain. This guide maps the territory.",
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
          "Whisco TV exists to organize exactly this: legal channels and on-demand titles from official broadcaster channels and public-domain archives, in one place, checked automatically around the clock — free because it is advertising-supported, the same bargain as TV back home. No box, no seller, no dish on the balcony, nothing to install beyond a browser or our free app.",
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
  {
    slug: "free-legal-hd-turkish-series-english-subtitles",
    title: "Free Legal HD Turkish Series With English Subtitles",
    h1: "Where to watch Turkish series with English subtitles — free, legal, and actually in HD",
    intro: "The complaint is always the same, and it is not subtle. You want the original Turkish track, English subtitles that were written by a human, and a picture that does not look like it was filmed through a windscreen. What the search results give you is a page of clones, a player that starts at 360p, and a pop-up that follows you to the bank app. That is not a content problem. Turkey makes more long-form drama than most countries can catalogue. It is a distribution problem.",
    sections: [
      {
        heading: "The split catalogue, without the brochure language",
        paragraphs: [
          "If you are watching from the UAE, Saudi Arabia, Bahrain, Qatar, Kuwait or Oman, these are the legal shelves that actually exist.",
          "Shahid is what most Gulf Arabic-speaking households already have. Mass-market dizi often arrive there dubbed into Arabic, sometimes the same week as Turkey. The free tier is real and ad-supported. The current season of a hit, and almost anything MBC wants to protect, sits in VIP. If your household wants Arabic audio, start here. If your household wants English, Shahid is usually the wrong tool. That is not a slight. It is what the product is for.",
          "Netflix MENA is the cleanest English-sub experience for the titles it has: original Turkish audio, official English (and usually Arabic) subtitles, stable HD. It is a subscription. It does not hold the entire historical library, and the MENA catalogue is not the Türkiye catalogue. Check the title in your country's Netflix, not in a US listicle.",
          "Official network YouTube — ATV, Star TV, Kanal D, Show, NOW, and the various TRT properties — is the largest free legal source of full episodes. Picture quality is often proper HD because the network uploaded it. English captions are the lottery. Some playlists have official CC. Some have auto-translate that turns a marriage contract into a vegetable. Some have no captions at all. Geo-blocks happen. When a network pulls a series, it disappears for a reason.",
          "tabii and other Turkish digital services sometimes offer English. Gulf availability and the free-versus-paid split change. Treat store copy as a claim to verify, not a promise.",
          "Viu MENA and OSN+ carry Turkish titles in the region. Language tracks are inconsistent. Viu marketing in the Gulf is often Arabic-first. OSN+ is paid. Neither should be sold as \"the free HD English hub\".",
          "Whisco TV sits next to those shelves, not on top of them. We index official-source Turkish series that pass embed, duration and GCC geo checks. As of early September 2026 that is 61 series, about 3,650 episodes. Most current on-demand playback is the official YouTube player inside our page: the network keeps its in-player advertising, we keep the surrounding page honest. We do not geo-unblock a pay wall, and we do not host a 360p rip with a new logo."
        ]
      },
      {
        heading: "What \"legal HD English\" actually means",
        paragraphs: [
          "Three tests, all of them boring, all of them more useful than a homepage banner.",
          "1. The file belongs to someone who is allowed to show it in your country. Official network upload, licensed streamer, or a contract. Not a message-app dump labelled 1080p.",
          "2. The picture is the network's own encode, not a camcorder pointed at a television in Izmir.",
          "3. The English track is captions or a commissioned subtitle file, not a browser auto-translate you cannot toggle off.",
          "A lot of sites fail all three and still rank for this query. That is why the query is worth answering carefully."
        ]
      },
      {
        heading: "Official YouTube, network by network",
        paragraphs: [
          "This is the matrix people keep asking for. It will rot. Re-check the channel before you trust a row.",
          "ATV (atv on YouTube) uploads full dramas and a 24-hour live stream. Historical titles such as the Kuruluş universe have lived here in long official playlists. English CC is title-dependent. Do not confuse the official ATV channel with lookalike channels that add \"English\" to the name and upload someone else's file.",
          "Star TV official uploads are strong for the network's own dizileri. Caption language varies. The live stream is Turkish domestic television, not an English product.",
          "Kanal D and Show follow the same pattern: official full episodes when the network chooses, missing seasons when a streamer paid for exclusivity.",
          "NOW (the former FOX Turkey) is the same rule with a different logo.",
          "TRT and tabii are the public-ish digital path. Some English exists. Confirm the app storefront in your GCC country before telling a cousin it is \"free on the phone\".",
          "If a title is missing from every official channel, it is usually sitting behind a paid licence — Netflix, a Turkish digital service, or a MENA streamer — not \"lost\"."
        ]
      },
      {
        heading: "When you should just pay",
        paragraphs: [
          "Pay Netflix when the title is a Netflix original or when the English-sub HD copy you want is only there. Pay Shahid VIP when the household is Arabic-first and wants this week's episode without hunting. Pay OSN+ only after you have checked that the specific series is on your country's OSN and that the subtitle toggle includes English.",
          "Do not pay a WhatsApp number for a \"Turkish + sports + Indian\" stick. That product is not a catalogue. It is a risk with a remote."
        ]
      },
      {
        heading: "What Whisco will and will not put on the shelf",
        paragraphs: [
          "We will put up an official episode that the rights holder already put on the open internet, if it plays in all six GCC states or can be hidden cleanly in the states where it does not. We will label the language track we actually have. We will not invent an English file because the search query asked for one.",
          "We will not promise same-day ATV prime time with studio English. We will not list Sen Çal Kapımı as \"free HD on Whisco\" if the only legal HD English copy this month is a paid streamer. In that case the honest page says: here is the legal paid home, here are official clips, here is what you can watch tonight instead.",
          "That last sentence is the entire brand. The pirate page will always have more titles. It will also have a player that dies in episode 17."
        ]
      },
      {
        heading: "A starting list that does not pretend to be the whole history of dizi",
        paragraphs: [
          "Use this as a way into the shelf, not as a claim that every row is free in every GCC country this week.",
          "Historical epics that official networks have long parked on YouTube — the Diriliş / Kuruluş family is the obvious Gulf example. Confirm the English CC toggle before you settle in.",
          "Completed network dramas whose official playlists are still up. These are the quiet win: no VIP clock, no \"episode available in 23 hours\".",
          "Prestige titles that belong on Netflix MENA. Watch them there. Do not watch a blurry duplicate.",
          "Arabic-dub mass-market hits that belong on Shahid. Watch them there if that is the language the room actually wants.",
          "From the Whisco Turkish shelf you can see which of those official rows currently clear a Gulf IP. The list is shorter than a pirate index and longer than \"just subscribe to everything\"."
        ]
      },
      {
        heading: "Devices, quickly",
        paragraphs: [
          "Phone and laptop: browser to the official app, or to the Turkish shelf on whisco.tv. Smart TV: install Shahid, Netflix, YouTube and (where listed) Viu or OSN from the television's own store. Fire TV: same rule — Amazon Appstore official apps, and none of the unofficial playlists. Casting a legal browser tab is less elegant than a native app and infinitely preferable to an unofficial build."
        ]
      },
      {
        heading: "The short version",
        paragraphs: [
          "Free, legal, HD, English: possible, not universal. Official YouTube is the free backbone. Netflix is the paid English backbone. Shahid is the paid-and-free Arabic backbone. Whisco is the index that refuses to launder the fourth option.",
          "Open the Turkish shelf, pick something that is actually on it, and let the 360p site keep the rest of the evening."
        ]
      }
    ],
    ctaLabel: "Browse Turkish Dizi",
    ctaHref: "/vod?collection=Turkish+Dizi"
  },
  {
    slug: "hindi-serials-firestick-uae-legal",
    title: "Hindi Serials on a Fire TV Stick in the UAE — Legally",
    h1: "How to watch Hindi serials on a Fire TV Stick in the UAE — legally, without IPTV",
    intro: "A Fire TV Stick in a Dubai apartment is not a crime scene. It is a small Android computer Amazon sells in every electronics aisle from Carrefour to Sharaf DG. The trouble starts one WhatsApp forward later, when somebody offers to \"load Indian pack\" on it for a hundred dirhams and a monthly number that will change after Eid. That pack is almost never ZEE5. It is almost never YuppTV. It is a playlist. It freezes in the last five minutes of Anupamaa, it vanishes when Amazon patches the stick, and it is the reason this query is a swamp. You can use the same stick to watch Hindi serials legally. The catalogue will be smaller than the pirate menu. It will still be there on Thursday.",
    sections: [
      {
        heading: "First distinction: the hardware is not the product",
        paragraphs: [
          "Amazon's Fire TV Stick runs the Amazon Appstore, not the full Google Play Store. That single fact explains most of the bad guides.",
          "Apps Amazon has listed for your country can be installed with the remote, updated automatically, and removed without a ceremony.",
          "Apps Amazon has not listed are simply not available in the store. Anything else involves trusting a stranger's file with the same device your Amazon account sits on.",
          "We are not going to publish that second path for serials. Not because the stick cannot do it. Because that is how a legal device becomes an IPTV client."
        ]
      },
      {
        heading: "What you can install from the Amazon Appstore in the UAE",
        paragraphs: [
          "Storefronts change. On a current UAE Fire TV the legal living-room set usually includes some combination of:",
          "YouTube — the most important free app on the stick. Official network and studio channels live here.",
          "Prime Video — already tied to many Amazon accounts. Hindi catalogue is limited compared with India; still a legal row.",
          "Netflix — paid. Some Hindi films and a thinner serials list than people expect. English subtitles are the reason mixed households keep it.",
          "Disney+ — the MENA product, not JioHotstar. Different catalogue. Useful, not a Star Plus replacement.",
          "Shahid — listed on Fire TV in the region. Arabic-first, but sitting on the stick does not make it illegal.",
          "Other licensed apps Amazon has chosen to carry (these rotate — search the store for ZEE5, YuppTV, and similar names rather than assuming a US blog is correct).",
          "If ZEE5 or YuppTV is in the Amazon Appstore for the UAE on the day you look, install it from there. If it is not, use the phone app or a Smart TV app from that company's own listing, or watch official YouTube on the stick. Do not install a modified build because a thumbnail promised no ads."
        ]
      },
      {
        heading: "JioHotstar will not become a UAE app because you own a stick",
        paragraphs: [
          "This is the sentence the VPN posts skip. JioHotstar's India service is licensed for India. Disney+ in the UAE is a different service with a different library. Pointing a Fire TV at an Indian server does not merge them. It puts your account on the wrong side of a terms-of-service line and, in practice, on the wrong side of a cat-and-mouse game the platform is better at than you are.",
          "If you already pay for JioHotstar in India, that subscription does not travel with you as a right. The honest UAE substitutes for Hindi serials are ZEE5 Global (paid, Zee-network strength), YuppTV (paid, live-channel strength), official YouTube, Netflix UAE for the titles it actually has, and the free official-source rows on Whisco.",
          "SonyLIV is the same shape of problem. If it is not offered as a licensed UAE product, a guide that starts with \"install Smart DNS\" is not a serials guide. It is an affiliate page."
        ]
      },
      {
        heading: "Official YouTube is the free serials app you already have",
        paragraphs: [
          "A surprising amount of Hindi television is published by the people who own it. Network channels upload episodes, clip shows, and sometimes full movie drops. Film studios park catalogue titles on their own channels. Quality is often HD. Geo-blocks happen; when they do, the video is not \"broken\", it is unavailable in the UAE on purpose.",
          "On a Fire TV Stick this is the whole move: open YouTube, sign into a normal Google account if you want history, subscribe to the official network channels you actually watch, and build a folder. It is less pretty than a pirate electronic programme guide. It also does not require a man called \"Support\" on Telegram.",
          "Whisco's Hindi shelf exists because those official uploads are hard to find when you are tired. We do not re-encode them. We point at them, after a geo and embed check for the six GCC states. As of early September 2026 the wider on-demand catalogue holds more than 2,500 official Hindi films plus serials and related rows. If a title fails the UAE check it is hidden, not shown as a dead player."
        ]
      },
      {
        heading: "Paid official packs — say the quiet part",
        paragraphs: [
          "If the household wants live Star Plus, Zee TV, Colors, and the rest of the India linear grid, in the evening, on the big screen, you are shopping for a licensed pack. In the Gulf that usually means YuppTV and, where the ISP still sells it, an e& or du Indian add-on. ZEE5 covers a lot of Zee-network catch-up and some live. None of those products are free, and several of them serve ads even after you pay. That complaint is in the store reviews. It is still a better complaint than a bricked stick.",
          "Lulu Exchange and similar retailers sometimes sell official ZEE5 vouchers in GCC currencies. That is a legal checkout. A screenshot of a QR code from a Facebook group is not."
        ]
      },
      {
        heading: "The stack that survives a firmware update",
        paragraphs: [
          "Do this once, on a Saturday, and then stop thinking about it.",
          "1. Reset or at least update the Fire TV Stick from Amazon's own menu. Remove any app you cannot identify.",
          "2. Install YouTube, Netflix if you use it, Prime Video if you use it, Disney+ MENA if you use it, Shahid if anyone in the room wants Arabic, and any Indian service that Amazon actually lists.",
          "3. Pay YuppTV or ZEE5 inside their official app if you want live Hindi channels. Cancel inside the same app if you do not.",
          "4. Open the Hindi shelf on whisco.tv in the Silk browser, or on a phone and cast, only if the official YouTube app is already the source.",
          "5. Leave developer options off.",
          "That is a legal Hindi living room. It will not include every India-only catch-up window. It will not include IPL unless a licensed sports app in the UAE has the match — TOD and beIN are the names to check that week, not a \"sports add-on\" inside a pirate playlist."
        ]
      },
      {
        heading: "What not to do, without the lecture",
        paragraphs: [
          "Do not install unofficial IPTV shells, \"Downloader + random code\" players, or anything whose icon is a film reel and whose developer name is three consonants. Do not buy a preloaded stick from a kiosk unless you can see the official apps and nothing else. Do not keep a VPN app on the device \"just in case Hotstar works on Fridays\".",
          "The pirate pack is larger. It is also how people lose the stick, the Amazon account, and a salary week to a page that looked like a bank."
        ]
      },
      {
        heading: "The short version",
        paragraphs: [
          "A Fire TV Stick in the UAE is a legal way to watch Hindi serials if you treat it like a licensed store. YouTube official channels and Whisco's Hindi shelf are the free layer. ZEE5 and YuppTV are the paid official layer. JioHotstar is not a UAE product. IPTV is not a serials app.",
          "Open the Hindi shelf when you want something that plays tonight without a code."
        ]
      }
    ],
    ctaLabel: "Browse Hindi Cinema",
    ctaHref: "/vod?collection=Hindi+Cinema"
  },
  {
    slug: "telugu-live-tv-dubai-apartment-no-dish",
    title: "Legal Telugu Live TV in a Dubai Apartment — No Dish",
    h1: "Legal Telugu live TV in a Dubai apartment — no dish, no IPTV box",
    intro: "Dubai buildings killed the dish for reasons that have nothing to do with Telugu television. Developers do not want a forest of arms on the elevation. Owners' associations do not want a technician on the glass. The household in International City still wants Gemini, ETV, Star Maa and Zee Telugu after a twelve-hour shift. The market answered that gap twice. Once with licensed apps and ISP add-ons. Once with a WhatsApp catalogue that claims every channel in Andhra and Telangana for the price of a shawarma. The second answer is the one that ranks. It is also the one that dies during a rainstorm in July. This page is the first answer, written for an apartment that will never have a dish.",
    sections: [
      {
        heading: "What you are actually buying when you say \"Telugu pack\"",
        paragraphs: [
          "People say \"Telugu channels\" and mean four different jobs.",
          "1. General entertainment linear — Gemini TV, ETV Telugu, Star Maa, Zee Telugu, the comedy and film sisters.",
          "2. News — TV9, NTV, ETV Telangana, the evening bulletin you watch on mute while cooking.",
          "3. Catch-up serials and web series — aha, ZEE5, YouTube official, the episode you missed on Thursday.",
          "4. New cinema — theatrical windows, Simply South / Emasala style deals, Prime or Netflix when the title landed there.",
          "A single free app that does all four, in HD, on a UAE IP, does not exist. Anyone who says it does is selling job number five: a pirate multiplex."
        ]
      },
      {
        heading: "Paid official options that work without a dish",
        paragraphs: [
          "YuppTV is the product that already occupies this query in English, and for once the occupant is legal. It sells diaspora live packs, including Telugu, into the UAE. There is an official website, an official app, and an e& prepaid billing page that has, at various times, offered YuppTV daily / weekly / monthly charges on an Etisalat number (recent public pages have listed figures on the order of AED 3.25 a day, AED 11 a week, AED 52 a month for a YuppTV channel pass — treat those as a snapshot, not a contract; check the page you are about to tap). YuppTV is not free. Store reviews complain about ads and support. It is still a licensed Telugu live path that does not require a roof.",
          "e& eLife and du have, over the years, carried Indian and Telugu linear channels inside home packages or paid add-ons. Channel line-ups move. If you already pay for eLife, look at the current Indian / Telugu list before you add a second subscription. Do not trust a 2022 PDF a cousin forwarded.",
          "ZEE5 Global is the Zee-network catch-up machine. Zee Telugu live availability is a storefront question, not a slogan. If you are mostly watching Zee serials after they air, ZEE5 is often the better spend than a full live pack. If you want Gemini at 7.30pm, it is the wrong tool.",
          "aha is the Telugu / Tamil original-series product. Gulf billing is messy. App Store reviews in Saudi and the UAE regularly mention currency and region friction. If the UAE storefront will not take your card cleanly, do not invent a workaround. Use the titles that are also on YouTube official or on another licensed app.",
          "Simply South / Emasala deals have put South Indian films onto UAE television platforms. That is cinema, not Gemini live. Useful, different job."
        ]
      },
      {
        heading: "Free official options, which are smaller and real",
        paragraphs: [
          "Official YouTube is how a lot of Telugu news and a surprising amount of promotional and catalogue video already travel. Network and studio channels upload what they are allowed to. Full current-season Gemini entertainment in free HD, 24 hours a day, is usually not in that set. News and clips often are.",
          "Free-to-air and official live streams that clear a UAE geo check can sit inside a legal live index. That is the job of whisco.tv/live and the Telugu shelf on whisco.tv: official sources only, health-checked, hidden when they die, hidden in countries where they are not cleared. As of early September 2026 Whisco carries live channels across languages and a Telugu on-demand shelf drawn from official embeds — not a pirate EPG.",
          "If a Gemini HD feed does not appear there, it is because we do not have a legal, stable, UAE-clearable source. We will not invent one to win this paragraph."
        ]
      },
      {
        heading: "Apartment setup, device by device",
        paragraphs: [
          "Smart TV (Samsung, LG, Hisense, Android TV). Install YouTube, YuppTV if you are paying for it, ZEE5 if you are paying for it, Netflix and Prime if they are already in the house. Use the television's own app store. Casting from a phone is fine. A \"TV box\" from a kiosk advertising thousands of channels is the dish's illegal cousin.",
          "Fire TV Stick. Same rule as the Hindi guide: Amazon Appstore official apps only. YuppTV or ZEE5 if listed; YouTube always; browser to whisco.tv if you must. No unofficial shells.",
          "Phone on Wi-Fi. This is how most bachelor apartments actually watch. Official apps, official YouTube, Whisco in the browser. A 4G bill will punish live TV; use the flat's Wi-Fi.",
          "eLife / du set-top. If the channel is already on the box you pay for, stop shopping. Add apps only for the gaps."
        ]
      },
      {
        heading: "What you will not get without paying",
        paragraphs: [
          "You will not get a free, legal, stable Gemini + ETV + Star Maa + Zee Telugu HD bundle that looks like a Hyderabad cable guide. You will not get every day-and-date film premiere. You will not get sports that belong to TOD or beIN.",
          "You will get a living room that does not depend on a reseller, a catalogue that can be explained to a landlord, and a free layer for the nights you do not want another subscription. You will also get the unglamorous truth about bandwidth: live HD on a shared apartment connection in summer, when every room is on a video call home, will stutter whether the source is legal or not. That is not a reason to switch to a pirate encode. It is a reason to watch the 9pm serial on Wi-Fi after the calls end."
        ]
      },
      {
        heading: "A one-evening setup",
        paragraphs: [
          "1. Decide whether anyone in the flat will pay for live general entertainment. If yes, start with YuppTV's current Telugu pack price on yupptv.com or the e& billing page, and look at eLife's present list. Pick one paid live source, not three.",
          "2. Install ZEE5 only if Zee-network catch-up is the actual habit.",
          "3. Install YouTube and subscribe to the official news channels you already name at dinner.",
          "4. Open the Telugu shelf and the live index on whisco.tv, on the TV browser or a phone. Bookmark what actually plays.",
          "5. Remove any unofficial IPTV app that came preloaded on the second-hand stick.",
          "Rights will move. When they do, a licensed app updates or a legal index hides a row. A pirate playlist just shows a spinner."
        ]
      },
      {
        heading: "The short version",
        paragraphs: [
          "No dish does not have to mean a grey box. Paid official live is YuppTV and, where offered, the ISP. Paid catch-up is ZEE5 and, when billing behaves, aha. Free official is YouTube plus the Telugu rows that survive a geo check. Whisco is that last shelf, labelled as such."
        ]
      }
    ],
    ctaLabel: "See live channels",
    ctaHref: "/live"
  },
  {
    slug: "indonesian-tv-qatar-legal",
    title: "How to Watch Indonesian TV Legally in Qatar",
    h1: "How to watch Indonesian TV legally in Qatar (and why RCTI+ usually will not open)",
    intro: "Ask an Indonesian household in Al Rayyan or Industrial Area what they miss and the answer is not \"content\". It is RCTI on Thursday, SCTV when Ikatan Cinta was on, Trans7 news at lunch, a sinetron the whole floor already knows the theme song of. The apps that carry those channels in Jakarta are RCTI+, Vidio and Vision+. The search results for \"RCTI Saudi without VPN\" are a procession of VPN blogs, because those apps were not built as Gulf products. There is no honest sentence that begins \"the one legal app for Indonesian TV in Qatar is…\" and ends with a single store icon. There is an honest stack. It is smaller. It works on a Qatar or Saudi IP without pretending to be in Kelapa Gading.",
    sections: [
      {
        heading: "Why the home apps fail here",
        paragraphs: [
          "RCTI+ is MNC's own app. In Indonesia it is the front door to RCTI, MNCTV, GTV and related VOD. Outside Indonesia it is frequently geo-restricted. That is a licensing choice, not a glitch in Ooredoo's DNS. A page that tells you to route through a server in Jakarta is teaching you to step over that choice.",
          "Vidio holds a large live and VOD Indonesian catalogue, including SCTV and other networks depending on the package. It is likewise an Indonesia-first product. Gulf IP behaviour is inconsistent and not something to promise in a headline.",
          "Vision+ is the same pattern: meaningful at home, thin documentation for Doha.",
          "None of this makes the viewer unreasonable. It makes the \"one app\" SERP a fantasy."
        ]
      },
      {
        heading: "What does work on a Qatar or KSA IP",
        paragraphs: [
          "Official YouTube. This is the backbone. Indonesian networks and production houses upload news, clips, full episodes they are allowed to clear, and music shows. When the official channel has put the file on YouTube and YouTube serves it in Qatar, that is legal television. When they have not, it is not \"hidden in a secret app\". It is not cleared.",
          "Look for the network's own channel, not a fan account with a similar name and a live-chat overlay. Picture quality follows the upload. English or Arabic subtitles are uncommon; Bahasa is the default, which is what the room usually wants.",
          "Viu MENA. Viu operates a Middle East service with a free tier and a paid tier. The MENA catalogue is not Vidio. It does include Indonesian titles at times, alongside Korean, Arabic and Turkish. App Store listings cover Gulf countries; public pricing pages have quoted Qatar in US dollars and KSA in riyals — check the storefront you are standing in. Subtitle options advertised at the store level include English, Bahasa Indonesia and Arabic, which is the rare useful detail in this niche. Viu is not \"RCTI in Doha\". It is the licensed Asian-drama app that actually installed.",
          "Netflix. Some Indonesian films and series appear in GCC Netflix catalogues. Use the Qatar or Saudi storefront, not a Jakarta screenshot. Paid.",
          "Whisco TV. We index official-source Indonesian rows that pass embed and GCC geo checks, and live channels that survive the same test. If RCTI linear is not legally embeddable in Qatar, it will not be on the shelf. If an official YouTube sinetron playlist is, it will. The Indonesian shelf and the live index both sit on whisco.tv.",
          "Hotel and employer packages sometimes include an Indonesian channel. If the compound already pays for it, that is the most boring legal win available. Ask before you shop."
        ]
      },
      {
        heading: "Sinetron, news, and sport are three licences",
        paragraphs: [
          "Bundling them is how pirate menus look generous.",
          "Sinetron and FTV. Rights sit with the production house and the first network. Catch-up may be on the official YouTube channel months later, on Vidio inside Indonesia, or on no Gulf app at all. Title-level honesty beats a platform slogan.",
          "News. Networks are often happier to put bulletins on YouTube than to clear a 24-hour entertainment feed. If you only missed the headlines, you may already be fine.",
          "Football and other live sport. Different rights again. A Gulf sports app, or nothing. Not an Indonesian catch-up login."
        ]
      },
      {
        heading: "Saudi Arabia is not a special exception",
        paragraphs: [
          "The query often comes from KSA as \"RCTI+ without VPN\". The answer does not change at the border. The app is still an Indonesia product. The legal KSA stack is still official YouTube, Viu if the Saudi storefront carries the title, Netflix if it carries the title, and any official live or VOD row that a geo check accepts. stc billing will not turn RCTI+ into a local service."
        ]
      },
      {
        heading: "A legal Smart TV setup in Doha",
        paragraphs: [
          "1. Install YouTube from the television store. Subscribe to the official network channels you recognise.",
          "2. Install Viu from the same store if you want a managed Asian-drama app with a free tier. Pay only after you have confirmed the Indonesian title is actually in the MENA catalogue.",
          "3. Install Netflix if the household already has it.",
          "4. Open whisco.tv on the TV browser for the official-source index. When the native app is out of testing, use that instead.",
          "5. Do not install RCTI+ from a file you found on a blog. Do not buy a \"7000 channel\" box in Souq Waqif and call it Vision+.",
          "Ooredoo and Vodafone Qatar are not the villain. They will carry whatever they have licensed. They will not carry a Jakarta geo-lock because a Facebook group asked nicely."
        ]
      },
      {
        heading: "A note on language",
        paragraphs: [
          "The query is often typed in English by people who watch in Bahasa. You do not need English subtitles for RCTI news. You often do need them for a mixed flat that includes a Filipino or Indian roommate on the same sofa. Viu and Netflix are the products that sometimes offer that toggle. Official YouTube rarely does. Whisco will label the track we actually have. If a row says Bahasa only, it is Bahasa only.",
          "Qatar's device reality is phones first, hotel and compound televisions second, personal Smart TVs third. A guide written for a different country starts by getting an app onto the set that the store does not carry. Start with YouTube on the phone, on Wi-Fi, on a normal account. If that already covers the news and the official uploads, you can stop. The paid app is for the gap that remains, not for the feeling of having installed something."
        ]
      },
      {
        heading: "What Whisco will admit on this subject",
        paragraphs: [
          "We will not advertise an Indonesian live grid we do not have. We will not wrap a blocked RCTI+ stream in our player and call it curation. We will keep official uploads that clear Qatar, Saudi Arabia, the UAE, Bahrain, Kuwait and Oman, and we will hide the rest. The shelf will look smaller than a pirate screenshot. It will play at midnight on a Thursday without a second app called \"Fix Buffer\".",
          "If you need this week's RCTI prime-time episode the same day as Jakarta, the legal options may be \"wait for the official upload\" or \"you cannot have it in Qatar yet\". That sentence is allowed."
        ]
      },
      {
        heading: "The short version",
        paragraphs: [
          "There is no single legal RCTI app for Qatar. VPN pages rank because the real answer is unsatisfying. Official YouTube is the free backbone. Viu MENA and Netflix are the licensed, partial, sometimes-paid overlay. Whisco is the index of official-source rows that survive a Gulf IP. RCTI+ at home stays at home."
        ]
      }
    ],
    ctaLabel: "See live channels",
    ctaHref: "/live"
  },
  {
    slug: "free-legal-arabic-series-smart-tv-gulf",
    title: "Free Legal Arabic Series on a Gulf Smart TV",
    h1: "Free legal Arabic series on a Gulf Smart TV — the stack that is not IPTV",
    intro: "The Smart TV in a Gulf living room is already full of icons. Shahid. YouTube. Netflix. Something called Dubai+. A folder named \"Kids\". And, on a surprising number of sets, an extra box the cousin installed in fifteen minutes that promises every Arabic channel including the ones that are not channels. This page is the stack without that last box. It is written for a Samsung, LG, Android TV or Hisense in the UAE, Saudi Arabia or Qatar. It assumes you want series more than you want a pirate sports multiplex. It assumes \"free\" should still mean \"the people who made this agreed you could watch it\".",
    sections: [
      {
        heading: "What free legal looks like on a television",
        paragraphs: [
          "Free legal Arabic series, in 2026, live in four places.",
          "1. Broadcaster apps with an ad-supported tier — Shahid first. Dubai+ (the service that absorbed Awaan). Pieces of STARZPLAY that still host Abu Dhabi Media leftovers after ADtv the app was retired.",
          "2. Official YouTube networks — Rotana, MBC-adjacent official uploads, channel channels that put full episodes up because that is how they now distribute them.",
          "3. FAST / TV-plus rails — Samsung TV Plus and similar free channels, including experiments such as Arabic-dubbed Indian film channels that trade press has already announced for UAE and Saudi sets. Line-ups move. The rail is legal when the set manufacturer and the channel owner both say it is.",
          "4. Indexed official-source shelves — Whisco's Arabic series row is one of those. As of early September 2026 that is 333 series, about 7,100 episodes, plus live channels that survive a six-hour health check. Playback on most on-demand titles is still the official embed. We do not pretend it is a second Shahid.",
          "Paid legal is a fifth place and it matters: Shahid VIP / VIP+, OSN+, STARZPLAY MAX, Netflix MENA. Current MBC originals, most of Ramadan, and a lot of \"I want it tonight\" television sits there. A free guide that hides that fact is a bait listicle."
        ]
      },
      {
        heading: "The apps worth installing from the television's own store",
        paragraphs: [
          "Shahid. Install it. The free tier is the largest legal Arabic AVOD product in the region. Live MBC channels sit here. A lot of catalogue series sit here. The thing people dislike — ads, the VIP wall on the episode you actually opened — is real. Pay VIP if the household watches MBC drama every night. Do not pay a third-party \"Shahid account\" on Telegram.",
          "YouTube. Second install, not twentieth. Official full episodes, classics, and clips. The search bar is chaotic, which is why an index exists.",
          "Dubai+. UAE-backed, free-leaning, local and Gulf programming. Reviews complain about subtitles and Chromecast. It is still a legal living-room app. If a title is only here, watch it here.",
          "STARZPLAY. Paid core, with some free inventory after the ADtv merger. Do not buy it for \"all Arabic series\". Buy it if the specific title or sports adjacent habit justifies it.",
          "Weyyak. Egyptian, Syrian, Lebanese and dubbed foreign mix. Useful when it works. The Android listing has gone stale for long stretches; check whether your TV store still carries a current build before you rely on it.",
          "Netflix and OSN+. Paid. Netflix for the English-sub / mixed-language night and selected Arabic originals. OSN+ for the household that already lives there. Neither is a free Arabic series app.",
          "Samsung TV Plus (on Samsung sets). Free linear. Quality and ad load vary. If Zee Alwan or a similar Arabic-dub film channel is offered on your country profile, that is a legal extra, not a replacement for Shahid.",
          "Do not install an app that calls itself \"Free Arabic IPTV\" from a file someone handed you. The television will allow it. That is not the same as the channel owner allowing it."
        ]
      },
      {
        heading: "Free versus VIP, by type rather than by slogan",
        paragraphs: [
          "This week's MBC / Shahid original. VIP, or wait. Holiday windows sometimes open a title for free; that is a campaign, not a plan.",
          "Catalogue Khaleeji comedy and older Gulf series. Mixed. Some stay in the free tier. Some rotate. Search inside Shahid before you believe a blog.",
          "Syrian and Lebanese classics. Often Weyyak or Shahid, often paid. Official YouTube holds pieces.",
          "Egyptian classics. Rotana official YouTube and Shahid carry a lot. Watch iT is an Egypt-first product and is a poor answer to \"I am in Doha\".",
          "Turkish with Arabic dub. Shahid's job. Free depth is shallower than people hope. English-sub originals are a different stack (see the Turkish guide).",
          "Live general entertainment. Shahid live, official network streams, FAST rails. Sports stay on TOD / beIN / VIP Sports. We will not blur that line.",
          "Whisco's Arabic shelf is the official-source remainder plus the rows we can legally make findable. It is a good place to start when you do not want to open a billing screen. It is a bad place to look for tonight's VIP exclusive."
        ]
      },
      {
        heading: "Smart TV notes that actually change the evening",
        paragraphs: [
          "Use the television's app store, not a guide written for a Fire Stick. Samsung and LG stores in AE / SA / QA do not carry every Play Store experiment. If Shahid is in the store, that is the build you want.",
          "Casting from a phone is legal and often more reliable than a three-year-old TV app. It is also how you watch whisco.tv on a set that does not have our native app yet. Android is in closed testing; iOS was submitted in early September 2026. Until those listings are public, the browser is the product.",
          "Profiles. One household, four languages, is the normal GCC room. Put Shahid on the set for Arabic nights. Leave YouTube signed into a profile that does not autoplay random children's product. Keep Netflix if the English-sub half of the sofa pays for it.",
          "Ads. Free Shahid has them. Free YouTube has them. Whisco's rule on our own pages is one display slot, never against the player. We cannot rewrite MBC's ad server."
        ]
      },
      {
        heading: "What to say when the cousin offers a code",
        paragraphs: [
          "\"I already have Shahid and YouTube on the TV.\" That sentence ends most of these conversations. If it does not, the longer version is: the extra box is not more television. It is someone else's unlicensed multiplex, it will need a new code next month, and it is how the set picks up a helper app you did not choose.",
          "You do not need to moralise. You need a stack that still opens after the firmware update."
        ]
      },
      {
        heading: "The short version",
        paragraphs: [
          "Install Shahid, YouTube, and the local free app your country actually operates. Pay VIP when the household is living inside MBC's current slate. Use FAST rails if your set offers them. Use the Arabic shelf and the live index on whisco.tv when you want official-source series and channels without another login. Leave the IPTV code in the chat.",
          "The legal shelf is not every series ever dubbed into Arabic. It is the series you can watch on a Tuesday without hoping the box stays kind."
        ]
      }
    ],
    ctaLabel: "Browse Arabic Series & Shows",
    ctaHref: "/vod?collection=Arabic+Series+%26+Shows"
  },
];
