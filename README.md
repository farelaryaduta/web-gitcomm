# gitcomm-website

Documentation website for [gitcomm](https://github.com/farelaryaduta/commit-in), built with Next.js 16 (App Router, Turbopack), React 19, TypeScript, and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check (run `npx next typegen` first) |

## Content

Docs live in `lib/docs.ts` as a typed registry. Each page has a `title`, `summary`, and a `body` array of typed blocks rendered by `components/doc-content.tsx`. Slugs come from the entry itself, so adding a page to the array adds it to the left nav, right TOC, `generateStaticParams`, and the sitemap.

Content is derived from the real package: its README and `src/cli.ts` in `farelaryaduta/commit-in`. Keep flags and defaults in sync with the source rather than guessing.

## Structure

| Path | Role |
| --- | --- |
| `app/` | Routes: home, `docs/[slug]`, `not-found`, `sitemap.ts`, `robots.ts` |
| `components/` | Shell, nav, TOC, code block, prose renderers, JSON-LD |
| `lib/docs.ts` | Docs registry and heading extraction |
| `lib/site.ts` | Site name, author, repo/npm links, canonical URL |

Everything is static or SSG. No CMS, no MDX pipeline, no client data fetching.

## Theming

Strict monochrome in both modes. Tokens live in `app/globals.css` under `:root` and `[data-theme="dark"]`. Colors use Tailwind v4 `@theme` aliases (`--color-line`, `--color-ink`, etc.), so components reference `border-line`, `text-ink-muted`, and similar. The theme toggle writes `localStorage.gitcomm-theme` and an inline script in `app/layout.tsx` applies it before paint to avoid a flash.

Before shipping, confirm the production domain: `siteConfig.url` in `lib/site.ts` drives canonical URLs, OpenGraph, sitemap, robots, and JSON-LD.