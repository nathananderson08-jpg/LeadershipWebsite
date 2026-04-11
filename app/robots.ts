import type { MetadataRoute } from "next"
import { FIRM_DOMAIN } from "@/lib/constants"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${FIRM_DOMAIN}/sitemap.xml`,
  }
}
