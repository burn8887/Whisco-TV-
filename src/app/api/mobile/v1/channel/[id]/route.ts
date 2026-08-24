import { NextResponse } from "next/server";
import { getChannelPageData } from "@/lib/cached";

// Mobile API v1 — single live channel + related channels.

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
