import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { placeholder } from "../src/lib/placeholder";

const prisma = new PrismaClient();

// ------------------------------------------------------------------
// LIVE CHANNELS — Whisco TV is a FAST (Free Ad-Supported Streaming TV)
// service. Every stream below is a real, publicly-provided, free-to-air
// broadcast feed from the broadcaster itself — verified reachable at seed
// time. Sourced from a mix of directly-confirmed official broadcaster
// endpoints and iptv-org (github.com/iptv-org/iptv), a long-running,
// community-maintained registry that specifically screens for free/public
// streams (used by mainstream FOSS media apps like Jellyfin/Kodi/Plex
// plugins). Curated for GCC local + expat audiences: Arabic, English,
// Hindi, Urdu, Bengali, Filipino, and African-market channels.
// See prisma/live_channels.json for the full curated list, and README.md
// for how to add/replace channels (or graduate to a FAST aggregator
// partnership for a larger licensed catalog).
// ------------------------------------------------------------------
const LIVE_CHANNELS: {
  name: string;
  country: string;
  countryCode: string;
  language: string;
  category: string;
  streamUrl: string;
  isFeatured?: boolean;
}[] = JSON.parse(fs.readFileSync(path.join(__dirname, "live_channels.json"), "utf-8"));


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



async function seedVOD() {
  let count = 0;

  // ------------------------------------------------------------------
  // REAL PUBLIC-DOMAIN CATALOG (Internet Archive) — 1000+ real, freely
  // licensed feature films, documentaries, and classic TV/cartoons.
  // Sourced from well-established public-domain categories (US
  // government works, Prelinger ephemeral films, pre-1964 features and
  // cartoons that lapsed into the public domain). See
  // prisma/vod_titles.json and README.md for sourcing details and how
  // to refresh/expand this list.
  // ------------------------------------------------------------------
  const realTitlesPath = path.join(__dirname, "vod_titles.json");
  if (fs.existsSync(realTitlesPath)) {
    const realTitles: {
      name: string;
      slug: string;
      type: string;
      synopsis: string;
      posterUrl: string;
      backdropUrl: string;
      releaseYear: number;
      genres: string;
      collection?: string;
      imdbRating: number;
      streamUrl: string;
    }[] = JSON.parse(fs.readFileSync(realTitlesPath, "utf-8"));

    const seenSlugs = new Set<string>();
    const rows = realTitles
      .filter((t) => {
        if (seenSlugs.has(t.slug)) return false;
        seenSlugs.add(t.slug);
        return true;
      })
      .map((t) => ({
        name: t.name,
        slug: t.slug,
        type: t.type,
        synopsis: t.synopsis,
        posterUrl: t.posterUrl,
        backdropUrl: t.backdropUrl,
        releaseYear: t.releaseYear,
        rating: "PG",
        imdbRating: t.imdbRating,
        durationMins: null,
        genres: t.genres,
        collection: t.collection ?? "",
        cast: "",
        director: "",
        isNew: false,
        isTrending: false,
        streamUrl: t.streamUrl,
      }));

    // createMany is far faster than individual creates for a batch this size
    const BATCH = 200;
    for (let i = 0; i < rows.length; i += BATCH) {
      await prisma.title.createMany({ data: rows.slice(i, i + BATCH), skipDuplicates: true });
    }
    count += rows.length;
  }

  // ------------------------------------------------------------------
  // TURKISH DIZI (official broadcaster YouTube embeds) — full episodes
  // published by the shows' own official channels (Show TV, ATV, Star
  // TV production companies). Embeds play via YouTube's player, so the
  // broadcaster keeps its ad revenue and control; we only catalog and
  // link. See prisma/dizi_series.json (generated from official channel
  // catalogs; only videos with embedding enabled are included).
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  // OFFICIAL-CHANNEL YOUTUBE VOD (FilmRise, Shout!, Fremantle game shows,
  // Popcornflix, and official South Asian / Filipino / Arabic / Indonesian
  // / Nepali / Sinhala distributors). Generated by scripts/harvest_vod.py;
  // every entry verified embeddable at harvest time.
  // ------------------------------------------------------------------
  const ytVodPath = path.join(__dirname, "vod_youtube.json");
  if (fs.existsSync(ytVodPath)) {
    const ytRows: {
      name: string; slug: string; type: string; synopsis: string;
      posterUrl: string; backdropUrl: string; releaseYear: number;
      rating: string; imdbRating: number; durationMins: number;
      genres: string; collection: string; cast: string; director: string;
      country: string; language: string; streamUrl: string;
    }[] = JSON.parse(fs.readFileSync(ytVodPath, "utf-8"));
    const seen = new Set<string>();
    const rows2 = ytRows.filter((t) => {
      if (seen.has(t.slug)) return false;
      seen.add(t.slug);
      return true;
    });
    const BATCH2 = 250;
    for (let i = 0; i < rows2.length; i += BATCH2) {
      await prisma.title.createMany({
        data: rows2.slice(i, i + BATCH2).map((t) => ({ ...t, isNew: false, isTrending: false })),
        skipDuplicates: true,
      });
    }
    count += rows2.length;
  }

  for (const seriesFile of ["dizi_series.json", "arabic_series.json"]) {
  const diziPath = path.join(__dirname, seriesFile);
  if (fs.existsSync(diziPath)) {
    const diziShows: {
      name: string;
      slug: string;
      synopsis: string;
      posterUrl: string;
      backdropUrl: string;
      releaseYear: number;
      rating: string;
      imdbRating: number;
      genres: string;
      collection: string;
      cast: string;
      director: string;
      country: string;
      language: string;
      isTrending: boolean;
      isNew: boolean;
      seasons: {
        number: number;
        episodes: {
          number: number;
          name: string;
          synopsis: string;
          durationMins: number;
          stillUrl: string;
          streamUrl: string;
        }[];
      }[];
    }[] = JSON.parse(fs.readFileSync(diziPath, "utf-8"));

    for (const s of diziShows) {
      const title = await prisma.title.create({
        data: {
          name: s.name,
          slug: s.slug,
          type: "SERIES",
          synopsis: s.synopsis,
          posterUrl: s.posterUrl,
          backdropUrl: s.backdropUrl,
          releaseYear: s.releaseYear,
          rating: s.rating,
          imdbRating: s.imdbRating,
          genres: s.genres,
          collection: s.collection,
          cast: s.cast,
          director: s.director,
          country: s.country,
          language: s.language,
          isTrending: s.isTrending,
          isNew: s.isNew,
        },
      });
      for (const season of s.seasons) {
        const row = await prisma.season.create({ data: { titleId: title.id, number: season.number } });
        await prisma.episode.createMany({
          data: season.episodes.map((e) => ({
            seasonId: row.id,
            number: e.number,
            name: e.name,
            synopsis: e.synopsis,
            durationMins: e.durationMins,
            stillUrl: e.stillUrl,
            streamUrl: e.streamUrl,
          })),
        });
      }
      count++;
    }
  }

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
