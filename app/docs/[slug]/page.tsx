import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { DocContent } from "@/components/doc-content";
import { DocJsonLd } from "@/components/json-ld";
import { DocsNav } from "@/components/docs-nav";
import { TableOfContents, TocList } from "@/components/table-of-contents";
import { docPages, getDocPage, getHeadings } from "@/lib/docs";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return docPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocPage(slug);

  if (!page) return {};

  const description = page.summary;

  return {
    title: page.title,
    description,
    alternates: { canonical: `/docs/${page.slug}` },
    openGraph: {
      title: `${page.title} · gitcomm`,
      description,
      url: `${siteConfig.url}/docs/${page.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} · gitcomm`,
      description,
    },
  };
}

export default async function DocPageRoute({
  params,
}: PageProps<"/docs/[slug]">) {
  const { slug } = await params;
  const page = getDocPage(slug);

  if (!page) notFound();

  const headings = getHeadings(page);
  const index = docPages.findIndex((entry) => entry.slug === page.slug);
  const previous = index > 0 ? docPages[index - 1] : undefined;
  const next = index < docPages.length - 1 ? docPages[index + 1] : undefined;

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <DocJsonLd slug={page.slug} />
      <div className="border-x border-line lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_14rem]">
        <aside className="border-b border-line py-8 lg:border-b-0 lg:border-r lg:pr-6">
          <div className="lg:sticky lg:top-22">
            <DocsNav />
          </div>
        </aside>

        <article className="min-w-0 border-line px-6 py-10 sm:px-10 lg:border-r xl:border-r-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
            Documentation
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
            {page.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {page.summary}
          </p>

          {headings.length > 1 ? (
            <details className="mt-6 rounded border border-line bg-surface px-4 py-3 xl:hidden">
              <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                On this page
              </summary>
              <div className="mt-3">
                <TocList headings={headings} />
              </div>
            </details>
          ) : null}

          <div className="mt-10 border-t border-line pt-10">
            <DocContent blocks={page.blocks} />
          </div>

          <nav
            aria-label="Pagination"
            className="mt-16 grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={`/docs/${previous.slug}`}
                className="group bg-canvas p-5 transition-colors hover:bg-surface"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                  Previous
                </span>
                <span className="mt-2 block font-medium text-ink">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span className="hidden bg-canvas sm:block" />
            )}
            {next ? (
              <Link
                href={`/docs/${next.slug}`}
                className="group bg-canvas p-5 text-right transition-colors hover:bg-surface"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                  Next
                </span>
                <span className="mt-2 block font-medium text-ink">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span className="hidden bg-canvas sm:block" />
            )}
          </nav>
        </article>

        <aside className="hidden border-l border-line py-10 pl-6 xl:block">
          <div className="sticky top-22">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}