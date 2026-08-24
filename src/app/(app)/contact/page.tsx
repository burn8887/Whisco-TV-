import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Handshake, Scale, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Whisco TV — partnerships and advertising, rights holder requests, and privacy questions.",
};

const CONTACTS = [
  {
    icon: Handshake,
    title: "Partnerships & Advertising",
    email: "partnerships@whisco.tv",
    blurb:
      "Content licensing, distribution partnerships, and advertising on Whisco TV. We work with studios, distributors, and brands who want to reach Gulf expatriate audiences.",
  },
  {
    icon: Scale,
    title: "Rights Holders & Legal",
    email: "legal@whisco.tv",
    blurb:
      "If you are a rights holder and would like a content source reviewed, updated, or removed, contact us here — we respond promptly to all legitimate requests.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy",
    email: "privacy@whisco.tv",
    blurb: "Questions about your data or our privacy practices. See also our Privacy Policy.",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-2">Contact Us</h1>
      <p className="text-zinc-400 mb-10">
        We read everything. Pick the right inbox below and we&apos;ll get back to you as soon as we can.
      </p>

      <div className="space-y-4">
        {CONTACTS.map((c) => (
          <a
            key={c.email}
            href={`mailto:${c.email}`}
            className="flex items-start gap-4 rounded-2xl bg-zinc-900/70 ring-1 ring-white/5 hover:ring-orange-500/40 transition p-5 group"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-600/20 ring-1 ring-orange-500/30 grid place-items-center">
              <c.icon size={18} className="text-orange-400" />
            </div>
            <div className="min-w-0">
              <p className="font-bold">{c.title}</p>
              <p className="text-sm text-orange-400 group-hover:underline flex items-center gap-1.5 mt-0.5">
                <Mail size={13} /> {c.email}
              </p>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{c.blurb}</p>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-zinc-500 mt-8">
        More about who we are on the <Link href="/about" className="text-zinc-300 hover:underline">About page</Link>. Legal
        documents: <Link href="/privacy" className="text-zinc-300 hover:underline">Privacy Policy</Link> ·{" "}
        <Link href="/terms" className="text-zinc-300 hover:underline">Terms of Use</Link>.
      </p>
    </div>
  );
}
