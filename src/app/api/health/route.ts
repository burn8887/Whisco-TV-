import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Lightweight health endpoint for uptime monitoring. Public (no secrets
// exposed) and cheap: one tiny query verifies DB connectivity; counts come
// from the same query batch. Used by the GitHub Actions uptime monitor.

export const dynamic = "force-dynamic";
export const maxDuration = 15;

export async function GET() {
  const startedAt = Date.now();
  try {
    const [activeChannels, activeTitles, lastChannelCheck, lastVodCheck] = await Promise.all([
      prisma.channel.count({ where: { isActive: true } }),
      prisma.title.count({ where: { isActive: true } }),
      prisma.channel.aggregate({ _max: { lastCheckedAt: true } }),
      prisma.title.aggregate({ _max: { lastCheckedAt: true } }),
    ]);
    const dbMs = Date.now() - startedAt;

    // Staleness alarms: if the crons have not run in >36h something is broken
    // (GH Actions disabled, secret rotated, endpoint failing) — surface it.
    const now = Date.now();
    const chAge = lastChannelCheck._max.lastCheckedAt ? now - lastChannelCheck._max.lastCheckedAt.getTime() : null;
    const vodAge = lastVodCheck._max.lastCheckedAt ? now - lastVodCheck._max.lastCheckedAt.getTime() : null;
    const STALE_MS = 36 * 60 * 60 * 1000;
    const warnings: string[] = [];
    if (chAge !== null && chAge > STALE_MS) warnings.push("channel-checks-stale");
    if (vodAge !== null && vodAge > STALE_MS) warnings.push("vod-checks-stale");
    if (activeChannels < 400) warnings.push("active-channels-low");
    if (activeTitles < 10000) warnings.push("active-titles-low");

    return NextResponse.json({
      status: warnings.length ? "degraded" : "ok",
      warnings,
      db: { reachable: true, latencyMs: dbMs },
      catalog: { activeChannels, activeTitles },
      lastChecks: {
        channelsHoursAgo: chAge !== null ? Math.round(chAge / 3600000) : null,
        vodHoursAgo: vodAge !== null ? Math.round(vodAge / 3600000) : null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "down",
        db: { reachable: false },
        error: err instanceof Error ? err.message.slice(0, 120) : "unknown",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
