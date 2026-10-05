import Link from "next/link";
import type { DocCrumb } from "@/lib/docs";

type BreadcrumbsProps = {
  trail: DocCrumb[];
};

/**
 * Server-rendered trail. The last crumb is plain text: it is the page you are
 * already on, so linking it would be a self-referential anchor.
 */
export function Breadcrumbs({ trail }: BreadcrumbsProps) {
  const last = trail.length - 1;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
        {trail.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            {index === last ? (
              <span aria-current="page" className="text-ink">
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="transition-colors hover:text-ink"
              >
                {crumb.name}
              </Link>
            )}
            {index < last ? (
              <span aria-hidden="true" className="text-line-strong">
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
