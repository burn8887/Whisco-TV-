/**
 * iOS BUILD 8 — THE LIVE EIGHT, AS AN ALLOW-LIST.
 *
 * WHY AN ALLOW-LIST AND NOT A FLAG
 * Builds 6 and 7 gated the App Store catalogue on `clearedForApp: true` — a
 * boolean a human ticks. That boolean is a spray: one tick on the wrong row
 * publishes it to Apple, and the reviewer finds it. The Desk's ruling for
 * build 8 (2026-09-28) is explicit: "Live clearance is an allow-list of the
 * eight channel IDs above, not a boolean you spray."
 *
 * So the iOS live surface is exactly these eight YouTube channel ids, written
 * down here, in this file, in reviewer order. Nothing else can appear on it —
 * not by a database flag, not by a cron job, not by a bulk import. Widening the
 * iOS live catalogue is now a code change with a review, which is the point.
 *
 * WIDENING THE APPLE CATALOGUE IS DELIBERATE WORK. Adding a row means editing
 * this array and shipping a binary. That is the correct cost for a 5.2.2 gate.
 *
 * WHAT EACH ROW MUST BE
 *   - the broadcaster's OWN 24/7 news stream, on the broadcaster's own verified
 *     YouTube channel (the channelId below is that channel);
 *   - played inside YouTube's embed, with YouTube's chrome visible, via
 *     https://www.youtube.com/embed/live_stream?channel=<CHANNEL_ID>;
 *   - never a copy, a re-serve, a harvested HLS URL, an M3U, an Xtream line or
 *     a stream URL scraped out of another player.
 *
 * FAIL CLOSED
 *   - A row missing from the database is simply absent from the response.
 *   - A row whose streamUrl is not the YouTube live embed for ITS OWN id is
 *     dropped, even if the database row exists.
 *   - We never "make eight" by backfilling a substitute channel. If a
 *     broadcaster kills its stream we ship seven and say so.
 */

import { prisma } from "@/lib/prisma";

export type IosLiveOnly = {
  name: string;
  /** YouTube channel id — the broadcaster's own channel. */
  channelId: string;
  /** The broadcaster's channel page, for a viewer or reviewer to check. */
  officialUrl: string;
};

/**
 * THE EIGHT. Order is intentional: France 24 English first, because the App
 * Review notes walk the reviewer down the Live list starting there.
 * Names are the broadcasters' own channel names.
 */
export const IOS_LIVE_ALLOWLIST: readonly IosLiveOnly[] = [
  { name: "France 24 English",  channelId: "UCQfwfsi5VrQ8yKZ-UWmAEFg", officialUrl: "https://www.youtube.com/@France24_en" },
  { name: "DW News",            channelId: "UCknLrEdhRCp1aegoMqRaCZg", officialUrl: "https://www.youtube.com/@dwnews" },
  { name: "TRT World",          channelId: "UC7fWeaHhqgM4Ry-RMpM2YYw", officialUrl: "https://www.youtube.com/@trtworld" },
  { name: "Al Jazeera English", channelId: "UCNye-wNBqNL5ZzHSJj3l8Bg", officialUrl: "https://www.youtube.com/@aljazeeraenglish" },
  { name: "CNA",                channelId: "UC83jt4dlz1Gjl58fzQrrKZg", officialUrl: "https://www.youtube.com/@channelnewsasia" },
  { name: "NHK WORLD-JAPAN",    channelId: "UCSPEjw8F2nQDtmUKPFNF7_A", officialUrl: "https://www.youtube.com/@NHKWORLDJAPAN" },
  { name: "Africanews",         channelId: "UC1_E8NeF5QHY2dtdLRBCCLA", officialUrl: "https://www.youtube.com/@africanews" },
  { name: "ABC News Australia", channelId: "UCVgO39Bk5sMo66-6o6Spn6Q", officialUrl: "https://www.youtube.com/@abcnewsaustralia" },
] as const;

/** The allow-listed ids, lowercase-trimmed for comparison. */
const ALLOWED_IDS: readonly string[] = IOS_LIVE_ALLOWLIST.map((r) => r.channelId);

/** Index for reviewer-order sorting. -1 = not allowed. */
function allowIndex(channelId: string): number {
  return ALLOWED_IDS.indexOf(channelId);
}

/**
 * The YouTube channel id a streamUrl points at, or null.
 *
 * Strict on purpose. It must be a YouTube live_stream embed carrying a channel
 * id; a plain watch URL, a youtu.be link, an HLS manifest or anything else that
 * is not that shape returns null and the row is dropped. `channel=` must be a
 * UC-prefixed id — those are channels; UU/PL would be uploads/playlists.
 */
export function youtubeLiveChannelId(streamUrl: string | null | undefined): string | null {
  if (!streamUrl) return null;
  const m = /youtube\.com\/embed\/live_stream\?(?:[^#]*&)?channel=(UC[A-Za-z0-9_-]{10,})/.exec(streamUrl);
  return m ? m[1] : null;
}

/** True only when this row is an allow-listed broadcaster's own YouTube live embed. */
export function isAllowedIosLiveStream(streamUrl: string | null | undefined): boolean {
  const id = youtubeLiveChannelId(streamUrl);
  return !!id && allowIndex(id) !== -1;
}

const SELECT = {
  id: true,
  name: true,
  logoUrl: true,
  streamUrl: true,
  country: true,
  language: true,
  category: true,
  isHD: true,
  isActive: true,
  rightsBasis: true,
  evidenceUrl: true,
} as const;

/**
 * The iOS live rows: allow-listed, active, and verified to be the YouTube live
 * embed of their own channel. Ordered as this file lists them. No fallback,
 * no backfill, no substitute.
 */
export async function getIosLiveOnlyChannels() {
  const rows = await prisma.channel.findMany({
    where: {
      isActive: true,
      OR: ALLOWED_IDS.map((id) => ({ streamUrl: { contains: id } })),
    },
    select: SELECT,
  });

  return rows
    .filter((r) => isAllowedIosLiveStream(r.streamUrl))
    .sort((a, b) => {
      const ai = allowIndex(youtubeLiveChannelId(a.streamUrl)!);
      const bi = allowIndex(youtubeLiveChannelId(b.streamUrl)!);
      return ai - bi;
    });
}

/**
 * One allow-listed live channel by database id, or null.
 *
 * The route turns null into a 404. A deep link to any other channel — a
 * harvested row, a film's uploader channel, a stale id from build 6 or 7 — is a
 * hard 404 on the App Store build. Deep links are not a way around the gate.
 */
export async function getIosLiveOnlyChannel(id: string) {
  const row = await prisma.channel.findFirst({
    where: { id, isActive: true },
    select: SELECT,
  });
  if (!row) return null;
  return isAllowedIosLiveStream(row.streamUrl) ? row : null;
}

/** The eight rows as the mobile API should render them. */
export function toIosLivePayload(rows: Awaited<ReturnType<typeof getIosLiveOnlyChannels>>) {
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    logoUrl: c.logoUrl,
    streamUrl: c.streamUrl,
    country: c.country,
    language: c.language,
    category: c.category,
    isHD: c.isHD,
    rightsBasis: c.rightsBasis ?? null,
    evidenceUrl: c.evidenceUrl ?? null,
  }));
}
