import { ImageResponse } from "next/og";
import { getTitlePageData } from "@/lib/cached";

// Branded WhatsApp/social share card per title. Poster + gradient + wordmark
// + "Watch Free" pill — makes every shared link unfurl as a premium-looking
// preview instead of a raw YouTube thumbnail. Edge-cached heavily.
export const runtime = "edge";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let title;
  try {
    const data = await getTitlePageData(slug);
    title = data.title;
  } catch {
    title = null;
  }
  if (!title) return new Response("Not found", { status: 404 });

  const poster = title.posterUrl || title.backdropUrl;
  const meta = [
    title.releaseYear ? String(title.releaseYear) : null,
    title.type === "SERIES" ? "Series" : "Movie",
    title.language,
  ]
    .filter(Boolean)
    .join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #0a0a0f 55%, #1c1017 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* poster */}
        <div style={{ display: "flex", padding: 48, alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            width={340}
            height={510}
            style={{ borderRadius: 24, objectFit: "cover", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}
          />
        </div>
        {/* text block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingRight: 56,
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: "white" }}>Whisco</span>
            <span
              style={{
                fontSize: 40,
                fontWeight: 800,
                background: "linear-gradient(90deg, #f97316, #db2777)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              TV
            </span>
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, color: "white", lineHeight: 1.1, maxWidth: 720 }}>
            {title.name.length > 60 ? title.name.slice(0, 57) + "…" : title.name}
          </div>
          <div style={{ fontSize: 28, color: "#a1a1aa" }}>{meta}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <div
              style={{
                display: "flex",
                background: "linear-gradient(90deg, #f97316, #db2777)",
                color: "white",
                fontSize: 28,
                fontWeight: 700,
                borderRadius: 999,
                padding: "14px 36px",
              }}
            >
              ▶ Watch Free
            </div>
            <div
              style={{
                display: "flex",
                border: "2px solid #3f3f46",
                color: "#d4d4d8",
                fontSize: 28,
                fontWeight: 600,
                borderRadius: 999,
                padding: "14px 36px",
              }}
            >
              No subscription · whisco.tv
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
