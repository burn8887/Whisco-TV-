"use client";

import { useEffect, useState } from "react";
import { Share, PlusSquare, X, Download } from "lucide-react";

// PWA bootstrap: registers the service worker, offers Android/desktop users a
// real install button when the browser fires beforeinstallprompt, and shows
// iPhone/iPad users a one-time "Add to Home Screen" hint (Apple provides no
// install prompt of its own). Dismissals are remembered in localStorage.

const DISMISS_KEY = "whisco-install-dismissed";
const IOS_HINT_DELAY_MS = 12000; // let them browse a little first

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaSetup() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    // 1. Service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const dismissed = localStorage.getItem(DISMISS_KEY);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari exposes navigator.standalone
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (dismissed || standalone) return;

    // 2. Android/desktop install prompt
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // 3. iOS hint (no beforeinstallprompt on iOS)
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isIos) {
      timer = setTimeout(() => setShowIosHint(true), IOS_HINT_DELAY_MS);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      if (timer) clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setInstallEvent(null);
    setShowIosHint(false);
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setInstallEvent(null);
    else dismiss();
  }

  if (installEvent) {
    return (
      <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:w-96 z-50 rounded-2xl bg-zinc-900 ring-1 ring-white/10 shadow-2xl p-4 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-192.png" alt="Whisco TV" className="w-12 h-12 rounded-xl shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">Get the Whisco TV app</p>
          <p className="text-xs text-zinc-400">Free • Installs in one tap • No app store needed</p>
        </div>
        <button
          onClick={install}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-pink-600"
        >
          <Download size={14} /> Install
        </button>
        <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 text-zinc-500 hover:text-zinc-300">
          <X size={16} />
        </button>
      </div>
    );
  }

  if (showIosHint) {
    return (
      <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:w-96 z-50 rounded-2xl bg-zinc-900 ring-1 ring-white/10 shadow-2xl p-4">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="Whisco TV" className="w-12 h-12 rounded-xl shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Add Whisco TV to your Home Screen</p>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Tap <Share size={12} className="inline -mt-0.5" /> <span className="font-semibold text-zinc-300">Share</span>, then{" "}
              <PlusSquare size={12} className="inline -mt-0.5" /> <span className="font-semibold text-zinc-300">Add to Home Screen</span> — free, and it works like an app.
            </p>
          </div>
          <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 text-zinc-500 hover:text-zinc-300">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
