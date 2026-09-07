"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

// HOME TIME — the single best idea from the Sept 2026 clean-room experiment.
// Shows the current local time in the "home city" of the selected language
// community ("8:02 PM in Kochi"). A timezone string + a language→city map:
// zero licensing, zero backend, outsized belonging. A Malayali in Manama
// instantly knows whether amma is watching the evening news right now.
const HOME_CITY: Record<string, { city: string; tz: string }> = {
  Malayalam: { city: "Kochi", tz: "Asia/Kolkata" },
  Hindi: { city: "Mumbai", tz: "Asia/Kolkata" },
  Tamil: { city: "Chennai", tz: "Asia/Kolkata" },
  Telugu: { city: "Hyderabad", tz: "Asia/Kolkata" },
  Punjabi: { city: "Amritsar", tz: "Asia/Kolkata" },
  Bengali: { city: "Dhaka", tz: "Asia/Dhaka" },
  Urdu: { city: "Karachi", tz: "Asia/Karachi" },
  Nepali: { city: "Kathmandu", tz: "Asia/Kathmandu" },
  Sinhala: { city: "Colombo", tz: "Asia/Colombo" },
  Filipino: { city: "Manila", tz: "Asia/Manila" },
  Indonesian: { city: "Jakarta", tz: "Asia/Jakarta" },
  Turkish: { city: "Istanbul", tz: "Europe/Istanbul" },
  Arabic: { city: "Cairo", tz: "Africa/Cairo" },
  Vietnamese: { city: "Hanoi", tz: "Asia/Bangkok" },
  Thai: { city: "Bangkok", tz: "Asia/Bangkok" },
};

export default function HomeTime({ language }: { language?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!language || !now) return null;
  const home = HOME_CITY[language];
  if (!home) return null;

  let timeStr: string;
  try {
    timeStr = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: home.tz,
    }).format(now);
  } catch {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-zinc-400">
      <Clock size={14} className="text-orange-400" />
      <span>
        {timeStr} <span className="text-zinc-500">right now in {home.city}</span>
      </span>
    </span>
  );
}
