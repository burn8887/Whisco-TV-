/* Whisco TV service worker
 *
 * Strategy:
 *  - Pages & API/data: NETWORK-FIRST (catalog must always be fresh; the app
 *    is a window onto the live database). Offline fallback page if no network.
 *  - Static assets (icons, images, fonts, _next/static): CACHE-FIRST
 *    (immutable/fingerprinted, safe to cache long-term).
 *  - Video/streams (HLS, mp4, YouTube, archive.org): NEVER intercepted —
 *    the browser and player handle those directly.
 */
const VERSION = "whisco-v1";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const OFFLINE_URL = "/offline.html";

const PRECACHE = [
  OFFLINE_URL,
  "/icon-192.png",
  "/logo-mark.png",
  "/whisco-mascot.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const NEVER_HANDLE = [
  /\.m3u8(\?|$)/,
  /\.ts(\?|$)/,
  /\.mp4(\?|$)/,
  /youtube\.com/,
  /ytimg\.com/,
  /googlevideo\.com/,
  /archive\.org/,
  /akamaized\.net/,
  /akamaihd\.net/,
  /france24\.com/,
];

const STATIC_DEST = new Set(["style", "script", "font", "image"]);

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = req.url;
  // Never touch media/streams or cross-origin video CDNs.
  if (NEVER_HANDLE.some((re) => re.test(url))) return;

  const isSameOrigin = new URL(url).origin === self.location.origin;
  if (!isSameOrigin) return;

  // Static assets: cache-first.
  if (STATIC_DEST.has(req.destination) || url.includes("/_next/static/")) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(STATIC_CACHE).then((c) => c.put(req, clone));
            }
            return res;
          })
      )
    );
    return;
  }

  // Page navigations & data: network-first with offline fallback.
  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(PAGE_CACHE).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match(OFFLINE_URL))
        )
    );
  }
});
