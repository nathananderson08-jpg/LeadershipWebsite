import type { Metadata } from "next"
import { IndustryPageTemplate } from "@/components/sections/IndustryPageTemplate"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Retail & Consumer Goods Leadership Development | ${FIRM_NAME}`,
  description: "Leadership development for retail and consumer goods companies. Frontline leadership, store management, and executive development for high-volume people organizations.",
}

export default function RetailPage() {
  return (
    <IndustryPageTemplate
      industryName="Retail & Consumer Goods"
      heroTitle="Leadership at the speed of the customer."
      heroSubtitle="Retail and consumer goods companies manage enormous workforces, face relentless competitive pressure, and operate on thin margins. Leadership at every level — from store manager to CEO — is the primary driver of customer experience and business performance."
      challenges={[
        { title: "Frontline Leadership at Scale", desc: "The largest driver of customer experience in any retail operation is the quality of its frontline managers. Developing thousands of store managers and department leads consistently is one of retail's hardest leadership challenges." },
        { title: "Omnichannel Transformation", desc: "The shift from brick-and-mortar to omnichannel requires leaders who can redesign operations, retrain workforces, and reimagine the customer experience — all simultaneously." },
        { title: "High-Turnover Culture", desc: "Retail organizations with high turnover face a compounding leadership problem: the managers who develop high performers don't stay long enough to build institutional knowledge or culture continuity." },
        { title: "Brand Culture at the Point of Sale", desc: "The consumer promise made at the brand level must be delivered at the individual interaction level. Creating that alignment requires leadership development that runs from headquarters to the shop floor." },
      ]}
      lifecycleApplication={[
        { phase: "01 Assess", detail: "Store manager effectiveness assessments, regional leadership audits, and organizational health diagnostics that identify where culture and performance gaps are largest." },
        { phase: "02 Coach", detail: "Executive coaching for retail C-suite navigating transformation; group coaching for district and regional managers; transition coaching for high-potential store managers moving into corporate roles." },
        { phase: "03 Develop", detail: "Frontline manager development programs designed for high-volume deployment, regional leader academies, and brand ambassador leadership curricula that connect culture to performance." },
        { phase: "04 Transform", detail: "Culture alignment for omnichannel organizations, change management for major operational pivots, and team effectiveness programs for headquarters functions." },
        { phase: "05 Sustain", detail: "High-potential identification across the store network, leadership pipeline mapping, and succession planning for district, regional, and executive roles." },
      ]}
      insights={[
        { title: "The Frontline Leadership Multiplier: Why Store Managers Matter More Than You Think", category: "Retail" },
        { title: "Omnichannel Needs a New Kind of Retail Leader", category: "Retail" },
        { title: "Building Culture When 40% of Your Workforce Turns Over Each Year", category: "Retail" },
      ]}
      keyword="retail"
    />
  )
}
