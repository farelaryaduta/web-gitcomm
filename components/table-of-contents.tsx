"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: 2 | 3 };

function HeadingLinks({
  headings,
  activeId,
}: {
  headings: Heading[];
  activeId: string | null;
}) {
  return (
    <ul className="space-y-1.5 border-l border-line">
      {headings.map((heading) => {
        const isActive = activeId === heading.id;
        return (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`-ml-px block border-l py-0.5 leading-snug transition-colors ${
                heading.level === 3 ? "pl-6" : "pl-3"
              } ${
                isActive
                  ? "border-ink font-medium text-ink"
                  : "border-transparent text-ink-faint hover:border-line-strong hover:text-ink"
              }`}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Static outline for the collapsed "On this page" disclosure below xl. */
export function TocList({ headings }: { headings: Heading[] }) {
  return <HeadingLinks headings={headings} activeId={null} />;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
          return;
        }

        // Nothing intersecting: fall back to the last heading scrolled past.
        const scrolled = elements.filter(
          (el) => el.getBoundingClientRect().top < 120,
        );
        setActiveId(
          scrolled.length > 0
            ? scrolled[scrolled.length - 1].id
            : elements[0].id,
        );
      },
      { rootMargin: "-88px 0px -65% 0px", threshold: [0, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
        On this page
      </p>
      <HeadingLinks headings={headings} activeId={activeId} />
    </nav>
  );
}