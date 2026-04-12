import type { Metadata } from "next"
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { FIRM_NAME, FIRM_DOMAIN } from "@/lib/constants"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: {
    default: `${FIRM_NAME} | End-to-End Leadership Development & Executive Coaching`,
    template: `%s | ${FIRM_NAME}`,
  },
  description:
    "Transform your organization with comprehensive leadership development solutions. From executive coaching and 360 assessments to succession planning and AI transformation. Serving Fortune 500 companies across 35+ countries.",
  keywords: [
    "leadership development",
    "executive coaching",
    "leadership assessment",
    "succession planning",
    "organizational transformation",
    "team coaching",
    "leadership training",
    "executive development",
    "AI leadership",
    "corporate coaching",
    "leadership consulting",
    "C-suite coaching",
  ],
  metadataBase: new URL(FIRM_DOMAIN),
  alternates: {
    canonical: FIRM_DOMAIN,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: `${FIRM_NAME}`,
    title: `${FIRM_NAME} | End-to-End Leadership Development`,
    description: "The only leadership company delivering end-to-end solutions across assessment, coaching, leadership development, transformation, and succession planning.",
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: `${FIRM_NAME} - Leadership Development Solutions`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${FIRM_NAME} | Leadership Development`,
    description: "Transform your organization with comprehensive leadership development solutions.",
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
  verification: {
    google: "your-google-verification-code",
  },
  category: "Business",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full scroll-smooth`}>
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
      >
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
