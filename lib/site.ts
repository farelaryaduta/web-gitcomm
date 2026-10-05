export const siteConfig = {
  name: "gitcomm",
  url: "https://gitcomm.web.id",
  author: "farelaryaduta",
  repo: "https://github.com/farelaryaduta/commit-in",
  npm: "https://www.npmjs.com/package/gitcomm",
  tagline: "Commit messages that match your repository's style.",
  /** Served by the /og route. Declared here so every page can reference it. */
  ogImage: {
    url: "/og",
    width: 1200,
    height: 630,
    alt: "gitcomm — commit messages that match your repository's style",
  },
} as const;