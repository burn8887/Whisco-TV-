"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

// Share button with UTM-tagged URLs so Vercel Analytics shows which
// communities convert. Native share sheet on mobile (WhatsApp-first in the
// Gulf), copy-to-clipboard fallback on desktop.
export default function ShareButton({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://whisco.tv${path}?utm_source=share&utm_medium=social&utm_campaign=title_share`;
  const text = `${title} — watch free on Whisco TV (no subscription):`;

  async function onShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} — Whisco TV`, text, url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      onClick={onShare}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:border-orange-500/50 transition"
      aria-label={`Share ${title}`}
    >
      {copied ? <Check size={15} className="text-green-400" /> : <Share2 size={15} />}
      {copied ? "Link copied!" : "Share"}
    </button>
  );
}
