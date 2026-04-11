import type { MetadataRoute } from "next"
import { FIRM_DOMAIN } from "@/lib/constants"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/portal/",
          "/portal/api/",
          "/portal/dashboard/",
          "/*.json$",
          "/private/",
        ],
      },
      // Allow specific bots to crawl everything they need
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/portal/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/portal/"],
      },
    ],
    sitemap: `${FIRM_DOMAIN}/sitemap.xml`,
    host: FIRM_DOMAIN,
  }
}
