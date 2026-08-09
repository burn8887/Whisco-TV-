import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 font-extrabold text-xl tracking-tight ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-mark.png"
        alt="Whisco TV"
        className="w-9 h-9 rounded-lg object-cover shadow-md shadow-orange-900/20"
      />
      <span>
        Whisco <span className="text-gradient">TV</span>
      </span>
    </Link>
  );
}
