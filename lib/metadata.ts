import type { Metadata } from "next"
import { FIRM_NAME, FIRM_DOMAIN, FIRM_PHONE, FIRM_EMAIL } from "./constants"

// SEO-optimized keywords for leadership development
export const SEO_KEYWORDS = {
  primary: [
    "leadership development",
    "executive coaching",
    "leadership training",
    "corporate leadership programs",
    "leadership assessment",
  ],
  secondary: [
    "succession planning",
    "organizational transformation",
    "AI leadership",
    "executive development",
    "leadership consulting",
    "team development",
    "c-suite coaching",
    "emerging leaders program",
    "leadership pipeline",
    "culture transformation",
  ],
  industries: [
    "financial services leadership",
    "healthcare leadership development",
    "technology leadership training",
    "manufacturing leadership",
    "government leadership development",
  ],
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  ogImage = "/og/default.png",
  keywords = [],
  noIndex = false,
}: {
  title: string
  description: string
  path?: string
  ogImage?: string
  keywords?: string[]
  noIndex?: boolean
}): Metadata {
  const fullTitle = title.includes(FIRM_NAME) ? title : `${title} | ${FIRM_NAME}`
  const url = `${FIRM_DOMAIN}${path}`
  const allKeywords = [...SEO_KEYWORDS.primary.slice(0, 3), ...keywords].slice(0, 10)

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
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
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  }
}

// JSON-LD Schema generators for rich snippets
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `${FIRM_NAME} Leadership`,
    alternateName: FIRM_NAME,
    url: FIRM_DOMAIN,
    logo: `${FIRM_DOMAIN}/logo.png`,
    description:
      "The only leadership company delivering end-to-end solutions across the entire development lifecycle. From assessment to succession, we cover every phase of leadership development.",
    foundingDate: "2009",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 50,
      maxValue: 200,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: FIRM_PHONE,
      email: FIRM_EMAIL,
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://linkedin.com/company/leadershipfirm",
      "https://twitter.com/leadershipfirm",
    ],
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 0,
        longitude: 0,
      },
      geoRadius: "40000 km",
    },
    knowsAbout: [
      "Leadership Development",
      "Executive Coaching",
      "Organizational Transformation",
      "Succession Planning",
      "AI Leadership",
      "Team Development",
      "Leadership Assessment",
    ],
  }
}

export function generateServiceSchema(service: {
  name: string
  description: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${FIRM_DOMAIN}${service.url}`,
    provider: {
      "@type": "Organization",
      name: `${FIRM_NAME} Leadership`,
      url: FIRM_DOMAIN,
    },
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    serviceType: "Leadership Development",
  }
}

export function generateArticleSchema(article: {
  title: string
  description: string
  slug: string
  date: string
  author: string
  authorTitle: string
  category: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${FIRM_DOMAIN}/insights/${article.slug}`,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: article.authorTitle,
    },
    publisher: {
      "@type": "Organization",
      name: `${FIRM_NAME} Leadership`,
      logo: {
        "@type": "ImageObject",
        url: `${FIRM_DOMAIN}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${FIRM_DOMAIN}/insights/${article.slug}`,
    },
    articleSection: article.category,
    keywords: [
      "leadership",
      "executive development",
      article.category.toLowerCase(),
    ],
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${FIRM_DOMAIN}${item.url}`,
    })),
  }
}

export function generateWebPageSchema(page: {
  title: string
  description: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: `${FIRM_DOMAIN}${page.url}`,
    isPartOf: {
      "@type": "WebSite",
      name: `${FIRM_NAME} Leadership`,
      url: FIRM_DOMAIN,
    },
    publisher: {
      "@type": "Organization",
      name: `${FIRM_NAME} Leadership`,
    },
  }
}
