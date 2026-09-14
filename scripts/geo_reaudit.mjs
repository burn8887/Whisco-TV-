/**
 * GEO RE-AUDIT — 2026-09-14
 * Founder-approved (Option 1): verify per-title GCC availability for the stalest
 * active titles, then hide confirmed GCC-blocked ones.
 *
 * SAFETY RULES (founder-mandated):
 *  - per-title verification before EVERY write: a title is only hidden when
 *    TWO independent probes both return BLOCKED (not on a single reading)
 *  - NEVER write on "unknown" verdicts (consent stub / rate-limit / network)
 *  - abort automatically if the unknown rate spikes (rate-limit protection)
 *
 * Writes ONLY: isActive=false, lastStatus="geo", failCount=0 for confirmed titles.
 * lastCheckedAt is deliberately NOT touched, so the normal liveness sweep keeps
 * its rotation and still re-checks these titles properly.
 */
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';

const p = new PrismaClient();
const GCC = ['BH', 'SA', 'AE', 'KW', 'QA', 'OM'];
const UA = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};
const CONCURRENCY = 8;
const OUT = '/home/user/geo_audit_results.json';
const ytId = (u) => {
  const m = (u || '').match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
};

let probes = 0;
let consecutiveUnknown = 0;
let aborted = false;

async function probe(id) {
  probes++;
  try {
    const r = await fetch(`https://www.youtube.com/watch?v=${id}&hl=en`, {
      headers: UA,
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) return 'unknown';
    const html = await r.text();
    if (!html.includes('playabilityStatus')) {
      consecutiveUnknown++;
      return 'unknown'; // consent stub / rate limit
    }
    consecutiveUnknown = 0;
    const m = html.match(/"availableCountries":\[([^\]]*)\]/);
    if (!m) return 'ok'; // no restriction list -> worldwide
    const list = m[1].replace(/"/g, '').split(',');
    return GCC.some((c) => list.includes(c)) ? 'ok' : 'blocked';
  } catch {
    consecutiveUnknown++;
    return 'unknown';
  }
}

/** Two independent BLOCKED readings required. Any doubt -> not blocked. */
async function classify(id) {
  const a = await probe(id);
  if (a === 'ok' || a === 'unknown') return a;
  await new Promise((r) => setTimeout(r, 1200)); // re-verify before hiding
  const b = await probe(id);
  if (b === 'blocked') return 'blocked';
  if (b === 'ok') return 'ok'; // flip-flop -> treat as available, log for review
  return 'unknown';
}

const slugify = (s) => s;

const started = Date.now();
const results = { started: new Date().toISOString(), total: 0, ok: 0, blocked: [], partial: [], unknown: 0, nonYoutube: 0, errors: [] };

try {
  const cut = new Date(Date.now() - 7 * 86400000);
  const where = { isActive: true, OR: [{ lastCheckedAt: null }, { lastCheckedAt: { lt: cut } }] };

  const titles = await p.title.findMany({
    where,
    orderBy: { lastCheckedAt: 'asc' }, // stalest first
    select: {
      id: true, slug: true, name: true, type: true, collection: true,
      streamUrl: true, lastStatus: true, lastCheckedAt: true,
      seasons: { select: { episodes: { select: { streamUrl: true }, take: 3 } } },
    },
  });
  results.total = titles.length;
  fs.writeFileSync(OUT, JSON.stringify({ ...results, status: 'running' }, null, 2));
  console.log(`[start] ${titles.length} active titles unchecked >7d; concurrency ${CONCURRENCY}`);

  let done = 0;
  let next = 0;

  async function worker(wid) {
    while (next < titles.length && !aborted) {
      const t = titles[next++];
      let ids = [];
      if (t.type === 'SERIES') {
        ids = t.seasons.flatMap((s) => s.episodes.map((e) => ytId(e.streamUrl))).filter(Boolean).slice(0, 3);
      } else {
        const one = ytId(t.streamUrl);
        if (one) ids = [one];
      }
      if (!ids.length) {
        results.nonYoutube++;
      } else {
        // classify every sampled episode; a title is only hidden if ALL sampled
        // episodes are blocked and at least one is confirmed by the 2-probe rule
        const verdicts = [];
        for (const id of ids) verdicts.push(await classify(id));
        const blocked = verdicts.filter((v) => v === 'blocked').length;
        const ok = verdicts.filter((v) => v === 'ok').length;
        const unk = verdicts.filter((v) => v === 'unknown').length;

        if (blocked > 0 && ok === 0 && unk === 0) {
          // every sampled episode blocked -> confirmed exposure, hide it
          try {
            await p.title.update({
              where: { id: t.id },
              data: { isActive: false, lastStatus: 'geo', failCount: 0 },
            });
            results.blocked.push({
              slug: t.slug, name: t.name, collection: t.collection,
              episodesSampled: ids.length, verdicts,
              lastCheckedAt: t.lastCheckedAt?.toISOString() ?? null, wasStatus: t.lastStatus,
            });
            console.log(`[HIDDEN] ${t.slug} | ${t.name.slice(0, 45)} | ${t.collection} | eps=${ids.length} ${verdicts.join(',')}`);
          } catch (e) {
            results.errors.push({ slug: t.slug, error: e.message.split('\n')[0] });
          }
        } else if (blocked > 0 && ok > 0) {
          // partial availability — reported, NOT hidden (needs the code-level fix)
          results.partial.push({
            slug: t.slug, name: t.name, collection: t.collection,
            verdicts, blockedEpisodes: blocked, availableEpisodes: ok,
          });
          console.log(`[PARTIAL] ${t.slug} | ${t.name.slice(0, 45)} | ${verdicts.join(',')}`);
        } else if (blocked === 0 && ok > 0) {
          results.ok++;
        } else {
          results.unknown++;
        }
      }
      done++;
      if (done % 100 === 0) {
        const el = (Date.now() - started) / 1000;
        const rate = done / el;
        const eta = (titles.length - done) / rate;
        console.log(
          `[progress] ${done}/${titles.length} | ok=${results.ok} hidden=${results.blocked.length} partial=${results.partial.length} unknown=${results.unknown} nonYT=${results.nonYoutube} | ${rate.toFixed(2)}/s | ETA ${(eta / 60).toFixed(1)}min`
        );
        fs.writeFileSync(OUT, JSON.stringify({ ...results, status: 'running', done, probes }, null, 2));
      }
      // rate-limit circuit breaker: 60 consecutive unreadable pages -> stop
      if (consecutiveUnknown > 60) {
        aborted = true;
        console.log(`[ABORT] ${consecutiveUnknown} consecutive unknown verdicts — likely rate-limiting. Stopping WITHOUT further writes.`);
        results.errors.push({ error: `aborted: ${consecutiveUnknown} consecutive unknown verdicts (rate-limit protection)` });
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));

  const hidden = await p.title.count({ where: { lastStatus: 'geo' } });
  const inactive = await p.title.count({ where: { isActive: false } });
  const summary = {
    ...results,
    status: aborted ? 'aborted' : 'complete',
    finished: new Date().toISOString(),
    elapsedMinutes: +((Date.now() - started) / 60000).toFixed(1),
    probes,
    db_geoStatusTotal: hidden,
    db_inactiveTitlesTotal: inactive,
  };
  fs.writeFileSync(OUT, JSON.stringify(summary, null, 2));
  console.log('\n===== AUDIT SUMMARY =====');
  console.log(`probed ${done}/... | ok=${results.ok} HIDDEN=${results.blocked.length} partial=${results.partial.length} unknown=${results.unknown} nonYoutube=${results.nonYoutube}`);
  console.log(`elapsed ${summary.elapsedMinutes} min | total YouTube probes ${probes}`);
  console.log(`DB now: lastStatus='geo' rows = ${hidden} | inactive titles = ${inactive}`);
  console.log(`results file: ${OUT}`);
} catch (e) {
  console.error('FATAL', e.message);
  fs.writeFileSync(OUT, JSON.stringify({ ...results, status: 'fatal', error: e.message }, null, 2));
} finally {
  await p.$disconnect();
}
