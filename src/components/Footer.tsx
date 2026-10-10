import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>
          © {new Date().getFullYear()} Whisco TV — 100% free, ad-supported streaming. No subscription, ever.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          <Link href="/about" className="hover:text-zinc-300 transition-colors">
            About
          </Link>
          <a
            href="https://play.google.com/store/apps/details?id=tv.whisco.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get Whisco TV on Google Play"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-zinc-950/70 px-3 py-1.5 text-zinc-200 transition-colors hover:border-white/20 hover:bg-zinc-900 hover:text-white"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path fill="#4285F4" d="M3.4 3.3c-.2.3-.4.7-.4 1.2v15c0 .5.1.9.4 1.2L12.1 12 3.4 3.3z" />
              <path fill="#34A853" d="M3.4 3.3c.5-.5 1.3-.6 2.1-.1l8.2 4.7-1.6 4.1-8.7-8.7z" />
              <path fill="#FBBC04" d="m13.7 7.9 6.4 3.7c1.1.6 1.1 1.5 0 2.1l-6.4 3.7-2.8-5.1 2.8-4.4z" />
              <path fill="#EA4335" d="m3.4 20.7 8.7-8.7 2.8 5.4-9.4 5.4c-.9.5-1.7.4-2.1-.1z" />
            </svg>
            <span className="flex flex-col text-left leading-tight">
              <span className="text-[8px] font-medium uppercase tracking-wide text-zinc-400">Get it on</span>
              <span className="text-xs font-bold">Google Play</span>
            </span>
          </a>
          <Link href="/contact" className="hover:text-zinc-300 transition-colors">
            Contact Us
          </Link>
          <Link href="/new" className="hover:text-zinc-300 transition-colors">
            New This Week
          </Link>
          <Link href="/guides" className="hover:text-zinc-300 transition-colors">
            Guides
          </Link>
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">
            Terms of Use
          </Link>

        </nav>
      </div>
    </footer>
  );
}
