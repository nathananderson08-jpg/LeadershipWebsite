"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Button } from "@/components/ui/Button"
import { ALL_ARTICLES } from "@/lib/insights-data"

const CATEGORIES = ["All", "AI & Leadership", "Assessment", "Coaching", "Succession", "Culture & Transformation", "Leader Development", "Governance & Board", "Executive Development", "Leadership Strategy"]
const CONTENT_TYPES = ["All", "Articles", "Research"]

const TYPE_MAP: Record<string, string> = { Articles: "article", Research: "research" }

export default function InsightsPage() {
  const [activeType, setActiveType] = useState("All")
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = ALL_ARTICLES.filter((a) => {
    const typeMatch = activeType === "All" || a.type === TYPE_MAP[activeType]
    const catMatch = activeCategory === "All" || a.category === activeCategory
    return typeMatch && catMatch
  })

  return (
    <>
      <section
        className="pt-40 pb-16"
        style={{ background: "linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)" }}
      >
        <div className="container-content">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <p className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-4" style={{ fontWeight: 700 }}>Insights Hub</p>
            <h1 className="display-lg text-forest-950 mb-5">Thinking from the frontier of leadership development.</h1>
            <p className="text-xl text-forest-800/70 leading-relaxed">Articles, research, and analysis on leadership, AI transformation, succession, culture, and the future of organizations.</p>
          </motion.div>
        </div>
      </section>

      {/* Featured article */}
      <section className="py-12" style={{ background: "var(--color-forest-100)" }}>
        <div className="container-content">
          <Link
            href={`/insights/${ALL_ARTICLES[0].slug}`}
            className="block p-8 rounded-2xl group transition-all hover:bg-white bg-white"
            style={{ border: "1px solid var(--color-forest-200)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-700 px-3 py-1 rounded-full" style={{ background: "var(--color-forest-600)", color: "white", fontWeight: 700 }}>
                Featured
              </span>
              <span className="text-xs font-700 px-3 py-1 rounded-full" style={{ background: "var(--color-forest-100)", color: "var(--color-forest-700)", fontWeight: 700 }}>
                {ALL_ARTICLES[0].category}
              </span>
              <span className="text-xs text-forest-600">{ALL_ARTICLES[0].readTime}</span>
            </div>
            <h2 className="display-md text-forest-950 mb-3 group-hover:text-forest-700 transition-colors">{ALL_ARTICLES[0].title}</h2>
            <p className="text-forest-700 text-lg leading-relaxed max-w-3xl">{ALL_ARTICLES[0].excerpt}</p>
          </Link>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          {/* Content type filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {CONTENT_TYPES.map((t) => (
              <button key={t} onClick={() => setActiveType(t)} className="px-4 py-2 rounded-full text-sm font-600 transition-all" style={{ fontWeight: 600, background: activeType === t ? "var(--color-navy-900)" : "white", color: activeType === t ? "white" : "var(--color-neutral-500)", border: "1px solid", borderColor: activeType === t ? "var(--color-navy-900)" : "var(--color-warm-200)" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex gap-2 mb-12 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)} className="px-3 py-1.5 rounded-full text-xs font-600 transition-all" style={{ fontWeight: 600, background: activeCategory === c ? "var(--color-gold-500)" : "var(--color-warm-100)", color: activeCategory === c ? "var(--color-navy-900)" : "var(--color-neutral-500)" }}>
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-lg">No articles yet in this category. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => (
                <motion.article
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/insights/${article.slug}`} className="block h-full card-base card-light group">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-700 px-3 py-1 rounded-full" style={{ background: "var(--color-gold-100)", color: "var(--color-gold-700)", fontWeight: 700 }}>
                        {article.category}
                      </span>
                      {article.type === 'research' && (
                        <span className="text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: "var(--color-navy-100)", color: "var(--color-navy-700)", fontWeight: 700 }}>
                          Research
                        </span>
                      )}
                      <span className="text-xs text-neutral-400">{article.readTime}</span>
                    </div>
                    <h3 className="font-700 text-navy-900 text-lg leading-snug mb-3 group-hover:text-gold-700 transition-colors" style={{ fontWeight: 700 }}>
                      {article.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-5">{article.excerpt}</p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 text-white bg-navy-700" style={{ fontWeight: 700 }}>
                        {article.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-600 text-navy-900" style={{ fontWeight: 600 }}>{article.author}</p>
                        <p className="text-xs text-neutral-400">{article.date}</p>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
