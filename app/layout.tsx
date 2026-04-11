import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { FIRM_NAME, FIRM_DOMAIN } from "@/lib/constants"
import { SEO_KEYWORDS } from "@/lib/metadata"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: {
    default: `Leadership Development & Executive Coaching | ${FIRM_NAME}`,
    template: `%s | ${FIRM_NAME}`,
  },
  description:
    "The only leadership company delivering end-to-end solutions across the entire development lifecycle. Assessment, coaching, development, transformation, and succession planning for every level of your organization.",
  keywords: SEO_KEYWORDS.primary,
  authors: [{ name: `${FIRM_NAME} Leadership` }],
  creator: `${FIRM_NAME} Leadership`,
  publisher: `${FIRM_NAME} Leadership`,
  metadataBase: new URL(FIRM_DOMAIN),
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: `${FIRM_NAME} Leadership`,
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: `${FIRM_NAME} Leadership Development`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@leadershipfirm",
    site: "@leadershipfirm",
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
    // Add verification codes when available
    // google: "verification-code",
    // yandex: "verification-code",
  },
  category: "Business",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#14432c" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full scroll-smooth`}>
      <head>
        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col antialiased font-sans bg-background text-foreground">
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
