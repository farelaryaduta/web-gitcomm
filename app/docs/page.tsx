import { permanentRedirect } from "next/navigation";

/**
 * Permanent (308) so the docs index is treated as settled rather than as a
 * temporary hop on every crawl. The destination is the first real page.
 */
export default function DocsIndex() {
  permanentRedirect("/docs/getting-started");
}