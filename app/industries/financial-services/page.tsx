import type { Metadata } from "next"
import { IndustryPageTemplate } from "@/components/sections/IndustryPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Financial Services Leadership Development | ${FIRM_NAME}`,
  description: "End-to-end leadership development for financial services. Assessment, coaching, programs, and succession planning tailored to banking, asset management, and fintech.",
}

export default function FinancialServicesPage() {
  return (
    <IndustryPageTemplate
      industryName="Financial Services"
      heroTitle="Leadership built for regulation, risk, and reinvention."
      heroSubtitle="Financial services leaders navigate one of the most complex leadership environments in the world — regulatory pressure, talent competition, digital transformation, and AI disruption — simultaneously."
      challenges={[
        { title: "Regulatory & Risk Complexity", desc: "Leaders must balance regulatory compliance with commercial agility — a uniquely demanding leadership skill set that requires both judgment and decisiveness." },
        { title: "Talent Competition", desc: "The war for talent in financial services has never been more intense. Leadership development is a retention and attraction strategy, not just a leadership development strategy." },
        { title: "Digital & AI Transformation", desc: "From algorithmic trading to AI underwriting, financial services leaders must be technically literate enough to lead digital transformation — not just sponsor it." },
        { title: "Culture & Conduct Risk", desc: "Post-2008 regulatory focus on culture has made leadership behavior a compliance issue. Firms need leaders who model the right culture — because the regulator is watching." },
      ]}
      lifecycleApplication={[
        { phase: "01 Assess", detail: "Leadership audits calibrated to regulatory standards, conduct risk assessments, and succession diagnostics for senior roles requiring regulatory approval." },
        { phase: "02 Coach", detail: "Coaching for senior bankers navigating regulatory scrutiny, major transactions, and the human dimensions of leading through financial cycles." },
        { phase: "03 Develop", detail: "Programs covering risk culture leadership, regulatory fluency for leaders, and AI literacy for financial services executives." },
        { phase: "04 Transform", detail: "Culture transformation for conduct risk, post-merger integration, and digital transformation change management in complex, regulated environments." },
        { phase: "05 Sustain", detail: "Succession planning for regulated senior functions (SMF holders, NEDs), with governance frameworks for board-level oversight." },
      ]}
      insights={[
        { title: "Conduct Risk Starts at the Top: What Regulators Actually Want from Leaders", category: "Financial Services" },
        { title: "How AI Is Changing What Good Leadership Looks Like in Banking", category: "AI & Leadership" },
        { title: "Building a Talent Pipeline in a Sellers' Market for Financial Services Leaders", category: "Succession" },
      ]}
      keyword="financial services leadership development"
    />
  )
}
