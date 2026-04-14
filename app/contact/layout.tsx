import type { Metadata } from "next"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Contact Us | ${FIRM_NAME}`,
  description:
    "Get in touch with Apex & Origin to discuss your leadership development needs. Our team responds within 24 hours. Offices in New York, London, and Singapore.",
  keywords: [
    "contact leadership development firm",
    "executive coaching inquiry",
    "leadership consulting contact",
    "leadership development consultation",
    "book leadership assessment",
    "Apex & Origin contact",
  ],
  openGraph: {
    title: `Contact Us | ${FIRM_NAME}`,
    description:
      "Get in touch with Apex & Origin to discuss your leadership development needs. Our team responds within 24 hours. Offices in New York, London, and Singapore.",
    type: "website",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
