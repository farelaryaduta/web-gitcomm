"use client";

import { useEffect, useState } from "react";
import type { PackageCommand } from "@/lib/package-managers";

export function PackageCommands({
  variants,
  caption,
  note,
}: {
  variants: PackageCommand[];
  caption?: string;
  note?: string;
}) {
  const [active, setActive] = useState(variants[0].manager);
  const [copied, setCopied] = useState(false);

  const selected =
    variants.find((variant) => variant.manager === active) ?? variants[0];

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(selected.code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className="overflow-hidden rounded border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-2 border-b border-line px-2 py-1.5">
        <div
          role="tablist"
          aria-label="Package manager"
          className="flex items-center gap-1"
        >
          {variants.map((variant) => {
            const isActive = variant.manager === active;
            return (
              <button
                key={variant.manager}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`pm-panel-${variant.manager}`}
                id={`pm-tab-${variant.manager}`}
                onClick={() => setActive(variant.manager)}
                className={`cursor-pointer rounded-sm px-2 py-1 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors ${
                  isActive
                    ? "bg-surface-strong text-ink"
                    : "text-ink-faint hover:text-ink"
                }`}
              >
                {variant.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy to clipboard"}
          className="ml-auto cursor-pointer rounded-sm px-1.5 py-0.5 font-mono text-[11px] text-ink-faint transition-colors hover:bg-surface-strong hover:text-ink"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>

      <div
        role="tabpanel"
        id={`pm-panel-${selected.manager}`}
        aria-labelledby={`pm-tab-${selected.manager}`}
        className="px-4 py-4"
      >
        {caption ? (
          <p className="mb-3 text-[13px] leading-relaxed text-ink-muted">
            {caption}
          </p>
        ) : null}
        <pre className="overflow-x-auto text-[13px] leading-relaxed">
          <code className="font-mono text-ink">{selected.code}</code>
        </pre>
        {note ? (
          <p className="mt-3 font-mono text-[11px] text-ink-faint">{note}</p>
        ) : null}
      </div>
    </figure>
  );
}