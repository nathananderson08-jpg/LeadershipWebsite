import type { Metadata, Viewport } from "next"
import { HomepageClient } from "./HomepageClient"
import { JsonLd } from "@/components/ui/JsonLd"
import { FIRM_NAME, FIRM_DOMAIN, MESSAGING } from "@/lib/constants"
import { generateOrganizationSchema, SEO_KEYWORDS } from "@/lib/metadata"

export const metadata: Metadata = {
  title: `Leadership Development & Executive Coaching Solutions | ${FIRM_NAME}`,
  description: `${MESSAGING.primaryClaim} ${MESSAGING.lifecycleSpan} Trusted by Fortune 500 companies worldwide for executive coaching, leadership assessment, and organizational transformation.`,
  keywords: [...SEO_KEYWORDS.primary, ...SEO_KEYWORDS.secondary.slice(0, 5)],
  metadataBase: new URL(FIRM_DOMAIN),
  alternates: {
    canonical: FIRM_DOMAIN,
  },
  openGraph: {
    type: "website",
    title: `Leadership Development & Executive Coaching | ${FIRM_NAME}`,
    description: MESSAGING.primaryClaim,
    url: FIRM_DOMAIN,
    siteName: `${FIRM_NAME} Leadership`,
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: `${FIRM_NAME} - End-to-End Leadership Development`,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `Leadership Development & Executive Coaching | ${FIRM_NAME}`,
    description: MESSAGING.primaryClaim,
    images: ["/og/home.png"],
  },
  robots: {
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

export const viewport: Viewport = {
  themeColor: "#14432c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

// Generate comprehensive JSON-LD for homepage
function generateHomepageSchemas() {
  const organizationSchema = generateOrganizationSchema()

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${FIRM_NAME} Leadership`,
    alternateName: FIRM_NAME,
    url: FIRM_DOMAIN,
    description: MESSAGING.primaryClaim,
    publisher: {
      "@type": "Organization",
      name: `${FIRM_NAME} Leadership`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${FIRM_DOMAIN}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${FIRM_NAME} Leadership`,
    description:
      "Comprehensive leadership development company offering executive coaching, leadership assessment, development programs, organizational transformation, and succession planning.",
    url: FIRM_DOMAIN,
    priceRange: "$$$$",
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Leadership Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Executive Coaching",
            description:
              "ICF-certified 1:1, group, and team coaching that transforms individual and collective leadership performance.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Leadership Assessment",
            description:
              "360-degree assessments, leadership audits, and readiness evaluations.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Development Programs",
            description:
              "Cohort-based leadership development programs and custom academies.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Organizational Transformation",
            description:
              "Culture change, team alignment, and change management consulting.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Succession Planning",
            description:
              "Strategic pipeline mapping, high-potential identification, and executive transition support.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI Leadership Transformation",
            description:
              "Preparing leaders to lead effectively in an AI-driven world.",
          },
        },
      ],
    },
  }

  return [organizationSchema, websiteSchema, professionalServiceSchema]
}

export default function HomePage() {
  const schemas = generateHomepageSchemas()

  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
      <HomepageClient />
    </>
  )
}
