import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Vercel Cron Job target — runs daily (see vercel.json). Checks every
// live channel's stream URL is still reachable and returns valid HLS
// content. Channels that fail 2 consecutive daily checks are hidden from
// viewers (isActive=false) automatically; channels that recover are
// automatically restored. This keeps the public /live directory free of
// dead links without any manual work.

export const maxDuration = 300;
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

      // Some "master" playlists return a healthy 200 + valid #EXTM3U even
      // though the variant stream(s) they point to are dead (e.g. a stale
      // CDN endpoint that was never updated after infra migration). Follow
      // the first variant one hop deep so we actually catch that case
      // instead of reporting a channel as "ok" when playback is broken.
      if (text.includes("#EXT-X-STREAM-INF")) {
        const lines = text.split(/\r?\n/);
        const variantLine = lines.find((l) => l.trim() && !l.startsWith("#"));
        if (variantLine) {
          const variantUrl = new URL(variantLine.trim(), res.url).toString();
          const subController = new AbortController();
          const subTimer = setTimeout(() => subController.abort(), 4000);
          try {
            const subRes = await fetch(variantUrl, {
              signal: subController.signal,
              headers: { "User-Agent": "Mozilla/5.0 (WhiscoTV-HealthCheck)" },
              redirect: "follow",
            });
            if (!subRes.ok) return "invalid";
            const subText = await subRes.text();
            if (!subText.includes("#EXTM3U")) return "invalid";
          } catch {
            return "invalid";
          } finally {
            clearTimeout(subTimer);
          }
        }
      }
    }
    return "ok";
  } catch {
    return "unreachable";
  } finally {
    clearTimeout(timer);
  }
}


// Worker-pool: keeps `concurrency` checks in flight at all times instead of
// lock-step batches (where one slow channel stalls the whole batch). This cut
// total run time enough to matter once health checks became two hops deep.
async function runBatched<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Refresh cached catalog pages so changes appear promptly.
  revalidatePath("/live");
  revalidatePath("/");

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
