import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "gitcomm — commit messages that match your repo's style",
    template: "%s · gitcomm",
  },
  description:
    "gitcomm reads your staged diff and your commit history, then suggests messages that fit the way your repository already writes commits. Works on any Git repo, no setup required.",
  keywords: [
    "git",
    "commit message",
    "conventional commits",
    "cli",
    "developer tools",
    "git commit generator",
  ],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    siteName: "gitcomm",
    title: "gitcomm — commit messages that match your repo's style",
    description:
      "AI-powered commit messages that match your repository's style. Reads your diff, learns your history, commits for you.",
    url: siteConfig.url,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "gitcomm — commit messages that match your repo's style",
    description:
      "AI-powered commit messages that match your repository's style. Reads your diff, learns your history, commits for you.",
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

const themeScript = `(function(){try{var s=localStorage.getItem("gitcomm-theme");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=s||(m?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
          suppressHydrationWarning
        />
      </head>
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-inverted focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-inverted-ink"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-sm">
          <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-6 px-5 sm:px-8">
            <Link
              href="/"
              className="font-mono text-[15px] font-semibold tracking-tight text-ink"
            >
              gitcomm<span className="text-ink-faint">.</span>
            </Link>

            <nav aria-label="Main" className="hidden items-center gap-5 sm:flex">
              <Link
                href="/docs/getting-started"
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                Docs
              </Link>
              <Link
                href="/docs/commands"
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                Commands
              </Link>
            </nav>

            <div className="ml-auto flex items-center gap-1">
              <Link
                href={siteConfig.npm}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-sm px-2.5 py-1.5 font-mono text-xs text-ink-muted transition-colors hover:bg-surface-strong hover:text-ink"
              >
                npm
              </Link>
              <a
                href={siteConfig.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-sm p-2 text-ink-muted transition-colors hover:bg-surface-strong hover:text-ink"
              >
                <span className="sr-only">gitcomm on GitHub</span>
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="size-4 fill-current"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-2.91-.89-2.91-2.97 0-.66.24-1.19.63-1.61-.06-.2-.28-.82.06-1.71 0 0 .52-.17 1.7.62a5.9 5.9 0 0 1 3.1 0c1.18-.79 1.7-.62 1.7-.62.34.89.12 1.51.06 1.71.4.42.63.95.63 1.61 0 2.09-1.14 2.76-2.92 2.96.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main id="main" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:px-8">
            <p className="font-mono text-xs text-ink-faint">
              gitcomm — MIT licensed
            </p>
            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:ml-auto"
            >
              <Link
                href="/docs/getting-started"
                className="text-xs text-ink-muted transition-colors hover:text-ink"
              >
                Getting started
              </Link>
              <Link
                href="/docs/usage"
                className="text-xs text-ink-muted transition-colors hover:text-ink"
              >
                Usage
              </Link>
              <a
                href={siteConfig.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs text-ink-muted transition-colors hover:text-ink"
              >
                Source
              </a>
              <a
                href={siteConfig.npm}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs text-ink-muted transition-colors hover:text-ink"
              >
                npm
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}