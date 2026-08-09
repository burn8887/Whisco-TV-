"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Row({ title, children }: { title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: number) {
    ref.current?.scrollBy({ left: dir * 700, behavior: "smooth" });
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
        <div className="hidden sm:flex gap-1">
          <button onClick={() => scroll(-1)} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll(1)} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-3 overflow-x-auto no-scrollbar pb-2 scroll-smooth">
        {children}
      </div>
    </section>
  );
}
