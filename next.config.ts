import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One canonical host. Every canonical URL in metadata resolves to
  // siteConfig.url, so www.gitcomm.web.id has to fold into it here instead of
  // being indexed as a duplicate of the same pages. `permanent: true` is a 308,
  // which Next.js treats as permanent exactly like a 301.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.gitcomm.web.id" }],
        destination: "https://gitcomm.web.id/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
