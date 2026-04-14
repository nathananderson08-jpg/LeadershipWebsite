import type { Metadata } from "next"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `About Us | ${FIRM_NAME}`,
  description:
    "Learn how Apex & Origin was built to solve leadership's biggest problem: fragmentation. Our mission, our team, and the integrated methodology behind 10,000+ leaders developed across 35+ countries.",
  keywords: [
    "about Apex & Origin",
    "leadership development firm",
    "executive coaching company",
    "leadership consulting firm",
    "ICF certified coaches",
    "organizational leadership experts",
    "leadership development methodology",
    "end-to-end leadership partner",
  ],
  openGraph: {
    title: `About Us | ${FIRM_NAME}`,
    description:
      "Learn how Apex & Origin was built to solve leadership's biggest problem: fragmentation. Our mission, team, and integrated methodology behind 10,000+ leaders developed worldwide.",
    type: "website",
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
