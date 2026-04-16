"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { AIBadge } from "@/components/ui/AIBadge"
import { CTABanner } from "@/components/sections/CTABanner"
import { FIRM_NAME, LIFECYCLE_FRAMEWORK_NAME, MESSAGING } from "@/lib/constants"

export const pageMetadata = {
  title: `The Leadership Development Framework | ${FIRM_NAME}`,
  description:
    "We operate within the leadership development segment of the talent lifecycle — delivering the deepest, most integrated capability in the market.",
}

// ── Audience cards ────────────────────────────────────────────
const AUDIENCE_MATRIX = [
  {
    level: "Emerging Leaders",
    color: "rgba(93,171,121,0.12)",
    textColor: "#5dab79",
    capabilities: [
      "Assessment-Based Development",
      "Cohort-Based Learning",
      "Manager Effectiveness",
      "Coaching Integration",
      "AI Fluency for the Next Generation",
      "Pipeline Connection",
    ],
  },
  {
    level: "Senior Leaders",
    color: "rgba(93,171,121,0.08)",
    textColor: "#5dab79",
    capabilities: [
      "Executive Presence Development",
      "Strategic Thinking",
      "Cross-Functional Leadership",
      "Coaching for Senior Leaders",
      "AI Strategy Literacy",
      "C-Suite Preparation",
    ],
  },
  {
    level: "C-Suite & Board",
    color: "rgba(93,171,121,0.05)",
    textColor: "#5dab79",
    capabilities: [
      "CEO Advisory & Coaching",
      "Board Effectiveness",
      "C-Suite Team Alignment",
      "CEO & Board Succession",
      "Executive Transitions",
      "AI Strategy for the Boardroom",
    ],
  },
]

// ── Framework matrix data ─────────────────────────────────────
type Scenario = { title: string; quote: string; happening: string; matters: string }
type CellData = { headline: string; intro: string; scenarios: Scenario[] }

const FRAMEWORK_CELLS: Record<string, CellData> = {
  "Individual-Foundational": {
    headline: "When Leaders Need Core Skills and Self-Awareness",
    intro: "The bread-and-butter leadership challenges — building the baseline capabilities every leader needs to be effective.",
    scenarios: [
      { title: "The New Manager Cliff", quote: "We promote our best individual contributors, hand them a team, and hope for the best. Half are drowning.", happening: "First-time managers lacking foundational skills in delegation, feedback, difficult conversations, and performance management.", matters: "60% of new managers underperform in their first two years. The cost is the disengagement of their direct reports." },
      { title: "The Feedback Desert", quote: "Our senior leaders haven't received honest feedback in years. They have no idea how they're perceived.", happening: "Leaders operating without a clear picture of their impact. No structured feedback, no coaching, no upward candor.", matters: "Leaders without feedback develop blind spots that compound. By the time issues surface, trust is already eroded." },
      { title: "Inconsistent Leadership Quality", quote: "Whether you have a great experience here depends entirely on which manager you get.", happening: "Wide variance in leadership quality. No shared language, no common expectations, no systematic development.", matters: "Inconsistent leadership is the #1 driver of employee experience variation. It shows directly in retention." },
      { title: "Leading in the Age of AI", quote: "Our leaders don't understand what AI means for their teams — who to hire, what to automate. They're frozen.", happening: "A workforce transformation is underway and leaders lack fluency to make good decisions about technology and talent.", matters: "Organizations that wait to build AI-literate leadership will be two years behind competitors who moved early." },
    ],
  },
  "Individual-Transformational": {
    headline: "When Leaders Need to Transform Themselves",
    intro: "These are the moments when skill-building isn't enough — the leader's mindset, identity, or way of operating needs to fundamentally shift.",
    scenarios: [
      { title: "The Brilliant Bottleneck", quote: "Our CEO is incredibly smart, but people are afraid to bring her bad news. We're losing good people.", happening: "A high-performing leader whose strengths have become liabilities. Control, speed, perfectionism — now limiting the organization.", matters: "Without deep personal work, these patterns repeat. The leader becomes the ceiling on the organization's growth." },
      { title: "The New Role Inflection Point", quote: "He was our best division president, but six months into the CEO role he's struggling.", happening: "A leader promoted into a fundamentally different role who hasn't made the internal shift from their previous identity.", matters: "Failed transitions cost 10–20x the leader's salary. The gap isn't competence — it's the ability to reimagine who they need to become." },
      { title: "The Wake-Up Call", quote: "The board feedback was devastating. For the first time, she's asking what she needs to change.", happening: "A critical moment — crisis, 360 result, board confrontation — has shaken a leader's self-narrative. They're suddenly open to change.", matters: "These windows of openness are rare and time-limited. The right intervention here can catalyze a transformation." },
      { title: "Leading Through Personal Crisis", quote: "He's going through a divorce, his father died, and he's supposed to lead a 5,000-person integration.", happening: "A leader facing personal upheaval and professional demands simultaneously. Inner resources are depleted.", matters: "Leaders without support here burn out, make poor decisions, or emotionally withdraw — all cascading through the org." },
    ],
  },
  "Team-Foundational": {
    headline: "When Teams Need to Work Together More Effectively",
    intro: "Everyday team performance challenges — missed deadlines, poor communication, and frustrated employees.",
    scenarios: [
      { title: "The Dysfunctional Meeting Cycle", quote: "We spend 60% of our time in meetings, and nothing gets decided.", happening: "A team lacking basic operating rhythms — clear roles, decision rights, communication cadence, and accountability.", matters: "Ineffective teams multiply dysfunction: every unclear decision creates downstream confusion for dozens." },
      { title: "The Cross-Functional Stalemate", quote: "Sales blames product, product blames engineering, engineering blames sales. Nobody owns the customer.", happening: "Functional teams that can't collaborate across boundaries. Competing priorities and a culture of blame.", matters: "Value is created at the seams between functions. Teams that can't collaborate can't innovate." },
      { title: "The Remote/Hybrid Struggle", quote: "Half the team is remote, half in-office. We've lost the connective tissue that used to make us work.", happening: "A team that hasn't adapted its practices for distributed work. Proximity bias and information asymmetry are growing.", matters: "Hybrid is permanent. Teams that don't build new norms will see declining trust and eventual talent flight." },
      { title: "Post-Reorg Recovery", quote: "We reorganized six months ago and people are still figuring out who does what. Morale has cratered.", happening: "A newly reconfigured team that needs to rebuild trust, clarity, and shared purpose from a standing start.", matters: "Every week a new team spends in ambiguity costs real output. Fast team formation makes or breaks a reorg." },
    ],
  },
  "Team-Transformational": {
    headline: "When Leadership Teams Are Stuck at the Deepest Level",
    intro: "These are situations where the top team's dysfunction is systemic — it can't be fixed with a team offsite or a new meeting cadence.",
    scenarios: [
      { title: "The Silent War Room", quote: "Everyone's polite in the room, but the real conversations happen in the hallway.", happening: "Entrenched political dynamics, unspoken rivalries, or trust deficits that prevent honest dialogue on strategy and trade-offs.", matters: "When the top team can't have difficult conversations, the entire organization becomes paralyzed." },
      { title: "Post-Merger Integration", quote: "We merged twelve months ago but we still have two companies.", happening: "Two leadership teams with different cultures and power dynamics told to become one — without doing the deep work of integration.", matters: "70% of mergers fail to capture expected value. Executive team dysfunction is the #1 reason." },
      { title: "The New CEO's Inherited Team", quote: "Three people loyal to my predecessor, two who wanted my job, one I brought in. This isn't a team.", happening: "A new CEO must forge a cohesive top team from conflicting loyalties, competing agendas, and no shared foundation.", matters: "The first 100 days set the trajectory. A CEO who can't build a team fast will manage around dysfunction for years." },
      { title: "Strategic Reinvention Required", quote: "We all agree we need to transform, but every time we try to make hard calls, we retreat to protecting our divisions.", happening: "The team's identity and incentives are designed for the old strategy. Enterprise-level trade-offs require a new way of working.", matters: "Without team-level transformation, strategic pivots remain PowerPoint exercises." },
    ],
  },
  "Organization-Foundational": {
    headline: "When the Enterprise Needs Scalable Leadership Infrastructure",
    intro: "Systemic challenges — building the platforms, processes, and capabilities that allow an organization to develop leaders at scale.",
    scenarios: [
      { title: "The Succession Vacuum", quote: "Our CEO retires in 18 months and we have no credible internal candidates. We never built the pipeline.", happening: "No systematic process to identify, develop, and test the next generation of senior leaders.", matters: "External CEO hires fail at 2x the rate of internal promotions. No pipeline = enterprise value risk." },
      { title: "Change Fatigue at Scale", quote: "We've had four restructurings in three years. Employees hear 'transformation' and shut down.", happening: "An organization needing continuous change but having depleted its people's capacity to absorb more.", matters: "Without standing change capability, every subsequent transformation fails — and each failure makes the next harder." },
      { title: "The Middle Management Gap", quote: "We invest in our top 50 and our first-time managers. We do nothing for the 500 in between.", happening: "Directors, VPs, senior managers — the layer that translates strategy into execution — systematically underdeveloped.", matters: "Middle managers determine whether strategy lands or dies. This is the highest-ROI gap to close." },
      { title: "Scaling with Culture Intact", quote: "We're opening in three new markets. How do we ensure our leadership culture travels with us?", happening: "An organization expanding that needs to propagate leadership standards and values without diluting them.", matters: "Culture doesn't scale by accident. Without intentional infrastructure, every new market becomes a cultural island." },
    ],
  },
  "Organization-Transformational": {
    headline: "When the Organization Itself Needs to Evolve",
    intro: "Enterprise-level challenges where the culture, operating model, or leadership system must fundamentally change.",
    scenarios: [
      { title: "Culture Is Eating Strategy", quote: "We have a great strategy, but our culture — risk-averse, siloed, hierarchical — makes it impossible to execute.", happening: "Deeply embedded norms and behaviors misaligned with business needs. Leaders at every level default to old patterns.", matters: "Culture change takes years. Organizations that don't invest systematically will underperform their strategic ambitions." },
      { title: "Digital / AI Transformation", quote: "We're investing $500M in digital. The technology is the easy part — getting leaders to operate differently is killing us.", happening: "A major transformation where the technical solution outpaces the organization's ability to lead differently.", matters: "The #1 predictor of digital transformation failure is leadership capability, not technology." },
      { title: "Growth Beyond the Founder", quote: "We've grown from 200 to 3,000 people in four years. Everything that used to work is breaking.", happening: "A rapidly scaling organization whose leadership infrastructure was designed for a smaller, simpler company.", matters: "Without enterprise-grade leadership systems, the organization will plateau and see its culture diluted." },
      { title: "Rebuilding After Crisis", quote: "After the scandal, we lost the trust of our employees, board, and market. We need to rebuild from the inside out.", happening: "Ethical failures, safety incidents, or mass attrition requiring not recovery but a re-founding of how the org leads.", matters: "Reputational recovery requires visible, authentic cultural change. Surface-level programs are seen as performative." },
    ],
  },
}

const MATRIX_ROWS = ["Individual", "Team", "Organization"]
const MATRIX_ROW_DESCS: Record<string, string> = {
  Individual: "Each leader",
  Team: "Collective leadership",
  Organization: "Systemic capability",
}

// ── Circular lifecycle SVG ────────────────────────────────────
// Order: Development at top, then clockwise natural sequence
// Slots: 0=Development, 1=Retention, 2=Succession, 3=Recruitment, 4=Assessment, 5=Training
const CYCLE_SEGMENTS = [
  { label: "Development", desc: "Our domain", primary: true },
  { label: "Retention", desc: "Engagement\n& culture", primary: false },
  { label: "Succession", desc: "Pipeline\ncontinuity", primary: false },
  { label: "Recruitment", desc: "Sourcing\n& hiring", primary: false },
  { label: "Assessment", desc: "Diagnosing\ncapability", primary: false },
  { label: "Training", desc: "Building\nskills", primary: false },
]

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function chevronArcPath(cx: number, cy: number, rIn: number, rOut: number, slotIndex: number) {
  const slotStart = slotIndex * 60
  const arcStart = slotStart + 5
  const arcEnd = slotStart + 55
  const tipAngle = slotStart + 62 // tip extends past the slot end

  const rMid = (rIn + rOut) / 2

  const oStart = polar(cx, cy, rOut, arcStart)
  const oEnd = polar(cx, cy, rOut, arcEnd)
  const tip = polar(cx, cy, rMid, tipAngle)
  const iEnd = polar(cx, cy, rIn, arcEnd)
  const iStart = polar(cx, cy, rIn, arcStart)

  const f = (n: number) => n.toFixed(2)

  return [
    `M${f(oStart.x)},${f(oStart.y)}`,
    `A${rOut},${rOut},0,0,1,${f(oEnd.x)},${f(oEnd.y)}`,
    `L${f(tip.x)},${f(tip.y)}`,
    `L${f(iEnd.x)},${f(iEnd.y)}`,
    `A${rIn},${rIn},0,0,0,${f(iStart.x)},${f(iStart.y)}`,
    "Z",
  ].join(" ")
}

function CircularLifecycle() {
  const cx = 175, cy = 175
  const rIn = 82, rOut = 148
  const rMid = (rIn + rOut) / 2

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
      <div className="w-full max-w-[360px] mx-auto lg:mx-0 shrink-0">
        <svg viewBox="0 0 350 350" className="w-full">
          {CYCLE_SEGMENTS.map((seg, i) => {
            const midAngle = i * 60 + 30
            const labelPos = polar(cx, cy, rMid, midAngle)
            const lines = seg.desc.split("\n")

            const fill = seg.primary ? "#2d5a3d" : "#dde5db"
            const textColor = seg.primary ? "white" : "#6b7a6e"
            const subColor = seg.primary ? "rgba(255,255,255,0.65)" : "#9aaa96"

            return (
              <g key={seg.label}>
                <path d={chevronArcPath(cx, cy, rIn, rOut, i)} fill={fill} />
                {/* Segment label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y - (lines.length > 1 ? 12 : 6)}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="10.5"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  {seg.label}
                </text>
                {lines.map((line, li) => (
                  <text
                    key={li}
                    x={labelPos.x}
                    y={labelPos.y + 4 + li * 12}
                    textAnchor="middle"
                    fill={subColor}
                    fontSize="8.5"
                    fontFamily="sans-serif"
                  >
                    {line}
                  </text>
                ))}
                {/* "OUR FOCUS" badge on Development */}
                {seg.primary && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 34}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.5)"
                    fontSize="7"
                    fontWeight="700"
                    fontFamily="sans-serif"
                    letterSpacing="1.5"
                  >
                    OUR FOCUS
                  </text>
                )}
              </g>
            )
          })}

          {/* Center circle */}
          <circle cx={cx} cy={cy} r={rIn - 6} fill="white" />
          <circle cx={cx} cy={cy} r={rIn - 6} fill="none" stroke="#d1e8d9" strokeWidth="1.5" />
          <text x={cx} y={cy - 10} textAnchor="middle" fontSize="8" fill="#5dab79" fontWeight="700" fontFamily="sans-serif" letterSpacing="1">
            CONTINUOUS CYCLE
          </text>
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize="11" fill="#1a3d2b" fontWeight="700" fontFamily="sans-serif">
            Leadership
          </text>
          <text x={cx} y={cy + 21} textAnchor="middle" fontSize="11" fill="#1a3d2b" fontWeight="700" fontFamily="sans-serif">
            Development
          </text>
          <text x={cx} y={cy + 36} textAnchor="middle" fontSize="9" fill="#5dab79" fontFamily="sans-serif">
            is our core
          </text>
        </svg>
      </div>

      {/* Context text */}
      <div className="flex-1 space-y-6">
        <div>
          <p className="text-xs font-700 tracking-widest uppercase text-forest-600 mb-2" style={{ fontWeight: 700 }}>Our Domain</p>
          <h2 className="text-2xl font-700 text-forest-950 mb-3" style={{ fontWeight: 700 }}>
            Leadership development is one phase of a broader talent lifecycle.
          </h2>
          <p className="text-forest-800/70 leading-relaxed text-sm">
            Organizations cycle through six phases — from recruitment to succession. We don't claim to serve them all. We specialize completely in leadership development, and we go deeper in this segment than any generalist firm can.
          </p>
        </div>
        <div
          className="p-5 rounded-xl"
          style={{ background: "var(--color-forest-900)", border: "none" }}
        >
          <p className="text-xs font-700 uppercase tracking-widest mb-2" style={{ fontWeight: 700, color: "rgba(134,212,163,0.8)" }}>
            What "end-to-end" means here
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
            Within leadership development, we are your complete partner — from the first diagnostic through executive coaching, development programs, organizational transformation, and long-term succession. One team. One methodology. No handoffs.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function LifecyclePage() {
  const [activeCell, setActiveCell] = useState<string | null>(null)

  const toggle = (key: string) => setActiveCell(prev => (prev === key ? null : key))

  const activeCellData = activeCell ? FRAMEWORK_CELLS[activeCell] : null
  const [activeRow, activeType] = activeCell ? activeCell.split("-") : [null, null]

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        className="relative pt-40 pb-24"
        style={{ background: "linear-gradient(160deg, var(--color-forest-50) 0%, var(--color-warm-50) 100%)" }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(at 70% 30%, rgba(93,171,121,0.12) 0px, transparent 60%)" }} />
        <div className="container-content relative z-10 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-sm font-700 tracking-[0.15em] uppercase text-forest-600 mb-5" style={{ fontWeight: 700 }}>
              {LIFECYCLE_FRAMEWORK_NAME}
            </p>
            <h1 className="display-lg text-forest-950 mb-6">
              Best in class.{" "}
              <span style={{ color: "var(--color-forest-600)" }}>Within the segment that matters most.</span>
            </h1>
            <p className="text-xl text-forest-800/70 leading-relaxed max-w-2xl mx-auto">
              Every organization manages talent across a full lifecycle — from recruiting to succession. We operate within the leadership development segment and deliver the deepest, most integrated capability in the market.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CIRCULAR TALENT LIFECYCLE ─────────────────────── */}
      <section className="py-16 lg:py-20" style={{ background: "var(--color-forest-50)" }}>
        <div className="container-content">
          <CircularLifecycle />
        </div>
      </section>

      {/* ── WHY END-TO-END ────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, var(--color-navy-950) 0%, #040e1a 100%)" }}>
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-xs font-700 tracking-widest uppercase mb-4" style={{ fontWeight: 700, color: "rgba(134,212,163,0.7)" }}>
              Why It Matters
            </p>
            <h2 className="display-md text-white mb-5">
              Behavioral change can't survive a handoff.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Every other talent investment produces a discrete output — a hire, a credential, a promoted person. Leadership development's output is behavioral change, which only happens through sustained, connected reinforcement over months and years. The moment you fragment that across different vendors, the behavioral thread breaks at every seam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                number: "01",
                title: "Every handoff is a memory wipe.",
                body: "The assessment findings that should inform the coaching never arrive. The coaching discoveries that should shape the program never land. The program outcomes that should feed the transformation strategy get lost. Every time a new vendor enters, the context built by the last one walks out the door — and the leader starts over with someone who doesn't know them.",
              },
              {
                number: "02",
                title: "Trust is the medium. It's fragile.",
                body: "The most important leadership development work happens when a leader is willing to be vulnerable — to examine a blind spot, challenge a deep pattern, confront something they've never said out loud. That level of openness takes months to build with an advisor. It evaporates when a new vendor takes over at the next phase. Providers who see only their phase never earn the depth that produces real change.",
              },
              {
                number: "03",
                title: "One partner owns the outcome.",
                body: "In fragmented engagements, no one owns the result. The assessment firm says the data was sound. The coach says the coachee wasn't ready. The program vendor says the environment didn't support the change. One integrated partner has nowhere to point but back at themselves — which means they design for outcomes, not deliverables. That accountability changes everything.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="p-7 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-xs font-700 mb-4" style={{ fontWeight: 700, color: "rgba(134,212,163,0.6)" }}>
                  {item.number}
                </p>
                <h3 className="text-lg font-700 text-white mb-3" style={{ fontWeight: 700 }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-base font-600 mb-6" style={{ fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
              This is why we built one firm that holds the complete picture — and why clients who've tried fragmented models don't go back.
            </p>
            <Button href="/contact" variant="primary" size="lg">
              Talk to Us About Your Leadership Development Needs
            </Button>
          </div>
        </div>
      </section>

      {/* ── CORE FRAMEWORK MATRIX ─────────────────────────── */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="Our Framework"
            title="Every level. Every type of change."
            subtitle="Our work spans three levels of leadership and two modes of development. Select any quadrant to explore the challenges we address."
            className="mb-10"
          />

          {/* Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[520px]">
              {/* Header */}
              <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: "140px 1fr 1fr" }}>
                <div />
                <div className="text-center px-4 py-3 rounded-xl" style={{ background: "var(--color-forest-50)", border: "1px solid var(--color-forest-200)" }}>
                  <p className="text-sm font-700 text-forest-900" style={{ fontWeight: 700 }}>Foundational</p>
                  <p className="text-xs text-forest-600/70 mt-0.5">Skills, capabilities & knowledge</p>
                </div>
                <div className="text-center px-4 py-3 rounded-xl" style={{ background: "var(--color-navy-950)", border: "1px solid rgba(193,154,91,0.2)" }}>
                  <p className="text-sm font-700 text-white" style={{ fontWeight: 700 }}>Transformational</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Identity, mindset & deep change</p>
                </div>
              </div>

              {/* Rows */}
              {MATRIX_ROWS.map((level, rowIdx) => (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: rowIdx * 0.08 }}
                  className="grid gap-3 mb-3"
                  style={{ gridTemplateColumns: "140px 1fr 1fr" }}
                >
                  {/* Row label */}
                  <div className="p-4 rounded-xl flex flex-col justify-center" style={{ background: "var(--color-forest-900)" }}>
                    <p className="text-sm font-700 text-white" style={{ fontWeight: 700 }}>{level}</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{MATRIX_ROW_DESCS[level]}</p>
                  </div>

                  {/* Foundational cell */}
                  {(["Foundational", "Transformational"] as const).map((type) => {
                    const key = `${level}-${type}`
                    const isActive = activeCell === key
                    const isFoundational = type === "Foundational"
                    const data = FRAMEWORK_CELLS[key]
                    return (
                      <button
                        key={type}
                        onClick={() => toggle(key)}
                        className="text-left p-4 rounded-xl transition-all duration-200 group"
                        style={{
                          background: isActive
                            ? isFoundational ? "var(--color-forest-50)" : "var(--color-navy-950)"
                            : "var(--color-warm-50)",
                          border: isActive
                            ? isFoundational ? "2px solid var(--color-forest-500)" : "2px solid var(--color-gold-500)"
                            : "1px solid var(--color-warm-200)",
                          outline: "none",
                        }}
                      >
                        <p
                          className="text-xs font-700 uppercase tracking-wider mb-1.5"
                          style={{
                            fontWeight: 700,
                            color: isActive && !isFoundational
                              ? "var(--color-gold-400)"
                              : isFoundational
                              ? "var(--color-forest-600)"
                              : "var(--color-navy-600)",
                          }}
                        >
                          {type}
                        </p>
                        <p
                          className="text-sm font-600 leading-snug mb-3"
                          style={{
                            fontWeight: 600,
                            color: isActive && !isFoundational ? "white" : "var(--color-forest-950)",
                          }}
                        >
                          {data.headline}
                        </p>
                        <p
                          className="text-xs font-500 flex items-center gap-1"
                          style={{
                            color: isActive
                              ? isFoundational ? "var(--color-forest-600)" : "var(--color-gold-400)"
                              : "var(--color-forest-500)",
                          }}
                        >
                          {isActive ? (
                            <><span className="text-base leading-none">↑</span> Close</>
                          ) : (
                            <><span className="text-base leading-none">↓</span> See 4 scenarios</>
                          )}
                        </p>
                      </button>
                    )
                  })}
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Detail panel — full width below grid ── */}
          <AnimatePresence mode="wait">
            {activeCellData && activeRow && activeType && (
              <motion.div
                key={activeCell}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 rounded-2xl overflow-hidden"
                style={{
                  border: activeType === "Foundational"
                    ? "1.5px solid var(--color-forest-300)"
                    : "1.5px solid rgba(193,154,91,0.4)",
                  background: activeType === "Foundational" ? "var(--color-forest-50)" : "#05090f",
                }}
              >
                {/* Panel header */}
                <div
                  className="px-6 py-4 flex items-start justify-between gap-4"
                  style={{
                    borderBottom: activeType === "Foundational"
                      ? "1px solid var(--color-forest-200)"
                      : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div>
                    <p
                      className="text-xs font-700 uppercase tracking-widest mb-1"
                      style={{
                        fontWeight: 700,
                        color: activeType === "Foundational" ? "var(--color-forest-500)" : "var(--color-gold-400)",
                      }}
                    >
                      {activeRow} × {activeType}
                    </p>
                    <h3
                      className="text-lg font-700"
                      style={{
                        fontWeight: 700,
                        color: activeType === "Foundational" ? "var(--color-forest-950)" : "white",
                      }}
                    >
                      {activeCellData.headline}
                    </h3>
                    <p
                      className="text-sm mt-1"
                      style={{ color: activeType === "Foundational" ? "var(--color-forest-700)" : "rgba(255,255,255,0.5)" }}
                    >
                      {activeCellData.intro}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveCell(null)}
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg mt-1 transition-opacity hover:opacity-60"
                    style={{
                      background: activeType === "Foundational" ? "var(--color-forest-100)" : "rgba(255,255,255,0.08)",
                      color: activeType === "Foundational" ? "var(--color-forest-700)" : "rgba(255,255,255,0.6)",
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Scenario cards */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCellData.scenarios.map((scenario) => (
                    <div
                      key={scenario.title}
                      className="p-5 rounded-xl"
                      style={{
                        background: activeType === "Foundational" ? "white" : "rgba(255,255,255,0.04)",
                        border: activeType === "Foundational"
                          ? "1px solid var(--color-warm-100)"
                          : "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <p
                        className="text-sm font-700 mb-2"
                        style={{ fontWeight: 700, color: activeType === "Foundational" ? "var(--color-navy-900)" : "white" }}
                      >
                        {scenario.title}
                      </p>
                      <p
                        className="text-xs italic mb-4 leading-relaxed"
                        style={{ color: activeType === "Foundational" ? "var(--color-forest-600)" : "var(--color-gold-400)" }}
                      >
                        "{scenario.quote}"
                      </p>
                      <div className="space-y-2.5">
                        <div>
                          <p
                            className="text-[10px] font-700 uppercase tracking-wider mb-1"
                            style={{
                              fontWeight: 700,
                              color: activeType === "Foundational" ? "var(--color-forest-500)" : "rgba(255,255,255,0.3)",
                            }}
                          >
                            What's Happening
                          </p>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: activeType === "Foundational" ? "#525252" : "rgba(255,255,255,0.55)" }}
                          >
                            {scenario.happening}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-700 uppercase tracking-wider mb-1"
                            style={{
                              fontWeight: 700,
                              color: activeType === "Foundational" ? "var(--color-forest-500)" : "rgba(255,255,255,0.3)",
                            }}
                          >
                            Why It Matters
                          </p>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: activeType === "Foundational" ? "#525252" : "rgba(255,255,255,0.55)" }}
                          >
                            {scenario.matters}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-forest-700/50 mt-8 max-w-2xl mx-auto">
            Every offering integrates with adjacent solutions — creating a coherent development system, not a collection of standalone programs.
          </p>
        </div>
      </section>

      {/* ── DIFFERENTIATOR PULL QUOTE ─────────────────────── */}
      <section className="py-14" style={{ background: "var(--color-warm-white)", borderTop: "1px solid var(--color-warm-100)" }}>
        <div className="container-content max-w-3xl mx-auto text-center">
          <motion.p
            className="text-2xl font-600 text-navy-900 leading-relaxed"
            style={{ fontWeight: 600 }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ color: "var(--color-gold-600)" }}>"</span>
            {MESSAGING.differentiator}
            <span style={{ color: "var(--color-gold-600)" }}>"</span>
          </motion.p>
        </div>
      </section>

      {/* ── AUDIENCE CARDS ────────────────────────────────── */}
      <section className="section-padding" style={{ background: "var(--color-warm-white)" }}>
        <div className="container-content">
          <SectionHeading
            eyebrow="Lifecycle × Audience"
            title="The same framework. Every level."
            subtitle="Our framework isn't one-size-fits-all — it's calibrated to the specific challenges, context, and needs of leaders at every stage of their career."
            className="mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {AUDIENCE_MATRIX.map((audience, i) => (
              <motion.div
                key={audience.level}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="p-7 rounded-2xl border border-forest-200 bg-white"
                style={{ background: audience.color }}
              >
                <h3 className="font-700 text-forest-900 text-xl mb-5" style={{ fontWeight: 700 }}>{audience.level}</h3>
                <div className="space-y-2.5">
                  {audience.capabilities.map((cap) => (
                    <div key={cap} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: audience.textColor }} />
                      <span className="text-sm text-forest-800">{cap}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-forest-200">
                  <Link
                    href={i === 0 ? "/solutions/emerging-leaders" : i === 1 ? "/solutions/senior-leaders" : "/solutions/c-suite"}
                    className="text-sm font-600 text-forest-600 hover:text-forest-800 transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    Explore {audience.level} solutions →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI CALLOUT ────────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #020817 0%, #040e1a 100%)" }}>
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <div className="p-10 rounded-2xl border border-ai-500/20" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(0,212,255,0.02) 100%)" }}>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <AIBadge className="mb-4" />
                  <h2 className="display-md text-white mb-4">AI transformation cuts across every dimension</h2>
                  <p className="text-white/60 leading-relaxed mb-6">
                    AI isn't a standalone initiative — it's a cross-cutting capability that reshapes what great leadership looks like at every level, in every mode of development.
                  </p>
                  <Button href="/solutions/ai-transformation" variant="ai" size="lg">
                    Explore AI Leadership Transformation
                  </Button>
                </div>
                <div className="md:w-72">
                  <div className="space-y-3">
                    {[
                      { level: "Individual", detail: "AI fluency, AI strategy coaching, AI readiness diagnostics" },
                      { level: "Team", detail: "Human-AI collaboration, AI-augmented team effectiveness" },
                      { level: "Organization", detail: "AI adoption change management, AI governance, AI culture" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.level}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)" }}
                      >
                        <span className="text-xs font-700 px-2 py-1 rounded shrink-0" style={{ background: "rgba(0,212,255,0.12)", color: "#00d4ff", fontWeight: 700 }}>
                          {item.level}
                        </span>
                        <span className="text-xs text-white/50 leading-relaxed">{item.detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <CTABanner
        headline="Let's map your leadership development needs."
        subtext="Every organization is at a different stage. We'll help you understand where you are, where you need to go, and how to get there."
        primaryLabel="Start the Conversation"
        primaryHref="/contact"
        secondaryLabel="View All Solutions"
        secondaryHref="/solutions"
      />
    </>
  )
}
