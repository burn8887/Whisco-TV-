import { NextResponse } from "next/server";
import { getChannelPageData } from "@/lib/cached";
import { isClearedStore, requestedStore, CLEARED_HEADERS, PUBLIC_HEADERS } from "@/lib/store-gate";
import { getIosChannel } from "@/lib/store-ios";

// Mobile API v1 — single live channel + related channels.
//
// STORE SPLIT (Apple 5.2.2, build 6): on the iOS store an uncleared channel is a
// hard 404. Deep links must not be a way around the gate.

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // ---------------------------------------------------------------- iOS store
  if (isClearedStore(req)) {
    const channel = await getIosChannel(id);
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
        // No "related" rail on the iOS store: related rows would leak uncleared
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
