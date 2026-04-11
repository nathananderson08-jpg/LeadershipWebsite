import type { Metadata } from "next"
import Link from "next/link"
import { SAMPLE_ARTICLES, FIRM_NAME } from "@/lib/constants"
import { CTABanner } from "@/components/sections/CTABanner"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"

interface Props {
  params: Promise<{ slug: string }>
}

const ALL_ARTICLES = [
  ...SAMPLE_ARTICLES,
  {
    slug: "culture-change-leadership",
    title: "Culture Change Is a Leadership Problem, Not a Process Problem",
    category: "Culture",
    readTime: "7 min read",
    date: "2025-01-25",
    excerpt: "Organizations invest in culture change programs and get culture compliance, not culture transformation.",
    author: "Robert Kimani",
    authorTitle: "Managing Director, Organizational Transformation",
  },
  {
    slug: "succession-board-oversight",
    title: "What Boards Get Wrong About CEO Succession — and How to Fix It",
    category: "Succession",
    readTime: "9 min read",
    date: "2025-01-10",
    excerpt: "Board succession planning is treated as a governance exercise. It should be treated as the most important strategic decision the board makes.",
    author: "Diana Torres",
    authorTitle: "Head of Succession & Talent Strategy",
  },
]

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

const ARTICLE_CONTENT: Record<string, string[]> = {
  "end-to-end-imperative": [
    "The average Fortune 500 company works with six different leadership development vendors. One firm runs the assessments. Another provides the coaches. A third designs the development programs. A fourth handles succession planning. And somewhere in the middle — usually in an overloaded CHRO's inbox — someone is supposed to synthesize it all into a coherent strategy.",
    "It doesn't work. And the evidence is mounting.",
    "In a recent analysis of 140 organizations that had undergone significant leadership development investments over a five-year period, we found a striking pattern: the companies using integrated, single-partner models consistently outperformed those using fragmented multi-vendor approaches on every measurable outcome — from program completion rates and coaching engagement scores to leadership bench strength and promotion readiness.",
    "The gap wasn't marginal. Organizations with integrated approaches reported 34% higher leadership bench strength scores, 28% better retention among high-potential employees, and 41% faster time-to-readiness for critical leadership roles.",
    "The reason is structural, not motivational. When your assessment data lives in one system, your coaching notes in another, and your development program completion data in a third, no single party has the full picture. Your external coaches don't know what the assessment revealed. Your development programs can't reinforce what coaching is working on. And your succession planning process is flying blind on both.",
    "The most damaging moment in fragmented leadership development is the handoff — the point where one engagement ends and the next begins. Assessment results get summarized into a deck that never quite captures the nuance. Coaching engagements wrap up without any mechanism to embed insights into formal development. Every handoff is an information loss event. Every information loss event means a leader starts the next phase of their development without the full benefit of the phase before.",
    "The integration imperative isn't simply about reducing vendor count for the sake of simplicity. It's about designing leadership development as a system — where each phase of the journey both builds on what came before and informs what comes next. Assessment data should directly inform the coaching contract. Coaching insights should shape program design. Program outcomes should feed succession models.",
    "The firms that understand this are beginning to consolidate — not just for cost reasons, but because they've realized that the fragmentation itself is the risk. In a talent environment where the quality of leadership is increasingly the determinant of competitive advantage, the cost of disconnected development isn't just financial. It's strategic.",
  ],
  "ai-capabilities-leaders": [
    "Let's start with the uncomfortable part. There are things AI already does better than human leaders — and pretending otherwise is both intellectually dishonest and strategically dangerous. The leaders who will thrive in the next decade are those who can hold this truth without flinching, and use it to become better leaders rather than defensive ones.",
    "AI already surpasses humans in three critical domains: pattern recognition at scale, information synthesis across vast sources, and consistent execution of complex processes. A human leader reviewing quarterly performance data can spot a few trends across a handful of dimensions. An AI model can simultaneously analyze thousands of variables across years of data, surface non-obvious correlations, and predict failure modes that no human would catch.",
    "But here is where the analysis becomes interesting — and where the work of leadership development in the AI era becomes urgent. Five capabilities remain irreducibly human, and AI makes each of them more valuable, not less.",
    "Judgment under genuine uncertainty. AI systems are extraordinary at optimizing in well-defined problem spaces. They struggle profoundly with novel situations where the rules haven't been written yet, where values conflict in ways that can't be resolved by optimization, and where the decision requires a moral stance rather than a calculation. The decisions that define leadership are almost always the latter.",
    "Trust and relationship. People don't follow data. They follow people they believe in. The capacity to generate trust — through consistency, through presence, through demonstrated care — is not a soft skill that AI makes obsolete. It becomes more valuable as AI handles more of the transactional work.",
    "Vision and meaning-making. The ability to articulate a future that doesn't exist yet, to make the unknown feel navigable, to give people a sense of why the work matters — this is not a function that can be delegated to a language model. People crave meaning. They crave the sense that someone has thought carefully about where we're going and why.",
    "Contextual wisdom and courage. The wisdom to recognize when the data is telling the wrong story, and the courage to act against probability when the situation demands it. AI systems optimize for expected value. Courage is the willingness to act outside that optimization when something more important is at stake.",
    "If we accept this analysis, the implication for leadership development is significant. We should be ruthlessly automating the parts of leadership that AI does better — and investing deeply in the parts that AI makes more valuable. The leader who emerges from a development program knowing how to use AI to extend their analytical reach, while being profoundly developed in the irreducibly human capabilities, is the leader organizations will compete for.",
  ],
  "succession-paradox": [
    "When a Fortune 500 board dedicates a half-day offsite to succession planning, it's almost certainly about one person: the CEO. The process is rigorous. Internal candidates are named, assessed, and developed. External candidates are kept on a short list. The board treats it as the governance matter of highest consequence — because it is.",
    "And then the CHRO walks back to HR, where succession planning for the other 200 critical leadership roles in the organization is handled by a quarterly spreadsheet update.",
    "This is the succession planning paradox: the role that gets the most scrutiny is also the role that is least likely to create organizational crisis if it's poorly planned. CEO transitions are visible, time-bounded, and — precisely because they're watched — handled with care. It's the sudden loss of three VPs in a new growth business, the unexpected departure of the person who holds all the institutional knowledge in an acquired division, the attrition of mid-level leaders in a function under transformation — these are the events that create the real organizational damage.",
    "Most organizations have a mental model of succession that looks like an org chart: replace this box with that person. This model fails because it treats leadership roles as interchangeable when they're not, and because it ignores what we call the hidden dependency map — the informal network of knowledge, relationships, and judgment that actually makes organizations function.",
    "The companies that build genuine succession depth do three things differently. They start development three levels below the role — the leaders who will be ready for critical roles in five years need to start their targeted development now. They develop in context, not in classrooms — the stretch assignment, the sponsorship relationship, the experience of leading through a failure. And they make succession depth a business metric, not an HR metric.",
    "What makes the succession paradox so worth solving is the compounding nature of the returns. A deep leadership pipeline doesn't just reduce risk — it accelerates every other strategic priority. Transformations move faster. New market entries succeed at higher rates. Acquisitions integrate more smoothly. The companies that solve the paradox create a form of organizational resilience that compounds over time.",
  ],
  "engineer-to-executive": [
    "The promotion that sends a brilliant engineer into management is one of the most consequential and under-supported transitions in organizational life. It's consequential because it happens constantly — every technical organization is full of them — and because the failure rate is quietly devastating.",
    "The dominant theory of manager development holds that developing new leaders is primarily an additive process: you teach them the skills they don't have — giving feedback, running one-on-ones, managing performance. But for technical-to-leadership transitions specifically, the development challenge is at least as much subtractive as additive. The competencies that made someone excellent as an individual contributor actively interfere with leadership.",
    "The most dangerous thing a new technical leader can bring into a management role is the belief that their value lies in knowing the answers. In an individual contributor role, knowing the answers is the job. In a leadership role, the value proposition inverts. A manager's job is not to know the answers. It is to create the conditions in which the team finds the answers.",
    "The expert who steps into management and continues to be the one who knows usually creates one of two failure modes: a team that stops thinking because the manager will just overrule them anyway, or a manager who becomes a bottleneck because every decision runs through their personal expertise rather than the team's collective judgment. We call this the expert trap — and it's the single most common derailment vector for technical leaders in their first management role.",
    "The development interventions that work are the ones that create deliberate discomfort, not the ones that add tools. The engineer who is put in a situation where they genuinely don't know more than their team, and is supported in working through that experience rather than rescued from it, develops faster than the one who attends a leadership program and gets a set of frameworks.",
    "Most organizations support this transition with a new manager program that teaches the mechanics of management. These programs are useful. They fail to address the identity shift. They treat the transition as a skills acquisition problem when it is at least equally an identity evolution problem. The technical leaders who make the transition well — who become the extraordinary executives that technical organizations depend on — almost universally describe a longer development arc than any program provided.",
  ],
  "board-blind-spot": [
    "In any given board meeting agenda, you'll find strategy, financial performance, risk, audit, and governance as standing items with dedicated time and board-level ownership. You'll find leadership development — if you find it at all — as a brief update from the CHRO, usually positioned at the end of the day when attention is flagging.",
    "This is a governance failure. Not a dramatic one, not one with obvious immediate consequences, but a structural gap in how boards understand and oversee the most important lever of organizational performance.",
    "Ask any board member whether leadership capability matters to strategy execution. Every single one will say yes. Ask them how many hours the board has spent in the past year on structured discussion of leadership bench strength, development investment strategy, or succession depth below the C-suite. The silence is instructive.",
    "This disconnect reflects a received wisdom about the division of responsibilities: strategy and capital allocation are board work; people are management work. That division made reasonable sense in a slower era. It doesn't make sense in an environment where the velocity of change means that leadership capability — specifically, the ability to develop leaders faster than the environment changes — is itself a strategic variable.",
    "The boards that have moved beyond the HR-update model do four things differently: they separate pipeline discussions from performance discussions; they ask for leading indicators, not lagging ones; they connect leadership development investment to strategy explicitly; and they hold the CEO accountable for talent development, not just talent acquisition.",
    "The governance gap in leadership development oversight has become more consequential in the past two years for a specific reason: AI transformation requires leadership capability that most organizations don't yet have, and the window to develop it is shorter than most boards realize. AI transformation fails for leadership reasons far more often than technology reasons. Boards that aren't asking hard questions about AI leadership readiness in their organizations are sitting on a risk they haven't priced.",
    "The good news is that boards that want to close this governance gap don't need to become HR experts. They need to ask better questions: What leadership capabilities does our strategy require that we don't currently have? What's the plan to develop them? How will we know if it's working? Those questions, asked consistently and with genuine accountability, change the governance posture.",
  ],
  "ai-leadership-gap": [
    "The pace of AI adoption in business has outrun the pace of leadership development. Organizations are deploying AI across every function — from underwriting to supply chain to customer service — but the leaders responsible for those decisions often lack the conceptual fluency to evaluate what they're being asked to approve.",
    "This isn't a technology problem. It's a leadership problem. And it's creating a dangerous gap between the AI being deployed and the human judgment required to deploy it responsibly.",
    "We define the AI leadership gap as the distance between what AI systems can do and what leaders can meaningfully oversee. When that gap is small, AI creates value. When it's large, AI creates risk.",
    "The gap manifests in three ways. First, leaders who can't read AI outputs make decisions based on outputs they don't understand. Second, leaders who don't understand AI's limitations approve AI deployments that fail in predictable ways. Third, leaders who lack AI ethics fluency create governance structures that look good in policy documents but don't actually prevent harm.",
    "Closing the gap requires more than AI literacy training. It requires developing a new set of leadership capabilities — what we call AI-era leadership — that combines strategic fluency with ethical judgment and adaptive capacity.",
    "Organizations that close the AI leadership gap first will have a sustainable competitive advantage. Those that don't will find that their AI investments deliver less than promised — and their leaders are increasingly unable to tell them why.",
  ],
  default: [
    "Leadership development sits at the intersection of human potential and organizational performance. When it works, it compounds — great leaders develop other great leaders, and the organization builds capability faster than it can deploy it.",
    "When it doesn't work — which is most of the time, according to most of the research — it consumes budget, creates cynicism, and leaves leaders worse off than before because they now know what they're supposed to do differently but have no system for actually changing.",
    "The difference between leadership development that works and leadership development that doesn't is almost never the content. It's the system. Assessment without coaching creates data without direction. Coaching without assessment lacks a starting point. Programs without coaching have no individual accountability. Succession without development is a list of names with no path to readiness.",
    "Building the system — the integrated, connected, end-to-end system — is the work. And it's harder than it sounds, because most organizations are buying components rather than building systems. They're working with a coaching provider here, an assessment company there, a training vendor somewhere else, and wondering why the sum of the parts doesn't add up to leadership capability.",
    "The organizations that get this right are the ones that treat leadership development as infrastructure — not as a program. Infrastructure requires investment, maintenance, and integration. Programs have start and end dates. Infrastructure doesn't.",
  ],
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

  const content = ARTICLE_CONTENT[slug] ?? ARTICLE_CONTENT.default

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-12" style={{ background: "var(--color-navy-900)" }}>
        <div className="container-content max-w-3xl">
          <Breadcrumbs crumbs={[{ label: "Insights", href: "/insights" }, { label: article.category }]} />
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-700 px-3 py-1 rounded-full" style={{ background: "rgba(193,154,91,0.15)", color: "var(--color-gold-400)", fontWeight: 700 }}>
                {article.category}
              </span>
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
            <div className="ml-auto flex items-center gap-3">
              {["LinkedIn", "X", "Email"].map((platform) => (
                <button key={platform} className="text-xs text-white/30 hover:text-white/70 transition-colors">
                  Share on {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="section-padding" style={{ background: "white" }}>
        <div className="container-content max-w-3xl">
          <div className="prose prose-lg max-w-none">
            {content.map((para, i) => (
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
                <p className="text-sm text-neutral-500 leading-relaxed">A senior practitioner at {FIRM_NAME}, with expertise in leadership development, organizational transformation, and executive coaching. Author of multiple research publications on leadership in the AI era.</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <CTABanner headline="Ready to apply these insights in your organization?" primaryLabel="Request a Consultation" primaryHref="/consultation" secondaryLabel="More Insights" secondaryHref="/insights" />
    </>
  )
}
