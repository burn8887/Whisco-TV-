import Link from "next/link";
import Image from "next/image";
import { Star, Lock } from "lucide-react";

export default function TitleCard({
  title,
  locked = false,
  variant = "row",
}: {
  title: { slug: string; name: string; posterUrl: string; imdbRating: number; releaseYear: number; type: string; isNew?: boolean };
  locked?: boolean;
  variant?: "row" | "grid";
}) {
  return (
    <Link
      href={`/title/${title.slug}`}
      className={`group relative rounded-lg overflow-hidden bg-zinc-900 ring-1 ring-white/5 hover:ring-orange-500/60 transition-all hover:-translate-y-1 ${
        variant === "row" ? "shrink-0 w-[160px] sm:w-[180px]" : "w-full"
      }`}
    >
      <div className="relative w-full aspect-[2/3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={title.posterUrl} alt={title.name} className="w-full h-full object-cover" />
        {locked && (
          <div className="absolute inset-0 bg-black/60 grid place-items-center backdrop-blur-[1px]">
            <Lock className="text-white/90" size={26} />
          </div>
        )}
        {title.isNew && !locked && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500 text-white">NEW</span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 pt-6">
          <p className="text-xs font-semibold leading-tight line-clamp-2">{title.name}</p>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400">
            <span className="flex items-center gap-0.5 text-amber-400">
              <Star size={10} fill="currentColor" /> {title.imdbRating.toFixed(1)}
            </span>
            <span>{title.releaseYear}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
