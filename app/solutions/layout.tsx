import type { Metadata } from "next"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Leadership Development Solutions | ${FIRM_NAME}`,
  description:
    "Explore our complete suite of executive leadership solutions: assessment & diagnostics, executive coaching, development programs, organizational transformation, succession planning, and AI leadership readiness.",
  keywords: [
    "leadership development solutions",
    "executive coaching programs",
    "leadership assessment services",
    "succession planning services",
    "organizational transformation consulting",
    "AI leadership readiness",
    "leadership development programs",
    "team coaching",
    "emerging leader programs",
    "C-suite leadership development",
  ],
  openGraph: {
    title: `Leadership Development Solutions | ${FIRM_NAME}`,
    description:
      "Explore our complete suite of leadership solutions across assessment, executive coaching, development programs, transformation, succession planning, and AI leadership readiness.",
    type: "website",
  },
}

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
