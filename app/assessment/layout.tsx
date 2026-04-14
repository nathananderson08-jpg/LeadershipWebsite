import type { Metadata } from "next"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Free Leadership Readiness Assessment | ${FIRM_NAME}`,
  description:
    "Take our free AI-powered Leadership Readiness Assessment and receive a personalized report identifying your organization's key leadership gaps, maturity stage, and recommended next steps.",
  keywords: [
    "leadership readiness assessment",
    "free leadership assessment",
    "organizational leadership diagnostic",
    "leadership gap analysis",
    "executive leadership evaluation",
    "leadership maturity assessment",
    "AI leadership assessment",
    "leadership development audit",
  ],
  openGraph: {
    title: `Free Leadership Readiness Assessment | ${FIRM_NAME}`,
    description:
      "Take our free AI-powered Leadership Readiness Assessment and receive a personalized report identifying your organization's key leadership gaps, maturity stage, and recommended next steps.",
    type: "website",
  },
}

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
