import { ImageResponse } from "next/og";
import { OgImageCard, ogImageSize } from "@/components/og-image";

/**
 * One card for both og:image and twitter:image. A file convention
 * (`app/opengraph-image.tsx`) would be dropped on any page that declares its
 * own `openGraph` in `generateMetadata`, so the image is referenced explicitly
 * from metadata instead.
 */
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<OgImageCard />, { ...ogImageSize });
}
