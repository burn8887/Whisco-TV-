import { NextResponse } from "next/server";
import { getChannelPageData } from "@/lib/cached";
import { isIosStore, isClearedStore, requestedStore, CLEARED_HEADERS, PUBLIC_HEADERS } from "@/lib/store-gate";
import { getAndroidChannel } from "@/lib/store-android";
import { getIosLiveOnlyChannel } from "@/lib/store-ios-live";

// Mobile API v1 — single live channel + related channels.
//
// STORE SPLIT (Apple 5.2.2, build 6): on the iOS store an uncleared channel is a
// hard 404. Deep links must not be a way around the gate.

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // ------------------------------------- iOS BUILD 8: allow-listed lives only
  // Any channel outside the eight is a hard 404 on the Apple build — including a
  // channel that is merely marked cleared in the database. The allow-list, not a
  // flag, decides; see src/lib/store-ios-live.ts.
  if (isIosStore(req)) {
    const channel = await getIosLiveOnlyChannel(id);
    if (!channel) return NextResponse.json({ error: "not-found" }, { status: 404, headers: CLEARED_HEADERS });

    return NextResponse.json(
      {
        store: requestedStore(req),
        channel: {
          id: channel.id,
          name: channel.name,
          logoUrl: channel.logoUrl,
          streamUrl: channel.streamUrl,
          country: channel.country,
          language: channel.language,
          category: channel.category,
          isHD: channel.isHD,
          isActive: channel.isActive,
          rightsBasis: channel.rightsBasis ?? null,
          evidenceUrl: channel.evidenceUrl ?? null,
        },
        // No "related" rail: related rows would leak non-allow-listed channels
        // into the Apple build through the back door.
        related: [],
      },
      { headers: CLEARED_HEADERS }
    );
  }

  // -------------------------------------------------- cleared store (Android/Play)
  // THE ANDROID SHELF (Desk work order, 2026-10-05): the allow-list in
  // src/lib/store-android.ts, not a database flag. A channel that is not in that
  // file is a hard 404 here even if some catalogue row says otherwise.
  if (isClearedStore(req)) {
    const channel = getAndroidChannel(id);
    if (!channel) return NextResponse.json({ error: "not-found" }, { status: 404, headers: CLEARED_HEADERS });

    return NextResponse.json(
      {
        store: requestedStore(req),
        channel: {
          id: channel.id,
          name: channel.name,
          logoUrl: channel.logoUrl,
          streamUrl: channel.streamUrl,
          country: channel.country,
          language: channel.language,
          category: channel.category,
          isHD: channel.isHD,
          isActive: channel.isActive,
          rightsBasis: channel.rightsBasis ?? null,
          evidenceUrl: channel.evidenceUrl ?? null,
        },
        // No "related" rail: related rows would leak uncleared
        // channels into the app through the back door.
        related: [],
      },
      { headers: CLEARED_HEADERS }
    );
  }

  // ------------------------------------------------------------- public store
  const { channel, related } = await getChannelPageData(id);
  if (!channel) return NextResponse.json({ error: "not-found" }, { status: 404 });

  const slim = (c: typeof channel) => ({
    id: c.id,
    name: c.name,
    logoUrl: c.logoUrl,
    streamUrl: c.streamUrl,
    country: c.country,
    language: c.language,
    category: c.category,
    isHD: c.isHD,
    isActive: c.isActive,
  });

  return NextResponse.json(
    { channel: slim(channel), related: related.map(slim) },
    { headers: PUBLIC_HEADERS }
  );
}
