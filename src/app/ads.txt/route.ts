import { NextResponse } from "next/server";

// ads.txt — required by AdSense and all programmatic buyers to verify that
// this site's ad inventory is legitimately sold. Content comes from the
// ADS_TXT env var so publisher IDs never live in the repo, e.g.:
//   ADS_TXT="google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0"
// Returns 404 until configured, which is correct pre-approval behavior.

export const dynamic = "force-dynamic";

export function GET() {
  const content = process.env.ADS_TXT;
  if (!content) {
    return new NextResponse("Not configured", { status: 404 });
  }
  return new NextResponse(content.replace(/\\n/g, "\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
