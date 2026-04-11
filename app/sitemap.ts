import type { MetadataRoute } from "next"
import { FIRM_DOMAIN, SAMPLE_ARTICLES, INDUSTRIES } from "@/lib/constants"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = FIRM_DOMAIN
  const now = new Date()

  // High priority pages - core conversion paths
  const highPriorityRoutes = [
    { route: "/", priority: 1.0, changeFreq: "weekly" as const },
    { route: "/contact", priority: 0.95, changeFreq: "monthly" as const },
    { route: "/consultation", priority: 0.95, changeFreq: "monthly" as const },
    { route: "/lifecycle", priority: 0.9, changeFreq: "monthly" as const },
    { route: "/solutions", priority: 0.9, changeFreq: "weekly" as const },
    { route: "/solutions/ai-transformation", priority: 0.9, changeFreq: "weekly" as const },
  ]

  // Medium priority - solution pages
  const solutionRoutes = [
    "/solutions/assessment",
    "/solutions/coaching",
    "/solutions/programs",
    "/solutions/transformation",
    "/solutions/succession",
    "/solutions/emerging-leaders",
    "/solutions/senior-leaders",
    "/solutions/c-suite",
  ].map((route) => ({
    route,
    priority: 0.8,
    changeFreq: "monthly" as const,
  }))

  // Company pages
  const companyRoutes = [
    "/about",
    "/about/team",
    "/about/methodology",
    "/about/careers",
    "/platform",
    "/results",
    "/partners",
    "/insights",
  ].map((route) => ({
    route,
    priority: 0.7,
    changeFreq: "monthly" as const,
  }))

  // Industry pages - dynamically generated
  const industryRoutes = [
    "/industries",
    ...INDUSTRIES.map((ind) => ind.href),
  ].map((route) => ({
    route,
    priority: 0.7,
    changeFreq: "monthly" as const,
  }))

  // Legal pages - low priority
  const legalRoutes = ["/privacy", "/terms", "/accessibility"].map((route) => ({
    route,
    priority: 0.3,
    changeFreq: "yearly" as const,
  }))

  // Combine all static routes
  const allStaticRoutes = [
    ...highPriorityRoutes,
    ...solutionRoutes,
    ...companyRoutes,
    ...industryRoutes,
    ...legalRoutes,
  ]

  const staticEntries: MetadataRoute.Sitemap = allStaticRoutes.map(({ route, priority, changeFreq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority,
  }))

  // Article entries with proper dates
  const articleEntries: MetadataRoute.Sitemap = SAMPLE_ARTICLES.map((article) => ({
    url: `${baseUrl}/insights/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticEntries, ...articleEntries]
}
