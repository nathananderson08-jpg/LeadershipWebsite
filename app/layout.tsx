import type { Metadata } from "next"
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { FIRM_NAME, FIRM_DOMAIN, FIRM_EMAIL } from "@/lib/constants"

const orgSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${FIRM_DOMAIN}/#organization`,
      "name": FIRM_NAME,
      "url": FIRM_DOMAIN,
      "email": FIRM_EMAIL,
      "description": "The only end-to-end leadership development firm — delivering integrated solutions across assessment, executive coaching, leadership programs, organizational transformation, and succession planning. Serving 200+ organizations across 35+ countries.",
      "slogan": "The Complete Leadership Partner",
      "foundingDate": "2010",
      "areaServed": "Worldwide",
      "knowsAbout": [
        "Leadership Development",
        "Executive Coaching",
        "Succession Planning",
        "Organizational Transformation",
        "Leadership Assessment",
        "AI Leadership Transformation",
        "C-Suite Advisory",
        "Board Effectiveness",
        "Culture Change",
        "Leadership Pipeline Development",
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Leadership Development Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Leadership Assessment & Diagnostics",
              "description": "360-degree leadership assessments, organizational audits, and readiness evaluations that reveal the true state of leadership capability at individual, team, and enterprise level.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Executive Coaching",
              "description": "ICF-certified 1:1, group, and team coaching that transforms individual and collective leadership performance. 94% client return rate. Integrated with assessment data and development programs.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Leadership Development Programs",
              "description": "Custom cohort-based programs and leadership academies that build capability at scale — from first-time managers to senior executives.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Organizational Transformation",
              "description": "Culture change, team alignment, and enterprise change leadership for the most complex organizational challenges.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Succession Planning",
              "description": "End-to-end pipeline mapping, high-potential identification, readiness assessment, and executive transition support.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI Leadership Transformation",
              "description": "Preparing leaders to lead effectively in an AI-driven organization — across strategic fluency, human-AI collaboration, governance, and organizational change management.",
            },
          },
        ],
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "200",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${FIRM_DOMAIN}/#website`,
      "url": FIRM_DOMAIN,
      "name": FIRM_NAME,
      "publisher": { "@id": `${FIRM_DOMAIN}/#organization` },
    },
  ],
}

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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
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
