import type { Metadata } from "next";
import Link from "next/link";
import { Tv2, Film, Globe2, ShieldCheck, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Whisco TV is a free, ad-supported streaming service for expatriate communities in the Gulf — live TV and on-demand movies and series in 13 languages. No subscription, ever.",
};

export default async function AboutPage() {
  const [channels, titles, countries] = await Promise.all([
    prisma.channel.count({ where: { isActive: true } }),
    prisma.title.count({ where: { isActive: true } }),
    prisma.channel.findMany({ distinct: ["country"], where: { isActive: true }, select: { country: true } }),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-2">About Whisco TV</h1>
      <p className="text-zinc-400 mb-10">Free TV for the communities that call the Gulf home.</p>

      <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">What we are</h2>
          <p>
            Whisco TV is a <span className="text-emerald-400 font-semibold">100% free, ad-supported</span> streaming
            service built for expatriate communities across Bahrain, Saudi Arabia, the UAE, Kuwait, Qatar, and Oman —
            and for anyone, anywhere, who wants TV from home. South Asian, Filipino, Arab, Indonesian, Nepali, Sri
            Lankan, and Turkish-drama audiences all have a shelf here, in their own language. There is no subscription,
            no credit card, and no catch: advertising keeps the lights on.
          </p>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Tv2, label: "Live channels", value: `${channels}+` },
            { icon: Film, label: "On-demand titles", value: `${titles.toLocaleString()}+` },
            { icon: Globe2, label: "Countries of origin", value: `${countries.length}+` },
            { icon: ShieldCheck, label: "Languages", value: "13" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-zinc-900/70 ring-1 ring-white/5 p-4 text-center">
              <s.icon size={18} className="mx-auto text-orange-400 mb-2" />
              <p className="text-xl font-extrabold text-white">{s.value}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Where our content comes from</h2>
          <p>
            Everything on Whisco TV comes from legitimate sources: free-to-air broadcaster streams, official
            broadcaster and production-company channels (which keep their own advertising and control), public-domain
            catalogs, and licensed distribution partners. Our catalog is monitored automatically around the clock —
            dead or unavailable sources are removed within hours, and content that isn&apos;t available in our viewers&apos;
            region is filtered out rather than shown broken.
          </p>
          <p className="mt-2">
            Rights holders: if you&apos;d like a source reviewed, updated, or removed, contact us and we&apos;ll respond
            promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Work with us</h2>
          <p>
            We partner with content owners, distributors, and advertisers who want to reach Gulf expatriate audiences.
            If you have content to license to us or want to advertise on Whisco TV, we&apos;d love to talk.
          </p>
        </section>

        <section className="rounded-2xl bg-zinc-900/70 ring-1 ring-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Mail size={18} className="text-orange-400" /> Contact
          </h2>
          <ul className="space-y-2">
            <li>
              <span className="text-zinc-500 w-32 inline-block">Partnerships:</span>
              <a href="mailto:partnerships@whisco.tv" className="text-orange-400 hover:underline">partnerships@whisco.tv</a>
            </li>
            <li>
              <span className="text-zinc-500 w-32 inline-block">Rights holders:</span>
              <a href="mailto:legal@whisco.tv" className="text-orange-400 hover:underline">legal@whisco.tv</a>
            </li>
            <li>
              <span className="text-zinc-500 w-32 inline-block">Privacy:</span>
              <a href="mailto:privacy@whisco.tv" className="text-orange-400 hover:underline">privacy@whisco.tv</a>
            </li>
          </ul>
          <p className="text-xs text-zinc-500 mt-4">
            See also our <Link href="/privacy" className="text-zinc-300 hover:underline">Privacy Policy</Link> and{" "}
            <Link href="/terms" className="text-zinc-300 hover:underline">Terms of Use</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
