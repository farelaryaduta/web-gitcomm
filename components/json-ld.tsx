import { getDocPage, getDocTrail, getHeadings } from "@/lib/docs";
import { siteConfig } from "@/lib/site";

type JsonLd = Record<string, unknown>;

const DESCRIPTION =
  "gitcomm reads your staged diff and your commit history, then suggests commit messages that match the way your repository already writes them.";

/** Nodes are emitted as one @graph so a page carries a single JSON-LD script. */
function JsonLd({ nodes }: { nodes: JsonLd[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // `<` is escaped so no value can close the script element early.
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": nodes,
        }).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** The home entity. `@id`s are stable so other nodes can reference it. */
const webSiteNode: JsonLd = {
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  url: siteConfig.url,
  description: DESCRIPTION,
  inLanguage: "en",
  publisher: {
    "@type": "Person",
    "@id": `${siteConfig.url}/#author`,
    name: siteConfig.author,
    url: siteConfig.repo,
  },
  sameAs: [siteConfig.repo, siteConfig.npm],
};

/** The package itself, linked to the site and the repository it ships from. */
const softwareNode: JsonLd = {
  "@type": "SoftwareSourceCode",
  "@id": `${siteConfig.url}/#software`,
  name: siteConfig.name,
  description: DESCRIPTION,
  url: siteConfig.url,
  codeRepository: siteConfig.repo,
  programmingLanguage: "TypeScript",
  runtimePlatform: "Node.js",
  operatingSystem: "Any",
  license: "https://opensource.org/licenses/MIT",
  author: { "@id": `${siteConfig.url}/#author` },
  isPartOf: { "@id": `${siteConfig.url}/#website` },
};

const applicationNode: JsonLd = {
  "@type": "SoftwareApplication",
  "@id": `${siteConfig.url}/#application`,
  name: siteConfig.name,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description: DESCRIPTION,
  url: siteConfig.url,
  codeRepository: siteConfig.repo,
  license: "https://opensource.org/licenses/MIT",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  keywords: "git, commit message, conventional commits, cli, developer tools",
  isPartOf: { "@id": `${siteConfig.url}/#website` },
};

export function SiteJsonLd() {
  return <JsonLd nodes={[webSiteNode, softwareNode, applicationNode]} />;
}

type DocJsonLdProps = {
  slug: string;
};

export function DocJsonLd({ slug }: DocJsonLdProps) {
  const page = getDocPage(slug);
  if (!page) return null;

  const url = `${siteConfig.url}/docs/${page.slug}`;
  const headings = getHeadings(page);

  const articleNode: JsonLd = {
    "@type": "TechArticle",
    "@id": `${url}#article`,
    headline: page.title,
    description: page.summary,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#software` },
    author: { "@id": `${siteConfig.url}/#author` },
    publisher: { "@id": `${siteConfig.url}/#author` },
    articleSection: "Documentation",
    proficiencyLevel: "Beginner",
    inLanguage: "en",
  };

  if (headings.length > 0) {
    articleNode.keywords = headings.map((heading) => heading.text).join(", ");
  }

  const breadcrumbNode: JsonLd = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: getDocTrail(page).map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.href, siteConfig.url).toString(),
    })),
  };

  return <JsonLd nodes={[webSiteNode, articleNode, breadcrumbNode]} />;
}
