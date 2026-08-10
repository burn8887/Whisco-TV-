import Link from "next/link";

export default function Logo({ className = "", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const imgSize = size === "lg" ? "w-14 h-14 sm:w-16 sm:h-16" : "w-11 h-11 sm:w-12 sm:h-12";
  const textSize = size === "lg" ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl";

  return (
    <Link href="/" className={`group flex items-center gap-2.5 font-extrabold tracking-tight ${textSize} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-mark.png"
        alt="Whisco TV — Whisco the Shih Tzu"
        className={`${imgSize} rounded-xl object-cover shadow-lg shadow-orange-900/30 ring-2 ring-white/10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 animate-wiggle-slow`}
      />
      <span>
        Whisco <span className="text-gradient">TV</span>
      </span>
    </Link>
  );
}
