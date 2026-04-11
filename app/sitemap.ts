import type { MetadataRoute } from "next"
import { FIRM_DOMAIN, SAMPLE_ARTICLES } from "@/lib/constants"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = FIRM_DOMAIN

  const staticRoutes = [
    "/",
    "/about",
    "/about/team",
    "/about/methodology",
    "/about/careers",
    "/lifecycle",
    "/solutions",
    "/solutions/assessment",
    "/solutions/coaching",
    "/solutions/programs",
    "/solutions/transformation",
    "/solutions/succession",
    "/solutions/ai-transformation",
    "/solutions/emerging-leaders",
    "/solutions/senior-leaders",
    "/solutions/c-suite",
    "/industries",
    "/industries/financial-services",
    "/industries/technology",
    "/industries/healthcare",
    "/industries/manufacturing",
    "/industries/energy",
    "/industries/government",
    "/platform",
    "/insights",
    "/results",
    "/contact",
    "/consultation",
    "/partners",
    "/privacy",
    "/terms",
    "/accessibility",
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1.0 : route.includes("lifecycle") || route.includes("ai-transformation") ? 0.9 : 0.7,
  }))

  const articleEntries: MetadataRoute.Sitemap = SAMPLE_ARTICLES.map((article) => ({
    url: `${baseUrl}/insights/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticEntries, ...articleEntries]
}
