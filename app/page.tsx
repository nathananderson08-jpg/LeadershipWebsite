import type { Metadata } from "next"
import { HomepageClient } from "./HomepageClient"
import { FIRM_NAME } from "@/lib/constants"

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

export default function HomePage() {
  return <HomepageClient />
}
