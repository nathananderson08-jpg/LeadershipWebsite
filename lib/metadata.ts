import type { Metadata } from "next"
import { FIRM_NAME, FIRM_DOMAIN } from "./constants"

export function generatePageMetadata({
  title,
  description,
  path = "",
  ogImage = "/og/default.png",
}: {
  title: string
  description: string
  path?: string
  ogImage?: string
}): Metadata {
  const fullTitle = title.includes(FIRM_NAME) ? title : `${title} | ${FIRM_NAME}`
  const url = `${FIRM_DOMAIN}${path}`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(FIRM_DOMAIN),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: `${FIRM_NAME} Leadership`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  }
}
