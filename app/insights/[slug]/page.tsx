import type { Metadata } from "next"
import Link from "next/link"
import { ALL_ARTICLES } from "@/lib/insights-data"
import { FIRM_NAME } from "@/lib/constants"
import { CTABanner } from "@/components/sections/CTABanner"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = ALL_ARTICLES.find((a) => a.slug === slug)
  if (!article) return { title: `Insights | ${FIRM_NAME}` }
  return {
    title: `${article.title} | ${FIRM_NAME}`,
    description: article.excerpt,
    openGraph: { type: "article", authors: [article.author] },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = ALL_ARTICLES.find((a) => a.slug === slug)

  if (!article) {
    return (
      <div className="pt-40 container-content py-20 text-center">
        <h1 className="display-md text-navy-900 mb-4">Article not found</h1>
        <Link href="/insights" className="text-gold-600 hover:underline">← Back to Insights</Link>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-12" style={{ background: "var(--color-navy-900)" }}>
        <div className="container-content max-w-3xl">
          <Breadcrumbs crumbs={[{ label: "Insights", href: "/insights" }, { label: article.category }]} />
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="text-xs font-700 px-3 py-1 rounded-full" style={{ background: "rgba(193,154,91,0.15)", color: "var(--color-gold-400)", fontWeight: 700 }}>
                {article.category}
              </span>
              {article.type === 'research' && (
                <span className="text-xs font-700 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>
                  Research
                </span>
              )}
              <span className="text-xs text-white/30">{article.readTime}</span>
              <span className="text-xs text-white/30">{article.date}</span>
            </div>
            <h1 className="display-lg text-white mb-5">{article.title}</h1>
            <p className="text-xl text-white/60 leading-relaxed">{article.excerpt}</p>
          </div>
        </div>
      </section>

      {/* Author */}
      <div style={{ background: "var(--color-navy-950)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container-content max-w-3xl py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-700 text-white bg-navy-700" style={{ fontWeight: 700 }}>
              {article.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="font-700 text-white" style={{ fontWeight: 700 }}>{article.author}</p>
              <p className="text-sm text-white/40">{article.authorTitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="section-padding" style={{ background: "white" }}>
        <div className="container-content max-w-3xl">
          <div className="prose prose-lg max-w-none">
            {article.content.map((para, i) => (
              <p key={i} className="text-lg text-neutral-700 leading-relaxed mb-6">
                {para}
              </p>
            ))}
          </div>

          {/* Author bio */}
          <div className="mt-16 p-8 rounded-2xl" style={{ background: "var(--color-warm-50)", border: "1px solid var(--color-warm-100)" }}>
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-700 text-white bg-navy-700 shrink-0" style={{ fontWeight: 700 }}>
                {article.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-700 text-navy-900 text-lg mb-0.5" style={{ fontWeight: 700 }}>{article.author}</p>
                <p className="text-sm text-gold-600 mb-3">{article.authorTitle}</p>
                <p className="text-sm text-neutral-500 leading-relaxed">A senior practitioner at {FIRM_NAME}, with expertise in leadership development, organizational transformation, and executive coaching.</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <CTABanner headline="Ready to apply these insights in your organization?" primaryLabel="Request a Consultation" primaryHref="/consultation" secondaryLabel="More Insights" secondaryHref="/insights" />
    </>
  )
}
