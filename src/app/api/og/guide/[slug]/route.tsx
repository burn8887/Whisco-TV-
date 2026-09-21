import { ImageResponse } from "next/og";
import { GUIDES } from "@/lib/guides";

// Branded share card per guide — type + well, no stolen still.
//
// The design system (§5) says share cards are type-led: canvas, the guide's
// own headline, the ember→bloom wordmark, and a quiet rule. Nothing here is
// borrowed art. Guides have no poster, so nothing is borrowed at all.
//
// Per the 21 Sep work order this is wired for the NEW guide slugs only; the
// pre-existing guides keep the generic /og-share-card.png until reviewed.
//
// Guides are static data, so no Prisma — but match the title route and
// avoid the deprecated Edge runtime.
export const runtime = "nodejs";

// Slugs the work order authorises a bespoke card for.
const NEW_SLUGS = new Set([
  "free-legal-hd-turkish-series-english-subtitles",
  "hindi-serials-firestick-uae-legal",
  "telugu-live-tv-dubai-apartment-no-dish",
  "indonesian-tv-qatar-legal",
  "free-legal-arabic-series-smart-tv-gulf",
]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide || !NEW_SLUGS.has(slug)) {
    return new Response("Not found", { status: 404 });
  }

  // Headline is trimmed to a share-card-safe shape rather than clamped by CSS,
  // because Satori reflows long strings unpredictably.
  const headline =
    guide.h1.length > 96 ? guide.h1.slice(0, 93).trimEnd() + "…" : guide.h1;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #0a0a0f 58%, #1c1017 100%)",
          fontFamily: "sans-serif",
          padding: 64,
        }}
      >
        {/* eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#a1a1aa",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#f97316",
            }}
          />
          Whisco TV Guide
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            fontSize: headline.length > 60 ? 54 : 64,
            fontWeight: 700,
            lineHeight: 1.16,
            letterSpacing: -1.2,
            color: "#f5f5f7",
            maxWidth: 1000,
          }}
        >
          {headline}
        </div>

        {/* rule + wordmark */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              height: 3,
              width: 132,
              background: "linear-gradient(90deg, #f97316, #db2777)",
              borderRadius: 999,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            <span style={{ color: "#f5f5f7" }}>Whisco</span>
            <span
              style={{
                background: "linear-gradient(90deg, #f97316, #db2777)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              TV
            </span>
            <span style={{ fontSize: 22, color: "#71717a", fontWeight: 400 }}>
              · whisco.tv/guides
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
