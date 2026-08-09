// Deterministic, dependency-free placeholder image generator.
// Produces inline SVG data URIs so posters/backdrops/logos always render,
// even in network-isolated preview environments. Swap these for real
// artwork URLs (posters, channel logos) when you plug in a live catalog.

const PALETTES: [string, string][] = [
  ["#7c3aed", "#1e1b4b"],
  ["#0ea5e9", "#0c4a6e"],
  ["#ef4444", "#450a0a"],
  ["#f59e0b", "#451a03"],
  ["#10b981", "#022c22"],
  ["#ec4899", "#500724"],
  ["#6366f1", "#1e1b4b"],
  ["#14b8a6", "#042f2e"],
  ["#f43f5e", "#4c0519"],
  ["#84cc16", "#1a2e05"],
];

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function placeholder(
  text: string,
  opts: { w?: number; h?: number; kind?: "poster" | "backdrop" | "logo" | "still" } = {}
) {
  const { w = 400, h = 600, kind = "poster" } = opts;
  const idx = hashStr(text) % PALETTES.length;
  const [c1, c2] = PALETTES[idx];
  const fontSize = kind === "logo" ? Math.round(w / 6) : kind === "backdrop" ? 42 : 28;
  const label = esc(text.length > 26 ? text.slice(0, 24) + "…" : text);
  const words = label.split(" ");
  const lines: string[] = [];
  let cur = "";
  words.forEach((wd) => {
    if ((cur + " " + wd).trim().length > 16) {
      lines.push(cur.trim());
      cur = wd;
    } else {
      cur = (cur + " " + wd).trim();
    }
  });
  if (cur) lines.push(cur);
  const startY = h / 2 - ((lines.length - 1) * (fontSize + 6)) / 2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  ${kind !== "logo" ? `<circle cx="${w * 0.85}" cy="${h * 0.15}" r="${w * 0.3}" fill="white" opacity="0.05"/>` : ""}
  ${lines
    .map(
      (line, i) =>
        `<text x="50%" y="${startY + i * (fontSize + 6)}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.92">${line}</text>`
    )
    .join("\n")}
  ${kind === "poster" ? `<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="white" stroke-opacity="0.08" stroke-width="2"/>` : ""}
</svg>`;

  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}
