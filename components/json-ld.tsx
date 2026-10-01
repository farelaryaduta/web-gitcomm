import { getDocPage, getHeadings } from "@/lib/docs";
import { siteConfig } from "@/lib/site";

type JsonLd = Record<string, unknown>;

const siteLd: JsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "gitcomm",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description:
    "AI-powered commit messages that match your repository's style. Reads your staged diff and commit history, then commits for you.",
  url: siteConfig.url,
  codeRepository: siteConfig.repo,
  license: "https://opensource.org/licenses/MIT",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  keywords: "git, commit message, conventional commits, cli, developer tools",
};

export function SiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }}
    />
  );
}

type DocJsonLdProps = {
  slug: string;
};

export function DocJsonLd({ slug }: DocJsonLdProps) {
  const page = getDocPage(slug);
  if (!page) return null;

  const headings = getHeadings(page);

  const ld: JsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: page.title,
    description: page.summary,
    url: `${siteConfig.url}/docs/${page.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/docs/${page.slug}`,
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": siteConfig.url,
      name: "gitcomm",
    },
    author: { "@type": "Person", name: siteConfig.author },
    publisher: { "@type": "Person", name: siteConfig.author },
    articleSection: "Documentation",
    proficiencyLevel: "Beginner",
  };

  if (headings.length > 0) {
    ld.articleBody = headings.map((heading) => heading.text).join("\n");
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}

