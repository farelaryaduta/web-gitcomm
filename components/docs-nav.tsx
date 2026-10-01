"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { docSections } from "@/lib/docs";

export function DocsNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="docs-nav-panel"
        className="flex w-full cursor-pointer items-center justify-between rounded border border-line bg-surface px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface-strong lg:hidden"
      >
        <span className="font-mono text-xs uppercase tracking-[0.12em]">
          Browse docs
        </span>
        <svg
          viewBox="0 0 12 12"
          aria-hidden="true"
          className={`size-3 fill-none stroke-current transition-transform ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth="1.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5 6 7.5l3-3" />
        </svg>
      </button>

      <div
        id="docs-nav-panel"
        hidden={!open}
        className="mt-3 rounded border border-line bg-surface p-4 lg:hidden"
      >
        <DocsNavList pathname={pathname} onNavigate={() => setOpen(false)} />
      </div>

      <div className="hidden lg:block">
        <DocsNavList pathname={pathname} />
      </div>
    </>
  );
}

function DocsNavList({
  pathname,
  onNavigate,
}: {
  pathname: string | null;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Documentation" className="space-y-6">
      {docSections.map((section) => (
        <div key={section.label}>
          <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
            {section.label}
          </p>
          <ul className="space-y-0.5 border-l border-line">
            {section.pages.map((page) => {
              const href = `/docs/${page.slug}`;
              const isActive = pathname === href;
              return (
                <li key={page.slug}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={`-ml-px block border-l py-1 pl-3 text-sm leading-snug transition-colors ${
                      isActive
                        ? "border-ink font-medium text-ink"
                        : "border-transparent text-ink-muted hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {page.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}