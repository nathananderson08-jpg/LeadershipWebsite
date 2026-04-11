import type { Metadata } from "next"
import { FIRM_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Terms of Service | ${FIRM_NAME}`,
}

export default function TermsPage() {
  return (
    <div className="pt-40 pb-20" style={{ background: "white" }}>
      <div className="container-content max-w-3xl">
        <h1 className="display-md text-navy-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: January 1, 2025</p>
        <div className="space-y-8 text-neutral-700 leading-relaxed">
          {[
            { heading: "Acceptance of Terms", body: "By accessing and using our website and services, you accept and agree to be bound by the terms and conditions outlined in this agreement." },
            { heading: "Use of Services", body: "Our services are intended for business use. You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that could damage, disable, or impair our services." },
            { heading: "Intellectual Property", body: "All content on our website, including but not limited to text, graphics, logos, and methodologies, is our property and protected by applicable intellectual property laws." },
            { heading: "Limitation of Liability", body: "To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services." },
            { heading: "Governing Law", body: "These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions." },
            { heading: "Changes to Terms", body: "We reserve the right to modify these Terms at any time. We will notify you of significant changes by posting a notice on our website or sending you an email." },
          ].map((section) => (
            <div key={section.heading}>
              <h2 className="font-700 text-navy-900 text-xl mb-3" style={{ fontWeight: 700 }}>{section.heading}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
