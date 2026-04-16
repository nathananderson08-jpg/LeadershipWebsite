import type { Metadata } from "next"
import { HomepageClient } from "./HomepageClient"
import { FIRM_NAME, FIRM_DOMAIN, FAQ_ITEMS } from "@/lib/constants"

export const metadata: Metadata = {
  title: `End-to-End Leadership Development Solutions | ${FIRM_NAME}`,
  description:
    "The only leadership firm delivering end-to-end solutions across assessment, executive coaching, leadership development, culture transformation, and succession planning. Serving 200+ organizations across 35+ countries.",
  keywords: [
    "end-to-end leadership development",
    "executive coaching firm",
    "leadership assessment",
    "succession planning",
    "organizational transformation",
    "C-suite coaching",
    "leadership consulting",
    "corporate leadership development",
    "AI leadership transformation",
    "leadership development lifecycle",
  ],
  openGraph: {
    title: `End-to-End Leadership Development Solutions | ${FIRM_NAME}`,
    description:
      "The only leadership firm delivering end-to-end solutions across assessment, executive coaching, leadership development, culture transformation, and succession planning.",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: `${FIRM_NAME} — Leadership Development Solutions` }],
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.a,
    },
  })),
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomepageClient />
    </>
  )
}
