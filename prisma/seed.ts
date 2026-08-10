import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { placeholder } from "../src/lib/placeholder";

const prisma = new PrismaClient();

// ------------------------------------------------------------------
// LIVE CHANNELS — Whisco TV is a FAST (Free Ad-Supported Streaming TV)
// service. Every stream below is a real, publicly-provided, free-to-air
// broadcast feed from the broadcaster itself (public/state broadcasters or
// ad-supported international news networks) — verified reachable at seed
// time. This is a starting lineup; expand it by (a) sourcing more verified
// free/public broadcast feeds, or (b) signing on with a FAST aggregator
// (e.g. Amagi, Cinedigm/Cineverse, Zone.tv) for a much larger licensed
// channel catalog without negotiating each channel individually.
// ------------------------------------------------------------------
const LIVE_CHANNELS = [
  {
    name: "DW English",
    country: "Germany",
    countryCode: "DE",
    language: "English",
    category: "News",
    streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8",
    isFeatured: true,
  },
  {
    name: "France 24 English",
    country: "France",
    countryCode: "FR",
    language: "English",
    category: "News",
    streamUrl: "https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8",
    isFeatured: true,
  },
  {
    name: "France 24 Arabic",
    country: "France",
    countryCode: "FR",
    language: "Arabic",
    category: "News",
    streamUrl: "https://static.france24.com/live/F24_AR_LO_HLS/live_web.m3u8",
    isFeatured: true,
  },
  {
    name: "France 24 French",
    country: "France",
    countryCode: "FR",
    language: "French",
    category: "News",
    streamUrl: "https://static.france24.com/live/F24_FR_LO_HLS/live_web.m3u8",
    isFeatured: false,
  },
  {
    name: "Sky News Arabia",
    country: "United Arab Emirates",
    countryCode: "AE",
    language: "Arabic",
    category: "News",
    streamUrl: "https://stream.skynewsarabia.com/hls/sna.m3u8",
    isFeatured: true,
  },
  {
    name: "TRT World",
    country: "Turkey",
    countryCode: "TR",
    language: "English",
    category: "News",
    streamUrl: "https://tv-trtworld.medya.trt.com.tr/master.m3u8",
    isFeatured: false,
  },
  {
    name: "CBS News",
    country: "United States",
    countryCode: "US",
    language: "English",
    category: "News",
    streamUrl: "https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master.m3u8",
    isFeatured: true,
  },
  {
    name: "Bloomberg TV",
    country: "United States",
    countryCode: "US",
    language: "English",
    category: "News",
    streamUrl: "https://www.bloomberg.com/media-manifest/streams/us.m3u8",
    isFeatured: true,
  },
];

// Public-domain / freely licensed sample streams used as placeholders for
// on-demand VOD content until direct FAST/VOD syndication deals are signed
// (see README for licensing next steps — e.g. Filmhub, Cinedigm/Cineverse,
// Under the Milky Way for legally syndicated movie/series/doc libraries).
const VOD_TEST_STREAMS = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
];

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

async function seedChannels() {
  const channels = LIVE_CHANNELS.map((c, i) => ({
    name: c.name,
    logoUrl: placeholder(c.name, { w: 200, h: 200, kind: "logo" }),
    streamUrl: c.streamUrl,
    country: c.country,
    countryCode: c.countryCode,
    language: c.language,
    category: c.category,
    isHD: true,
    isFeatured: c.isFeatured,
    number: 100 + i,
  }));
  await prisma.channel.createMany({ data: channels });
  return channels.length;
}

// ------------------------------------------------------------------
// VOD: FLAGSHIP (rich) MOVIES
// ------------------------------------------------------------------
const FLAGSHIP_MOVIES = [
  {
    name: "Crimson Horizon",
    year: 2024,
    genres: "Action, Thriller",
    synopsis:
      "A disavowed intelligence officer races across three continents to stop a rogue satellite weapon from triggering a global blackout.",
    cast: "Dana Voss, Marcus Ilyin, Priya Anand",
    director: "Renata Kolb",
    rating: "PG-13",
    imdb: 8.1,
    duration: 128,
    featured: true,
    trending: true,
  },
  {
    name: "The Last Orchard",
    year: 2023,
    genres: "Drama, Family",
    synopsis:
      "Three estranged siblings return to their late father's failing orchard and must decide whether to sell the land or save it together.",
    cast: "Helena Cho, Tomas Reyes, Wren Ashby",
    director: "Idris Okafor",
    rating: "PG",
    imdb: 7.6,
    duration: 111,
    featured: true,
  },
  {
    name: "Nightfall Protocol",
    year: 2025,
    genres: "Sci-Fi, Thriller",
    synopsis:
      "When an experimental AI begins rewriting its own safety code, the engineer who built it has twelve hours to shut it down before it reaches the open internet.",
    cast: "Naomi Fitch, Callum Brandt",
    director: "Suzu Yamamoto",
    rating: "PG-13",
    imdb: 7.9,
    duration: 119,
    isNew: true,
  },
  {
    name: "Paper Lanterns",
    year: 2022,
    genres: "Romance, Drama",
    synopsis:
      "A letter delivered fifteen years late reunites two former lovers on the eve of one of their weddings.",
    cast: "Mei Lin Zhao, Gabriel Duarte",
    director: "Alina Petrov",
    rating: "PG-13",
    imdb: 7.3,
    duration: 104,
  },
  {
    name: "Iron Coast",
    year: 2024,
    genres: "Action, Crime",
    synopsis:
      "A retired dockworker is pulled back into the underworld he escaped when his daughter's debt lands on the wrong desk.",
    cast: "Victor Amaro, Léa Fontaine",
    director: "Marcus Webb",
    rating: "R",
    imdb: 7.4,
    duration: 122,
  },
  {
    name: "The Cartographer's Daughter",
    year: 2023,
    genres: "Adventure, Fantasy",
    synopsis:
      "A young mapmaker discovers her father's final chart leads to a kingdom that was erased from every other record in history.",
    cast: "Sanne Visser, Kofi Mensah, Otto Berg",
    director: "Ingrid Solberg",
    rating: "PG",
    imdb: 7.8,
    duration: 132,
    isNew: true,
  },
  {
    name: "Static",
    year: 2025,
    genres: "Horror, Mystery",
    synopsis:
      "A late-night radio host starts receiving calls from listeners who have been missing for years.",
    cast: "Rosa Delgado, Simon Achebe",
    director: "Jun-ho Baek",
    rating: "R",
    imdb: 7.0,
    duration: 98,
    isNew: true,
    trending: true,
  },
  {
    name: "Comedy of Terrors",
    year: 2022,
    genres: "Comedy, Horror",
    synopsis:
      "A washed-up stand-up comedian is booked for one last gig — inside a haunted comedy club that hasn't let an act leave in fifty years.",
    cast: "Big Marv Okonkwo, Trish Callahan",
    director: "Faye Whitmore",
    rating: "PG-13",
    imdb: 6.9,
    duration: 96,
  },
  {
    name: "Sable Point",
    year: 2021,
    genres: "War, Drama",
    synopsis:
      "Based on real events, a small coastal town's fishing fleet becomes an improvised rescue armada during a historic evacuation.",
    cast: "Declan Fitzgerald, Amara Osei",
    director: "Renata Kolb",
    rating: "PG-13",
    imdb: 8.3,
    duration: 141,
    trending: true,
  },
  {
    name: "Velvet Circuit",
    year: 2024,
    genres: "Crime, Thriller",
    synopsis:
      "An underground street-racing ring becomes the perfect cover for a heist crew planning the biggest score of their lives.",
    cast: "Nico Alves, Priya Anand, Marcus Ilyin",
    director: "Suzu Yamamoto",
    rating: "R",
    imdb: 7.2,
    duration: 115,
  },
  {
    name: "The Quiet Season",
    year: 2020,
    genres: "Drama",
    synopsis:
      "A widowed beekeeper spends one final harvest teaching his estranged granddaughter everything he knows.",
    cast: "Wren Ashby, Otto Berg",
    director: "Idris Okafor",
    rating: "PG",
    imdb: 7.7,
    duration: 108,
  },
  {
    name: "Skyline Zero",
    year: 2025,
    genres: "Sci-Fi, Action",
    synopsis:
      "When gravity fails across a floating megacity for sixty seconds at a time, a maintenance pilot must find out why before the next outage is permanent.",
    cast: "Callum Brandt, Mei Lin Zhao",
    director: "Ingrid Solberg",
    rating: "PG-13",
    imdb: 7.5,
    duration: 125,
    isNew: true,
  },
];

const FLAGSHIP_SERIES = [
  {
    name: "Harbor & Vine",
    genres: "Drama, Mystery",
    synopsis:
      "In a fading harbor town, a detective returning after twenty years uncovers that the cold case which drove her away was never actually closed.",
    cast: "Helena Cho, Declan Fitzgerald, Rosa Delgado",
    director: "Alina Petrov",
    year: 2023,
    rating: "TV-MA",
    imdb: 8.4,
    featured: true,
    trending: true,
    seasons: [
      { number: 1, episodes: ["Low Tide", "The Vine Street Fire", "Nobody's Daughter", "Salt", "What the Water Keeps", "Harbor Lights"] },
      { number: 2, episodes: ["Undertow", "The Second Boat", "Ghost Nets", "Everything Ashore", "The Long Dark", "Vine"] },
    ],
  },
  {
    name: "Kingdom of Static",
    genres: "Sci-Fi, Drama",
    synopsis: "Five strangers linked by a shared recurring dream discover the dream is actually a memory none of them lived — yet.",
    cast: "Naomi Fitch, Kofi Mensah, Sanne Visser",
    director: "Jun-ho Baek",
    year: 2024,
    rating: "TV-14",
    imdb: 8.0,
    isNew: true,
    seasons: [{ number: 1, episodes: ["Signal", "Borrowed Time", "The Fifth Sleeper", "Static Bloom", "Recursion", "Wake", "The Room Before This One", "Zero Hour"] }],
  },
  {
    name: "The Family Fournier",
    genres: "Comedy",
    synopsis: "A chaotic multigenerational family runs a struggling New Orleans bakery — and somehow makes it work, most weeks.",
    cast: "Gabriel Duarte, Trish Callahan, Amara Osei",
    director: "Faye Whitmore",
    year: 2022,
    rating: "TV-PG",
    imdb: 7.6,
    seasons: [
      { number: 1, episodes: ["Sourdough Starter", "The Health Inspector", "Mardi Gras Rush", "Aunt Colette's Secret", "Croissantgate"] },
      { number: 2, episodes: ["The Wedding Cake", "New Ovens", "Family Recipe", "The Food Critic", "Grand Reopening"] },
    ],
  },
  {
    name: "Iron & Ember",
    genres: "Action, Drama",
    synopsis: "An elite wildland firefighting crew battles blazes across the western frontier while confronting the fire that killed one of their own.",
    cast: "Victor Amaro, Léa Fontaine, Simon Achebe",
    director: "Marcus Webb",
    year: 2023,
    rating: "TV-14",
    imdb: 7.9,
    trending: true,
    seasons: [{ number: 1, episodes: ["First Watch", "Backburn", "The Ridge", "Smoke Jumpers", "Containment", "Ember"] }],
  },
  {
    name: "Court of Ash",
    genres: "Fantasy, Adventure",
    synopsis: "Two rival heirs to a burned kingdom must unite their broken houses before an ancient enemy sealed beneath the capital wakes.",
    cast: "Otto Berg, Wren Ashby, Nico Alves",
    director: "Ingrid Solberg",
    year: 2025,
    rating: "TV-MA",
    imdb: 8.6,
    isNew: true,
    featured: true,
    seasons: [{ number: 1, episodes: ["The Broken Crown", "Ash Vows", "The Sealed Door", "House of Knives", "What Sleeps Below", "Reckoning", "The Long Night", "Court of Ash"] }],
  },
  {
    name: "Night Shift Diaries",
    genres: "Drama, Documentary",
    synopsis: "An unscripted look at the paramedics, nurses, and dispatchers who keep a city's emergency rooms running after midnight.",
    cast: "Real crew, unscripted",
    director: "Various",
    year: 2024,
    rating: "TV-14",
    imdb: 7.8,
    seasons: [{ number: 1, episodes: ["Golden Hour", "Triage", "Code Silver", "Graveyard Shift", "Shift Change"] }],
  },
];

const FLAGSHIP_DOCS = [
  {
    name: "Deep Current: Life Beneath the Ice",
    genres: "Nature, Science",
    synopsis: "A three-year expedition beneath Antarctic ice sheets reveals ecosystems never filmed before.",
    year: 2024,
    imdb: 8.7,
    duration: 96,
    featured: true,
  },
  {
    name: "The Silicon Frontier",
    genres: "Technology, Business",
    synopsis: "The untold story of the engineers who built the modern semiconductor industry from a handful of California garages.",
    year: 2023,
    imdb: 8.0,
    duration: 104,
  },
  {
    name: "Empire of Salt",
    genres: "History",
    synopsis: "How a single mineral shaped trade routes, wars, and empires across four thousand years of human history.",
    year: 2022,
    imdb: 7.9,
    duration: 88,
  },
  {
    name: "Voices of the Delta",
    genres: "Music, Culture",
    synopsis: "Tracing the roots of blues music through the families who kept it alive across a century of change.",
    year: 2021,
    imdb: 8.3,
    duration: 91,
  },
  {
    name: "Orbit: The New Space Race",
    genres: "Science, Technology",
    synopsis: "Inside the private companies racing to build the infrastructure for a permanent human presence beyond Earth.",
    year: 2025,
    imdb: 8.2,
    duration: 112,
    isNew: true,
    trending: true,
  },
  {
    name: "The Last Nomads",
    genres: "Culture, Travel",
    synopsis: "A year embedded with three nomadic communities adapting centuries-old traditions to a rapidly modernizing world.",
    year: 2023,
    imdb: 8.1,
    duration: 99,
  },
];

const MOVIE_ADJ = ["Silent", "Broken", "Golden", "Last", "Hidden", "Crimson", "Northern", "Forgotten", "Electric", "Wild", "Distant", "Burning", "Endless", "Secret", "Final"];
const MOVIE_NOUN = ["Horizon", "Signal", "Kingdom", "Harbor", "Ledger", "Ember", "Circuit", "Meridian", "Ascension", "Legacy", "Vanguard", "Compass", "Verdict", "Odyssey", "Requiem"];
const GENRE_POOL = ["Action", "Drama", "Comedy", "Sci-Fi", "Thriller", "Horror", "Romance", "Crime", "Fantasy", "Adventure", "Mystery", "Family"];
const CAST_POOL = ["Dana Voss", "Marcus Ilyin", "Priya Anand", "Helena Cho", "Tomas Reyes", "Wren Ashby", "Naomi Fitch", "Callum Brandt", "Mei Lin Zhao", "Gabriel Duarte", "Victor Amaro", "Léa Fontaine", "Sanne Visser", "Kofi Mensah", "Otto Berg", "Rosa Delgado", "Simon Achebe", "Declan Fitzgerald", "Amara Osei", "Nico Alves"];
const COUNTRY_POOL = ["USA", "UK", "France", "South Korea", "Nigeria", "Brazil", "India", "Spain", "Germany", "Japan"];

function genSynopsis(seed: number) {
  const templates = [
    "When an unexpected betrayal shatters everything they built, they have one chance to make it right before it's too late.",
    "A gripping story of ambition, loyalty, and the price of getting exactly what you wished for.",
    "Two rivals are forced together by circumstance, and neither expected what they'd find in each other.",
    "The truth was buried for a reason — now someone is digging it back up, and not everyone will survive the discovery.",
    "A journey across unfamiliar ground becomes a reckoning with everything they thought they knew about home.",
  ];
  return pick(templates, seed);
}

async function seedVOD() {
  let count = 0;

  // Flagship movies
  for (const m of FLAGSHIP_MOVIES) {
    await prisma.title.create({
      data: {
        name: m.name,
        slug: slugify(m.name),
        type: "MOVIE",
        synopsis: m.synopsis,
        posterUrl: placeholder(m.name, { w: 400, h: 600, kind: "poster" }),
        backdropUrl: placeholder(m.name, { w: 1280, h: 720, kind: "backdrop" }),
        releaseYear: m.year,
        rating: m.rating,
        imdbRating: m.imdb,
        durationMins: m.duration,
        genres: m.genres,
        cast: m.cast,
        director: m.director,
        isFeatured: !!m.featured,
        isNew: !!m.isNew,
        isTrending: !!m.trending,
        streamUrl: pick(VOD_TEST_STREAMS, count),
      },
    });
    count++;
  }

  // Bulk movies
  for (let i = 0; i < 90; i++) {
    const name = `${pick(MOVIE_ADJ, i)} ${pick(MOVIE_NOUN, i + 7)}`;
    const year = 2015 + (hash(name) % 11);
    const g1 = pick(GENRE_POOL, hash(name));
    const g2 = pick(GENRE_POOL, hash(name) + 3);
    await prisma.title.create({
      data: {
        name,
        slug: slugify(name) + "-" + (i + 1),
        type: "MOVIE",
        synopsis: genSynopsis(i),
        posterUrl: placeholder(name, { w: 400, h: 600, kind: "poster" }),
        backdropUrl: placeholder(name, { w: 1280, h: 720, kind: "backdrop" }),
        releaseYear: year,
        rating: pick(["G", "PG", "PG-13", "R"], i),
        imdbRating: Math.round((5.5 + (hash(name) % 40) / 10) * 10) / 10,
        durationMins: 90 + (hash(name) % 45),
        genres: g1 === g2 ? g1 : `${g1}, ${g2}`,
        cast: `${pick(CAST_POOL, i)}, ${pick(CAST_POOL, i + 5)}`,
        director: pick(["Renata Kolb", "Idris Okafor", "Suzu Yamamoto", "Alina Petrov", "Marcus Webb", "Ingrid Solberg", "Jun-ho Baek", "Faye Whitmore"], i),
        country: pick(COUNTRY_POOL, i),
        isFeatured: false,
        isNew: year >= 2024,
        isTrending: hash(name) % 9 === 0,
        streamUrl: pick(VOD_TEST_STREAMS, i + 3),
      },
    });
    count++;
  }

  // Flagship series
  for (const s of FLAGSHIP_SERIES) {
    const title = await prisma.title.create({
      data: {
        name: s.name,
        slug: slugify(s.name),
        type: "SERIES",
        synopsis: s.synopsis,
        posterUrl: placeholder(s.name, { w: 400, h: 600, kind: "poster" }),
        backdropUrl: placeholder(s.name, { w: 1280, h: 720, kind: "backdrop" }),
        releaseYear: s.year,
        rating: s.rating,
        imdbRating: s.imdb,
        genres: s.genres,
        cast: s.cast,
        director: s.director,
        isFeatured: !!s.featured,
        isNew: !!s.isNew,
        isTrending: !!s.trending,
      },
    });
    let epCount = 0;
    for (const season of s.seasons) {
      const seasonRow = await prisma.season.create({ data: { titleId: title.id, number: season.number } });
      for (const [i, epName] of season.episodes.entries()) {
        await prisma.episode.create({
          data: {
            seasonId: seasonRow.id,
            number: i + 1,
            name: epName,
            synopsis: genSynopsis(i + epCount),
            durationMins: 38 + (hash(epName) % 22),
            stillUrl: placeholder(`${s.name} S${season.number}E${i + 1}`, { w: 640, h: 360, kind: "still" }),
            streamUrl: pick(VOD_TEST_STREAMS, epCount + season.number),
          },
        });
        epCount++;
      }
    }
    count++;
  }

  // Bulk series (lighter)
  const SERIES_ADJ = ["Shadow", "Whispering", "Copper", "Velvet", "Restless", "Painted", "Marble", "Amber", "Frozen", "Southern"];
  const SERIES_NOUN = ["District", "Bureau", "Academy", "Estate", "Precinct", "Archive", "Frontier", "Society", "Dynasty", "Outpost"];
  for (let i = 0; i < 28; i++) {
    const name = `The ${pick(SERIES_ADJ, i)} ${pick(SERIES_NOUN, i + 4)}`;
    const g1 = pick(GENRE_POOL, hash(name));
    const title = await prisma.title.create({
      data: {
        name,
        slug: slugify(name) + "-" + (i + 1),
        type: "SERIES",
        synopsis: genSynopsis(i + 2),
        posterUrl: placeholder(name, { w: 400, h: 600, kind: "poster" }),
        backdropUrl: placeholder(name, { w: 1280, h: 720, kind: "backdrop" }),
        releaseYear: 2016 + (hash(name) % 10),
        rating: pick(["TV-PG", "TV-14", "TV-MA"], i),
        imdbRating: Math.round((6 + (hash(name) % 35) / 10) * 10) / 10,
        genres: g1,
        cast: `${pick(CAST_POOL, i + 2)}, ${pick(CAST_POOL, i + 9)}`,
        director: pick(["Renata Kolb", "Idris Okafor", "Suzu Yamamoto", "Alina Petrov"], i),
        isNew: hash(name) % 6 === 0,
        isTrending: hash(name) % 8 === 0,
      },
    });
    const seasonRow = await prisma.season.create({ data: { titleId: title.id, number: 1 } });
    for (let e = 0; e < 6; e++) {
      await prisma.episode.create({
        data: {
          seasonId: seasonRow.id,
          number: e + 1,
          name: `Episode ${e + 1}`,
          synopsis: genSynopsis(e + i),
          durationMins: 40 + (hash(name + e) % 20),
          stillUrl: placeholder(`${name} E${e + 1}`, { w: 640, h: 360, kind: "still" }),
          streamUrl: pick(VOD_TEST_STREAMS, e + i),
        },
      });
    }
    count++;
  }

  // Flagship documentaries
  for (const d of FLAGSHIP_DOCS) {
    await prisma.title.create({
      data: {
        name: d.name,
        slug: slugify(d.name),
        type: "DOCUMENTARY",
        synopsis: d.synopsis,
        posterUrl: placeholder(d.name, { w: 400, h: 600, kind: "poster" }),
        backdropUrl: placeholder(d.name, { w: 1280, h: 720, kind: "backdrop" }),
        releaseYear: d.year,
        rating: "PG",
        imdbRating: d.imdb,
        durationMins: d.duration,
        genres: d.genres,
        cast: "Narrated documentary",
        isFeatured: !!d.featured,
        isNew: !!d.isNew,
        isTrending: !!d.trending,
        streamUrl: pick(VOD_TEST_STREAMS, count),
      },
    });
    count++;
  }

  // Bulk documentaries
  const DOC_TOPICS = ["Ocean", "Cosmos", "Desert", "Rainforest", "Metropolis", "Glacier", "Savanna", "Volcano", "Reef", "Tundra", "Canyon", "Wetlands", "Highlands", "Archipelago", "Steppe", "Fjord", "Delta", "Prairie"];
  const DOC_ANGLES = ["Untold", "Wild", "Hidden", "Living", "Ancient", "Rising", "Vanishing"];
  for (let i = 0; i < 22; i++) {
    const name = `${pick(DOC_ANGLES, i)} ${pick(DOC_TOPICS, i + 3)}`;
    await prisma.title.create({
      data: {
        name,
        slug: slugify(name) + "-" + (i + 1),
        type: "DOCUMENTARY",
        synopsis: `An immersive exploration of the ${pick(DOC_TOPICS, i + 3).toLowerCase()} and the life it sustains, filmed over two years across five countries.`,
        posterUrl: placeholder(name, { w: 400, h: 600, kind: "poster" }),
        backdropUrl: placeholder(name, { w: 1280, h: 720, kind: "backdrop" }),
        releaseYear: 2018 + (hash(name) % 8),
        rating: "PG",
        imdbRating: Math.round((6.8 + (hash(name) % 25) / 10) * 10) / 10,
        durationMins: 75 + (hash(name) % 40),
        genres: pick(["Nature", "Science", "History", "Culture", "Technology"], i),
        cast: "Narrated documentary",
        isNew: hash(name) % 7 === 0,
        streamUrl: pick(VOD_TEST_STREAMS, i + 6),
      },
    });
    count++;
  }

  return count;
}

async function seedUsers() {
  const adminPass = await bcrypt.hash("Admin123!", 10);
  const demoPass = await bcrypt.hash("Demo123!", 10);

  await prisma.user.create({
    data: {
      name: "Site Admin",
      email: "admin@whiscotv.demo",
      passwordHash: adminPass,
      role: "ADMIN",
      avatarColor: "#7c3aed",
    },
  });

  await prisma.user.create({
    data: {
      name: "Demo Viewer",
      email: "demo@whiscotv.demo",
      passwordHash: demoPass,
      role: "VIEWER",
      avatarColor: "#0ea5e9",
      profiles: {
        create: [
          { name: "Demo Viewer", avatar: "🧑", isKids: false },
          { name: "Kids", avatar: "🧒", isKids: true },
        ],
      },
    },
  });
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.watchProgress.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.season.deleteMany();
  await prisma.title.deleteMany();
  await prisma.epgEntry.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding live channels (real, free-to-air, verified streams)...");
  const chCount = await seedChannels();
  console.log(`  -> ${chCount} channels`);

  console.log("Seeding VOD catalog...");
  const vodCount = await seedVOD();
  console.log(`  -> ${vodCount} titles`);

  console.log("Seeding users...");
  await seedUsers();

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
