"use client";

import { useEffect, useState } from "react";

export function CodeBlock({
  code,
  lang,
  caption,
}: {
  code: string;
  lang?: string;
  caption?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className="group overflow-hidden rounded border border-line bg-surface">
      <figcaption className="flex items-center gap-3 border-b border-line px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
          {caption ?? lang ?? "shell"}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy to clipboard"}
          className="ml-auto cursor-pointer rounded-sm px-1.5 py-0.5 font-mono text-[11px] text-ink-faint transition-colors hover:bg-surface-strong hover:text-ink"
        >
          {copied ? "copied" : "copy"}
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed">
        <code className="font-mono text-ink">{code}</code>
      </pre>
    </figure>
  );
}