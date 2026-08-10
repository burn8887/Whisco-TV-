import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Vercel Cron Job target — runs daily (see vercel.json). Checks every
// live channel's stream URL is still reachable and returns valid HLS
// content. Channels that fail 2 consecutive daily checks are hidden from
// viewers (isActive=false) automatically; channels that recover are
// automatically restored. This keeps the public /live directory free of
// dead links without any manual work.

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const TIMEOUT_MS = 6000;
const CONCURRENCY = 40;
const FAIL_THRESHOLD = 2; // consecutive failures before hiding a channel

async function checkStream(url: string): Promise<"ok" | "unreachable" | "invalid"> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (WhiscoTV-HealthCheck)" },
      redirect: "follow",
    });
    if (!res.ok) return "unreachable";
    // For actual .m3u8 URLs, confirm the body looks like a real HLS playlist.
    // (Some dead endpoints return a 200 with an HTML error page.)
    if (url.includes(".m3u8")) {
      const text = await res.text();
      if (!text.includes("#EXTM3U")) return "invalid";
    }
    return "ok";
  } catch {
    return "unreachable";
  } finally {
    clearTimeout(timer);
  }
}

async function runBatched<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const channels = await prisma.channel.findMany({
    select: { id: true, streamUrl: true, failCount: true, isActive: true, name: true },
  });

  const results = await runBatched(channels, CONCURRENCY, async (ch) => {
    const status = await checkStream(ch.streamUrl);
    return { ...ch, status };
  });

  let restored = 0;
  let newlyHidden = 0;
  let stillDown = 0;
  let ok = 0;

  // Throttle DB writes separately (and much lower concurrency) from the
  // network checks above — Neon's default pooled connection limit is small,
  // and 200+ concurrent writes will exhaust it instantly.
  await runBatched(results, 5, async (r) => {
    if (r.status === "ok") {
      ok++;
      if (!r.isActive) restored++;
      await prisma.channel.update({
        where: { id: r.id },
        data: { isActive: true, failCount: 0, lastCheckedAt: new Date(), lastStatus: "ok" },
      });
    } else {
      const newFailCount = r.failCount + 1;
      const shouldHide = newFailCount >= FAIL_THRESHOLD;
      if (shouldHide && r.isActive) newlyHidden++;
      if (shouldHide) stillDown++;
      await prisma.channel.update({
        where: { id: r.id },
        data: {
          isActive: shouldHide ? false : r.isActive,
          failCount: newFailCount,
          lastCheckedAt: new Date(),
          lastStatus: r.status,
        },
      });
    }
  });

  const summary = {
    checked: channels.length,
    ok,
    restored,
    newlyHidden,
    totalInactive: stillDown,
    timestamp: new Date().toISOString(),
  };

  console.log("[whisco-tv cron] channel health check:", summary);
  return NextResponse.json(summary);
}
