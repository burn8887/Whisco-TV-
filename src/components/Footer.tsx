import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>
          © {new Date().getFullYear()} Whisco TV — 100% free, ad-supported streaming. No subscription, ever.
        </p>
        <nav className="flex items-center gap-5">
          <Link href="/about" className="hover:text-zinc-300 transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">
            Terms of Use
          </Link>
          <a href="mailto:legal@whisco.tv" className="hover:text-zinc-300 transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
