import type { Metadata } from "next"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Leadership Insights & Research | ${FIRM_NAME}`,
  description:
    "Expert thinking on executive leadership, AI transformation, succession planning, culture change, and the future of organizations. Articles, research, and analysis from the Apex & Origin team.",
  keywords: [
    "leadership insights",
    "executive leadership articles",
    "leadership development research",
    "AI leadership articles",
    "succession planning insights",
    "culture change articles",
    "organizational leadership blog",
    "CHRO resources",
    "leadership strategy",
    "leadership thought leadership",
  ],
  openGraph: {
    title: `Leadership Insights & Research | ${FIRM_NAME}`,
    description:
      "Expert thinking on executive leadership, AI transformation, succession planning, culture change, and the future of organizations — from the Apex & Origin team.",
    type: "website",
  },
}

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
