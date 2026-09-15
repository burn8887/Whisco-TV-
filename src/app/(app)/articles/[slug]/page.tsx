import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock, ArrowLeft, Play } from "lucide-react";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.whisco.tv";

/**
 * ARTICLE PAGE — one piece of in-house writing.
 *
 * The body is stored as light markdown and rendered by the small formatter
 * below. Deliberately no markdown dependency: the subset we use (headings,
 * bold, italic, lists, paragraphs, links) is tiny, and a dependency added
 * mid-freeze is a risk with no upside.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await prisma.article.findFirst({ where: { slug, published: true }, select: { headline: true, dek: true, body: true, publishedAt: true, title: { select: { name: true, slug: true } } } });
  if (!a) return { title: "Not found — Whisco TV" };
  return {
    title: `${a.headline} | Whisco TV`,
    description: a.dek.slice(0, 300),
    alternates: { canonical: `${SITE_URL}/articles/${slug}` },
    openGraph: { title: a.headline, description: a.dek.slice(0, 200), url: `${SITE_URL}/articles/${slug}`, type: "article", ...(a.publishedAt ? { publishedTime: a.publishedAt.toISOString() } : {}) },
  };
}

function inline(text: string): string {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function Markdown({ body }: { body: string }) {
  const lines = body.split("\n");
  const out: React.ReactElement[] = [];
  let list: string[] = [];
  const flush = (key: string) => {
    if (list.length) {
      out.push(
        <ul key={key} className="my-5 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-neutral-300">
          {list.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: inline(li) }} />)}
        </ul>
      );
      list = [];
    }
  };
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (line.startsWith("- ")) { list.push(line.slice(2)); return; }
    flush(`l${i}`);
    if (!line) return;
    if (line.startsWith("### ")) { out.push(<h3 key={i} className="mt-8 mb-3 text-lg font-semibold text-neutral-100">{line.slice(4)}</h3>); return; }
    if (line.startsWith("## ")) { out.push(<h2 key={i} className="mt-10 mb-4 text-xl font-semibold text-neutral-100">{line.slice(3)}</h2>); return; }
    if (/^\d+\.\s/.test(line)) {
      out.push(<p key={i} className="my-3 pl-1 text-[15px] leading-relaxed text-neutral-300" dangerouslySetInnerHTML={{ __html: inline(line) }} />);
      return;
    }
    out.push(<p key={i} className="my-4 text-[16px] leading-[1.8] text-neutral-300" dangerouslySetInnerHTML={{ __html: inline(line) }} />);
  });
  flush("end");
  return <>{out}</>;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, published: true },
    select: {
      slug: true, headline: true, dek: true, body: true, author: true, readingTimeMins: true,
      tags: true, publishedAt: true, kind: true, episodeNumber: true,
      title: { select: { slug: true, name: true, isActive: true, articles: { where: { published: true, slug: { not: slug } }, orderBy: { publishedAt: "desc" }, take: 3, select: { slug: true, headline: true, kind: true, readingTimeMins: true } } } },
    },
  });
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.dek,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "Whisco TV", url: SITE_URL },
    ...(article.publishedAt ? { datePublished: article.publishedAt.toISOString(), dateModified: article.publishedAt.toISOString() } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/articles/${slug}` },
    about: { "@type": "TVSeries", name: article.title.name },
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-neutral-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="mx-auto max-w-2xl px-5 py-12">
        <Link href={`/shows/${article.title.slug}`} className="inline-flex items-center gap-1.5 text-xs text-neutral-500 transition hover:text-orange-400">
          <ArrowLeft size={13} /> All writing on {article.title.name}
        </Link>

        <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.18em] text-orange-400">
          {article.episodeNumber ? `${article.title.name} · Episode ${article.episodeNumber}` : article.title.name}
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-[38px]">{article.headline}</h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-400">{article.dek}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-neutral-800 py-3 text-xs text-neutral-500">
          <span>{article.author}</span>
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {article.readingTimeMins} min read</span>
          {article.publishedAt ? <time dateTime={article.publishedAt.toISOString()}>{article.publishedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time> : null}
        </div>

        <div className="mt-2"><Markdown body={article.body} /></div>

        {article.tags?.length ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((t) => <span key={t} className="rounded-full border border-neutral-800 px-3 py-1 text-[11px] text-neutral-400">{t}</span>)}
          </div>
        ) : null}

        <div className="mt-12 rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-[#0a0a0f] p-6">
          <p className="text-sm text-neutral-300">
            <strong className="font-semibold text-neutral-100">{article.title.name}</strong> is streaming free on Whisco TV — 600+ live channels and 16,000+ movies and shows, no subscription, no signup.
          </p>
          <Link href={`/title/${article.title.slug}`} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
            <Play size={15} /> Watch now
          </Link>
        </div>

        {article.title.articles.length ? (
          <div className="mt-12 border-t border-neutral-800 pt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">More on {article.title.name}</h2>
            <ul className="space-y-3">
              {article.title.articles.map((a) => (
                <li key={a.slug}>
                  <Link href={`/articles/${a.slug}`} className="group block">
                    <span className="text-[15px] font-medium text-neutral-200 group-hover:text-orange-300">{a.headline}</span>
                    <span className="ml-2 text-xs text-neutral-500">{a.readingTimeMins} min</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>
    </div>
  );
}
