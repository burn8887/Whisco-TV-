// Editorial write-ups for curated series and films, shown on /title/[slug].
//
// Publishing rule (Nov 2026 AdSense recovery plan): every entry is drafted,
// fact-checked with sources, and reviewed by a person before it is merged.
// Merging the pull request is the act of publishing — no agent publishes alone.
// A title page only carries an ad slot when it has a note (YouTube API
// Developer Policies III.G.1.d: ads need independent value beyond the embed).

export type SeriesNote = {
  headline: string;
  paragraphs: string[]; // first paragraph doubles as the meta description
  author: string; // e.g. "Whisco TV editorial team"
  reviewedOn: string; // "12 Nov 2026": set on the day a person approves it; "" while in review
  sources: { label: string; url: string }[];
};

// Keyed by Title.slug. Batch 1 (drafted 5 Nov 2026): Hercai, Aşk-ı Memnu,
// Kuruluş: Osman. Set reviewedOn when Ali approves the pull request.
const WIKI = "Wikipedia";
export const SERIES_NOTES: Record<string, SeriesNote> = {
  hercai: {
    headline: "Hercai: a revenge marriage that becomes a love story",
    paragraphs: [
      "Hercai is a Turkish romantic drama that ran on ATV from March 2019 to April 2021, over three seasons and 69 episodes. Miran (Akın Akınözü) courts and marries Reyyan (Ebru Şahin) to shame her family, then finds that he truly loves her.",
      "The engine of the story is a long feud between the Aslanbey and Şadoğlu families. Miran's grandmother Azize raised him to take revenge, and much of the drama comes from how slowly he and Reyyan see what that has cost them. The series was shot in Midyat, the old stone town in south-eastern Turkey, and its streets and rooftops feel like a character of their own.",
      "Expect the Turkish prime-time format: most episodes run well past two hours, so one episode is a full evening. Whisco lists the episodes ATV has published on its official channel. A few, such as 16 to 19, are not there, so the list skips them rather than linking to copies.",
      "It is a good first dizi if you want a slow-burn romance with a family feud at its heart, and a natural next step after Kara Sevda. ATV sold the series widely abroad, and Telemundo began airing it in the United States in June 2021.",
    ],
    author: "Whisco TV editorial team",
    reviewedOn: "",
    sources: [{ label: `${WIKI}: Hercai`, url: "https://en.wikipedia.org/wiki/Hercai" }],
  },
  "ask-i-memnu-forbidden-love": {
    headline: "Aşk-ı Memnu: a classic novel moved to a Bosphorus mansion",
    paragraphs: [
      "Aşk-ı Memnu (Forbidden Love) ran on Kanal D from September 2008 to June 2010, in two seasons and 79 episodes. It moves Halit Ziya Uşaklıgil's 1899 novel of the same name from late-Ottoman Istanbul to the present day.",
      "Adnan Ziyagil (Selçuk Yöntem), a wealthy widower, marries the much younger Bihter (Beren Saat). Bihter then falls for Behlül (Kıvanç Tatlıtuğ), the young relative Adnan raised as family, and the household on the Bosphorus slowly comes apart. The tension lies in what each character knows, and when.",
      "This is domestic drama rather than action: long conversations, loaded silences and strong performances from the whole cast. Episodes were first broadcast at around 90 minutes, shorter than most modern dizi.",
      "Start here if you prefer character-driven stories to plot twists. Whisco plays the episodes the broadcaster publishes on its official channel, in Turkish; YouTube's caption menu shows subtitles where the channel has added them.",
    ],
    author: "Whisco TV editorial team",
    reviewedOn: "",
    sources: [{ label: `${WIKI}: Aşk-ı Memnu (2008 TV series)`, url: "https://en.wikipedia.org/wiki/A%C5%9Fk-%C4%B1_Memnu_(2008_TV_series)" }],
  },
  "kurulus-osman": {
    headline: "Kuruluş: Osman: the founding of the Ottoman state, told as a saga",
    paragraphs: [
      "Kuruluş: Osman is a Turkish historical drama that premiered on ATV on 20 November 2019. Created by Mehmet Bozdağ and produced by Bozdağ Film, it follows Osman Bey (Burak Özçivit), son of Ertuğrul and founder of the Ottoman state.",
      "It picks up the story of Diriliş: Ertuğrul, which aired on TRT 1 from 2014 to 2019. The Kayı tribe is no longer only surviving; it is becoming a state, while rival beys and Byzantine lords pull the other way. Battles are frequent, but so are council scenes and family politics.",
      "It is fiction built on history, not a documentary, and it dramatises events and people freely. Episodes are long, typically two to two and a half hours, so it suits an evening at a time.",
      "Viewers who finished Diriliş: Ertuğrul can carry straight on here. The series has also aired in Pakistan on Geo Entertainment. Whisco plays the episodes ATV publishes on its official channel.",
    ],
    author: "Whisco TV editorial team",
    reviewedOn: "",
    sources: [
      { label: `${WIKI}: Kuruluş: Osman season 1`, url: "https://en.wikipedia.org/wiki/Kurulu%C5%9F:_Osman_season_1" },
      { label: `${WIKI}: Kuruluş: Osman season 2`, url: "https://en.wikipedia.org/wiki/Kurulu%C5%9F:_Osman_season_2" },
    ],
  },
};
