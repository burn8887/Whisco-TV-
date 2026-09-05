"use client";

import { useState } from "react";
import { MessageCircle, Check } from "lucide-react";

// "Copy message" — fills the clipboard with a human-sounding, language-aware
// caption ready to paste into WhatsApp/Telegram family groups. Research-driven
// (Gulf sharing study, Sep 2026): forwards lead with LANGUAGE + runtime +
// "free, no signup", in the sender's own voice — never brand-first marketing.
const CAPTIONS: Record<string, (name: string, meta: string, url: string) => string> = {
  Malayalam: (n, m, u) => `പുതിയത് — ${n} (${m}). ഫ്രീ ആണ്, signup വേണ്ട: ${u}`,
  Tamil: (n, m, u) => `புதியது — ${n} (${m}). இலவசம், பதிவு தேவையில்லை: ${u}`,
  Hindi: (n, m, u) => `नया — ${n} (${m})। बिल्कुल फ्री, बिना साइनअप: ${u}`,
  Urdu: (n, m, u) => `نیا — ${n} (${m})۔ بالکل فری، بغیر سائن اپ: ${u}`,
  Filipino: (n, m, u) => `Bago — ${n} (${m}). Libre, walang signup: ${u}`,
  Arabic: (n, m, u) => `جديد — ${n} (${m}). مجاني بدون تسجيل: ${u}`,
  Turkish: (n, m, u) => `${n} (${m}) — free to watch, no signup: ${u}`,
};

const DEFAULT_CAPTION = (n: string, m: string, u: string) =>
  `Worth a watch — ${n} (${m}). Free, no signup: ${u}`;

export default function CopyMessageButton({
  name,
  language,
  meta,
  path,
}: {
  name: string;
  language: string;
  meta: string; // e.g. "Malayalam · 2h 10m" or "Series · 183 episodes"
  path: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = `https://whisco.tv${path}?utm_source=copymsg&utm_medium=chat&utm_campaign=family_forward`;
  const build = CAPTIONS[language] ?? DEFAULT_CAPTION;

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(build(name, meta, url));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      onClick={onCopy}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:border-green-500/50 transition"
      aria-label={`Copy a share message for ${name}`}
      title="Copies a ready-to-paste message for WhatsApp / Telegram"
    >
      {copied ? <Check size={15} className="text-green-400" /> : <MessageCircle size={15} />}
      {copied ? "Message copied!" : "Copy message"}
    </button>
  );
}
