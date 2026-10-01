import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <div className="border-x border-line px-6 py-28 sm:px-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
          No such commit.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
          That path does not exist on this site. The documentation index is the
          fastest way back.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/docs/getting-started"
            className="rounded-sm bg-inverted px-5 py-2.5 text-sm font-medium text-inverted-ink transition-opacity hover:opacity-85"
          >
            Get started
          </Link>
          <Link
            href="/"
            className="rounded-sm border border-line-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}