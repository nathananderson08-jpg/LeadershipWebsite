import type { Metadata } from "next"
import { HomepageClient } from "./HomepageClient"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `End-to-End Leadership Development Solutions | ${FIRM_NAME}`,
  description:
    "The only leadership company offering assessment, coaching, leadership development, transformation, and succession planning across every level of your organization. Discover our end-to-end approach.",
  openGraph: {
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
  },
}

export default function HomePage() {
  return <HomepageClient />
}
