// ============================================================
// SITE-WIDE CONSTANTS
// Replace [FIRM NAME] with the actual firm name when finalized
// ============================================================

export const FIRM_NAME: string = "Apex & Origin"
export const FIRM_TAGLINE = "The Complete Leadership Partner"
export const FIRM_DOMAIN = "https://www.leadershipfirm.com" // update when live
export const FIRM_EMAIL = "hello@leadershipfirm.com"
export const FIRM_PHONE = "+1 (800) 555-0100"

// Proprietary framework names (update when finalized)
export const LIFECYCLE_FRAMEWORK_NAME: string = `The ${FIRM_NAME} Leadership Lifecycle™`
export const AI_FRAMEWORK_NAME: string = "The AI Leadership Readiness Framework™"
export const PLATFORM_NAME: string = `The ${FIRM_NAME} Leadership Intelligence Platform™`

// Social
export const SOCIAL = {
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  youtube: "https://youtube.com",
}

// ── Scale metrics ────────────────────────────────────────────
// Displayed on homepage metrics bar and about page
export const METRICS = [
  { value: 10000, suffix: "+", label: "Leaders Developed" },
  { value: 200, suffix: "+", label: "Organizations Served" },
  { value: 35, suffix: "+", label: "Countries" },
  { value: 15, suffix: "+", label: "Years of Excellence" },
]

// ── Impact metrics for /results ──────────────────────────────
export const IMPACT_METRICS = [
  { value: 10000, suffix: "+", label: "Leaders Assessed" },
  { value: 50000, suffix: "+", label: "Coaching Hours Delivered" },
  { value: 500, suffix: "+", label: "Programs Completed" },
  { value: 200, suffix: "+", label: "Organizations Transformed" },
  { value: 92, suffix: "", label: "Net Promoter Score" },
  { value: 94, suffix: "%", label: "Coaching Client Return Rate" },
]

// ── Detailed metrics object (editable) ───────────────────────
export const DETAILED_METRICS = {
  leadersAssessed: "10,000+",
  leadersDeveloped: "8,500+",
  organizationsServed: "200+",
  countries: "35+",
  coachingHoursDelivered: "50,000+",
  yearsExperience: "15+",
  netPromoterScore: "92",
  coachReturnRate: "94%",
  assessmentInstruments: "12",
  programCompletionRate: "97%",
}

// ── Lifecycle phases ─────────────────────────────────────────
export const LIFECYCLE_PHASES = [
  {
    id: "assess",
    number: "01",
    title: "Assess",
    subtitle: "Diagnose & Discover",
    description:
      "Comprehensive diagnostics that reveal the true state of leadership capability — individual readiness, team dynamics, and organizational health. You can't develop what you haven't measured.",
    details: [
      "360-degree leadership assessments",
      "Organizational leadership audits",
      "Leadership readiness evaluations",
      "Team effectiveness diagnostics",
      "AI readiness assessments",
    ],
    link: "/solutions/assessment",
    color: "from-navy-800 to-navy-900",
  },
  {
    id: "coach",
    number: "02",
    title: "Coach",
    subtitle: "Develop & Strengthen",
    description:
      "ICF-certified coaching that translates assessment insights into individual transformation. Coaching is where awareness becomes action — informed by data, calibrated to context.",
    details: [
      "1:1 executive coaching",
      "Group coaching programs",
      "Team coaching engagements",
      "AI strategy coaching",
      "Leadership transition coaching",
    ],
    link: "/solutions/coaching",
    color: "from-gold-700 to-gold-800",
  },
  {
    id: "develop",
    number: "03",
    title: "Develop",
    subtitle: "Build & Scale",
    description:
      "Structured programs that build leadership capability at scale — from emerging managers to senior executives. While coaching is 1:1, leadership development programs reach cohorts, teams, and entire leadership populations.",
    details: [
      "Custom leadership academies",
      "Cohort-based programs",
      "Emerging leader accelerators",
      "Senior leader intensives",
      "AI fluency programs",
    ],
    link: "/solutions/programs",
    color: "from-navy-700 to-navy-800",
  },
  {
    id: "transform",
    number: "04",
    title: "Transform",
    subtitle: "Align & Evolve",
    description:
      "Organization-wide transformation that changes how leaders lead, teams collaborate, and organizations perform. This is where individual leadership growth meets enterprise strategy.",
    details: [
      "Culture transformation",
      "Team alignment & effectiveness",
      "Organizational design consulting",
      "Change leadership",
      "AI adoption change management",
    ],
    link: "/solutions/transformation",
    color: "from-gold-600 to-gold-700",
  },
  {
    id: "sustain",
    number: "05",
    title: "Sustain",
    subtitle: "Secure & Grow",
    description:
      "Strategic succession planning that ensures leadership continuity, pipeline depth, and organizational resilience. Phase 5 feeds directly back into Phase 1 — creating a continuous, self-reinforcing cycle.",
    details: [
      "Succession planning strategy",
      "High-potential identification",
      "Leadership pipeline management",
      "Executive transition planning",
      "Board succession advisory",
    ],
    link: "/solutions/succession",
    color: "from-navy-600 to-navy-700",
  },
]

// ── Solutions ────────────────────────────────────────────────
export const SOLUTIONS = [
  {
    title: "Assessment & Diagnostics",
    description: "360 reviews, leadership audits, and readiness evaluations that feed directly into coaching plans and leadership development curricula.",
    href: "/solutions/assessment",
    phase: "Assess",
    icon: "search",
    featured: false,
  },
  {
    title: "Executive Coaching",
    description: "ICF-certified 1:1, group, and team coaching that transforms individual and collective leadership performance.",
    href: "/solutions/coaching",
    phase: "Coach",
    icon: "users",
    featured: false,
  },
  {
    title: "Leadership Development Programs",
    description: "Cohort-based curricula and custom academies that build leadership capability at every level, at scale.",
    href: "/solutions/programs",
    phase: "Develop",
    icon: "graduation-cap",
    featured: false,
  },
  {
    title: "Team & Org Transformation",
    description: "Culture change, team alignment, and change management for the most complex organizational challenges.",
    href: "/solutions/transformation",
    phase: "Transform",
    icon: "building",
    featured: false,
  },
  {
    title: "Succession Planning",
    description: "End-to-end pipeline mapping, high-potential identification, and executive transition support.",
    href: "/solutions/succession",
    phase: "Sustain",
    icon: "trending-up",
    featured: false,
  },
  {
    title: "AI Leadership Transformation",
    description: "Preparing leaders to lead effectively in an AI-driven world — across strategy, fluency, governance, and adoption.",
    href: "/solutions/ai-transformation",
    phase: "All Phases",
    icon: "zap",
    featured: true,
  },
]

// ── Audience levels ──────────────────────────────────────────
export const AUDIENCE_LEVELS = [
  {
    title: "Emerging Leaders",
    description: "First-time managers, high-potentials, and individual contributors navigating the hardest career transition most people will ever make.",
    href: "/solutions/emerging-leaders",
  },
  {
    title: "Senior Leaders",
    description: "Directors, VPs, and SVPs who've mastered managing people and now need to master managing strategy, influence, and enterprise complexity.",
    href: "/solutions/senior-leaders",
  },
  {
    title: "C-Suite & Board",
    description: "CEOs, CXOs, and board members who require a different kind of partner — one who meets them at the level of judgment, legacy, and consequence.",
    href: "/solutions/c-suite",
  },
]

// ── Industries ───────────────────────────────────────────────
export const INDUSTRIES = [
  { title: "Financial Services", href: "/industries/financial-services", icon: "landmark" },
  { title: "Technology", href: "/industries/technology", icon: "cpu" },
  { title: "Healthcare", href: "/industries/healthcare", icon: "heart-pulse" },
  { title: "Manufacturing", href: "/industries/manufacturing", icon: "factory" },
  { title: "Energy", href: "/industries/energy", icon: "zap" },
  { title: "Government & Public Sector", href: "/industries/government", icon: "shield" },
  { title: "Professional Services", href: "/industries/professional-services", icon: "briefcase" },
  { title: "Education", href: "/industries/education", icon: "graduation-cap" },
  { title: "Retail & Consumer Goods", href: "/industries/retail", icon: "shopping-bag" },
  { title: "Non-Profit & Social Sector", href: "/industries/nonprofit", icon: "heart" },
  { title: "Life Sciences & Pharma", href: "/industries/life-sciences", icon: "flask" },
  { title: "Hospitality & Travel", href: "/industries/hospitality", icon: "globe" },
]

// ── Key messaging ────────────────────────────────────────────
export const MESSAGING = {
  primaryClaim: "The only firm that treats leadership development as the connected system it actually is — not a sequence of programs from different vendors.",
  integrationMessage: "One partner, one methodology, one outcome.",
  lifecycleSpan: "From the first assessment to the last succession plan.",
  audienceSpan: "From first-time managers to the boardroom.",
  scaleSpan: "One executive or an entire organization.",
  connectionChain: "Assessment that feeds coaching. Coaching that reinforces leadership development. Development that enables transformation. Transformation that sustains through succession.",
  differentiator: "Behavioral change can't survive a handoff. Every new vendor is a memory wipe — the context, data, and trust built in one phase have to be rebuilt from scratch in the next. We hold the whole picture.",
  philosophy: "Leadership development only works as a system. The moment you fragment it across vendors, the behavioral change you paid for starts to unravel.",
  whyEndToEnd: "Every other talent investment produces a discrete output: a hire, a credential, a promoted person. Leadership development's output is behavioral change — which only happens through sustained, connected reinforcement across assessment, coaching, programs, transformation, and succession. Fragment those phases across vendors, and the behavioral thread breaks at every seam.",
  aiUrgency: "AI isn't a feature. It's a fundamental shift in what leadership means.",
  challenge: "The question isn't whether your leaders need to change. It's whether your leadership development partner can hold the thread long enough for the change to stick.",
}

// ── Sample articles ──────────────────────────────────────────
export const SAMPLE_ARTICLES = [
  {
    slug: "end-to-end-imperative",
    title: "The End-to-End Imperative: Why Fragmented Leadership Development Is Failing",
    category: "Leadership Strategy",
    readTime: "8 min read",
    date: "2025-03-20",
    excerpt:
      "Organizations that use one vendor for assessment, another for coaching, and another for training are wasting money and getting worse outcomes. The lack of integration is costing them more than they realize.",
    author: "Dr. Marcus Webb",
    authorTitle: "Chief Science Officer",
  },
  {
    slug: "ai-capabilities-leaders",
    title: "5 Leadership Capabilities AI Can't Replace — And the 3 It Already Has",
    category: "AI & Leadership",
    readTime: "6 min read",
    date: "2025-03-10",
    excerpt:
      "AI is already better than humans at pattern recognition, information synthesis, and routine decisions. But judgment, trust, vision, and meaning-making remain irreducibly human. Here's the distinction that matters.",
    author: "Sarah Lindström",
    authorTitle: "Head of AI Leadership Practice",
  },
  {
    slug: "succession-paradox",
    title: "The Succession Planning Paradox: Why Most Companies Plan for the CEO but Forget Everyone Else",
    category: "Succession",
    readTime: "7 min read",
    date: "2025-02-28",
    excerpt:
      "CEO succession gets the boardroom attention. But organizational resilience depends on leadership continuity at every critical level. The companies that build deep pipelines consistently outperform those that don't.",
    author: "Diana Torres",
    authorTitle: "Head of Succession & Talent Strategy",
  },
  {
    slug: "engineer-to-executive",
    title: "From Engineer to Executive: Why Technical Leaders Need a Different Development Path",
    category: "Leader Development",
    readTime: "9 min read",
    date: "2025-02-10",
    excerpt:
      "The skills that make someone a brilliant engineer are often the exact opposite of what makes them an effective executive. The transition requires unlearning as much as learning. Most companies get this wrong.",
    author: "Dr. Thomas Park",
    authorTitle: "Head of Emerging Leaders Programs",
  },
  {
    slug: "board-blind-spot",
    title: "The Board's Blind Spot: Why Governance Needs a Leadership Development Strategy",
    category: "Governance & Board",
    readTime: "7 min read",
    date: "2025-01-30",
    excerpt:
      "Most boards oversee leadership development with a 30-minute quarterly update. But leadership capability is the single biggest determinant of strategy execution. Boards that treat it as HR are exposed.",
    author: "Diana Torres",
    authorTitle: "Head of Succession & Talent Strategy",
  },
]

// ── AI Framework pillars ─────────────────────────────────────
export const AI_FRAMEWORK_PILLARS = [
  {
    number: "01",
    icon: "🧭",
    title: "AI Strategic Fluency",
    description:
      "Leaders need to understand AI well enough to make sound strategic decisions — not to code, but to know which questions to ask, which claims to challenge, and which investments to greenlight.",
    detail:
      "Understanding AI capabilities, limitations, economics, and competitive implications. Build vs. buy vs. partner decisions. Evaluating AI vendor claims with informed skepticism.",
  },
  {
    number: "02",
    icon: "🤝",
    title: "Human-AI Collaboration Leadership",
    description:
      "Leading teams where humans and AI work together requires redesigning workflows, decision-making processes, and accountability structures — while preserving what is irreducibly human.",
    detail:
      "Workflow redesign for human-AI teams. Managing the shift in what 'expertise' means. Maintaining human judgment and creativity as the irreplaceable complement to AI capability.",
  },
  {
    number: "03",
    icon: "⚖️",
    title: "Ethical AI Governance",
    description:
      "Leading the responsible deployment of AI — establishing governance frameworks, navigating bias and fairness, building organizational trust in AI through principled leadership.",
    detail:
      "AI governance frameworks and oversight structures. Bias, fairness, transparency, and accountability in AI systems. Building trust in AI through responsible leadership behavior.",
  },
  {
    number: "04",
    icon: "📊",
    title: "AI-Driven Decision Architecture",
    description:
      "Redesigning how organizations make decisions when AI provides inputs, recommendations, or automation — knowing when to trust AI and when human wisdom must override it.",
    detail:
      "Decision frameworks for human-AI collaboration. Avoiding both AI over-reliance and under-utilization. Integrating AI speed without sacrificing human judgment.",
  },
  {
    number: "05",
    icon: "🌊",
    title: "Leading Through AI Disruption",
    description:
      "Building organizations that can continuously absorb AI evolution — not as a one-time project, but as a permanent organizational capability for sustained adaptation.",
    detail:
      "Change leadership for AI-driven transformation. Communicating vision during uncertainty. Building adaptive, learning organizations that evolve as fast as the technology.",
  },
]

// ── Team members ─────────────────────────────────────────────
export const TEAM_MEMBERS = [
  {
    name: "Alexandra Chen",
    title: "Founder & CEO",
    bio: "Alexandra founded the firm after 25 years as a CHRO and organizational leadership development leader at Fortune 200 companies. She witnessed firsthand how fragmented leadership development was failing the executives she served — and built this firm to solve it permanently.",
    credentials: [
      "PhD, Industrial-Organizational Psychology, Columbia University",
      "ICF Master Certified Coach (MCC)",
      "Board Advisor, 3 Public Companies",
    ],
    specializations: ["C-Suite Advisory", "AI Transformation", "Organizational Strategy"],
    linkedin: "#",
  },
  {
    name: "Jonathan Voss",
    title: "Chief Solutions Officer",
    bio: "Jonathan leads the design and delivery of all solutions across the lifecycle. A former partner in a Big 4 human capital practice, he has overseen large-scale leadership transformation at some of the world's most complex organizations.",
    credentials: [
      "MBA, Wharton School of Business",
      "Former Big 4 Human Capital Partner",
      "Certified in Prosci Change Management",
    ],
    specializations: ["Culture Transformation", "Organizational Design", "Large-Scale Programs"],
    linkedin: "#",
  },
  {
    name: "Dr. Marcus Webb",
    title: "Chief Science Officer",
    bio: "Marcus has spent 20 years advancing the science of leadership assessment and leadership development. His research has been published in Harvard Business Review, Academy of Management Journal, and Journal of Applied Psychology. He designed our proprietary assessment instruments.",
    credentials: [
      "PhD, Organizational Psychology, London School of Economics",
      "Published: HBR, Academy of Management Journal",
      "Former Research Director, Center for Creative Leadership",
    ],
    specializations: ["Methodology Design", "Assessment Science", "Research & Evidence Base"],
    linkedin: "#",
  },
  {
    name: "Dr. Priya Nair",
    title: "Head of Executive Coaching",
    bio: "One of fewer than 1,000 ICF Master Certified Coaches worldwide, Priya brings 18 years of executive coaching to C-suite leaders and senior teams. A former COO turned coach, she specializes in CEO advisory, executive transitions, and board effectiveness.",
    credentials: [
      "ICF Master Certified Coach (MCC) — 1 of <1,000 globally",
      "Former COO, Global Financial Services Firm",
      "Advanced Coaching Diploma, Oxford Said Business School",
    ],
    specializations: ["CEO Advisory", "Executive Transitions", "Board Effectiveness"],
    linkedin: "#",
  },
  {
    name: "Sarah Lindström",
    title: "Head of AI Leadership Practice",
    bio: "Sarah bridges the gap between AI capability and leadership readiness better than anyone in the field. A former VP of AI Strategy at a major technology company, she built our AI Leadership Readiness Framework and leads our fastest-growing practice.",
    credentials: [
      "MS, Computer Science, MIT",
      "Former VP AI Strategy, Fortune 50 Technology Company",
      "Certified Change Management Professional (CCMP)",
    ],
    specializations: ["AI Transformation", "Digital Leadership", "AI Strategy Coaching"],
    linkedin: "#",
  },
  {
    name: "Robert Kimani",
    title: "Head of Succession & Talent Strategy",
    bio: "Robert has spent 18 years designing succession processes for complex, regulated organizations. A former Head of Talent Management at a global financial institution, he specializes in board succession, CEO transition, and leadership continuity architecture.",
    credentials: [
      "MBA, London Business School",
      "NACD Governance Fellow",
      "Former Global Head of Talent, Major Investment Bank",
    ],
    specializations: ["Board Succession", "CEO Transitions", "Leadership Pipeline"],
    linkedin: "#",
  },
  {
    name: "Maya Okafor",
    title: "VP of Client Engagement",
    bio: "Maya came to us from the other side of the table — as Chief Learning Officer of a large healthcare system, she was the buyer of leadership development services. That perspective shapes how we design engagements: practical, measurable, and implementable.",
    credentials: [
      "Former CLO, Major Healthcare System",
      "MA, Organizational Learning, Georgetown",
      "Board Member, Association for Talent Development",
    ],
    specializations: ["Client Strategy", "L&D Architecture", "Healthcare Leadership"],
    linkedin: "#",
  },
  {
    name: "Dr. Thomas Park",
    title: "VP of Platform & Technology",
    bio: "Thomas oversees the leadership development of our Leadership Intelligence Platform. A former product leader at a leading HR technology company with a doctorate in learning science, he ensures our technology is as rigorous as our methodology.",
    credentials: [
      "EdD, Learning Science, Stanford Graduate School of Education",
      "Former VP Product, HR Technology Company",
      "Patents in Adaptive Learning Technology",
    ],
    specializations: ["Platform Strategy", "Learning Technology", "Data & Analytics"],
    linkedin: "#",
  },
]

// ── Advisory board ───────────────────────────────────────────
export const ADVISORY_BOARD = [
  {
    name: "Prof. Christine Lagasse",
    title: "Former Dean, INSEAD Executive Education",
    specialization: "Governance & Global Leadership",
  },
  {
    name: "Raj Mehta",
    title: "Former CHRO, Fortune 50 Technology Company",
    specialization: "AI Talent Strategy & CHRO Advisory",
  },
  {
    name: "Dr. Sandra Osei",
    title: "Chair, Global Leadership Research Consortium",
    specialization: "Leadership Research & Evidence Base",
  },
  {
    name: "General (Ret.) Michael Hargrove",
    title: "Former U.S. Army Chief of Staff",
    specialization: "Leadership Under Pressure & Crisis Leadership",
  },
]
