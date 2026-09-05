// IndexNow — instant URL submission to Bing/Yandex/Seznam/Naver (and any
// engine adopting the protocol). Google does not use IndexNow (relies on
// sitemap crawling), but Bing powers many GCC-region searches and indexes
// within hours via this ping. The key is public by design (verified via
// the /{key}.txt file in public/).
//
// Fire-and-forget: never throws, never blocks a cron on search-engine
// availability. Call after content additions with the affected URLs.

const INDEXNOW_KEY = "5b8cd7f2220f672b1c6ece2972a1a3c7";
const HOST = "www.whisco.tv";

export async function pingIndexNow(paths: string[]): Promise<{ submitted: number; ok: boolean }> {
  if (paths.length === 0) return { submitted: 0, ok: true };
  // De-dupe and cap at 500 per submission (protocol allows 10k; stay modest)
  const urlList = [...new Set(paths)].slice(0, 500).map((p) => `https://${HOST}${p.startsWith("/") ? p : "/" + p}`);
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(10000),
    });
    return { submitted: urlList.length, ok: res.ok || res.status === 202 };
  } catch {
    return { submitted: urlList.length, ok: false };
  }
}
