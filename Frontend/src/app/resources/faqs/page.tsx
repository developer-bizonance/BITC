import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
  description: "Find answers to common questions about BITC courses, admission criteria, placement assistance, fees, scholarships, and class schedules.",
  openGraph: {
    title: "Frequently Asked Questions (FAQs) | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Got questions? Find answers about admissions, placement assistance, course duration, and certification.",
  },
};
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default async function FAQsPage() {
  let faqs: {q: string; a: string}[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://bitc-backend-theta.vercel.app/api"}/faq`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.items) {
        faqs = data.items.map((item: any) => ({ q: item.question, a: item.answer }));
      }
    }
  } catch (error) {
    console.warn("Failed to fetch FAQs from backend API.");
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="bg-white py-16 text-slate-900 text-center border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4">
          <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">Frequently Asked <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Questions</span></h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Find answers to common questions about our courses, placements, and admission process.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-[800px] mx-auto px-4">
          <Accordion className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-200">
                <AccordionTrigger className="text-left text-base font-bold text-slate-900 py-6 hover:text-primary hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-6 text-[15px]">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Pre-footer CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-blue-50/30 text-slate-900 border-t border-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[800px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Still Have Questions?</h2>
          <p className="text-slate-600 mb-8 text-lg font-medium">Our team is available to help clarify any doubts regarding programs, fees, or placements.</p>
          <Link href="/contact" className="inline-flex h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-bold items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-lg gap-2">
            Contact Support <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
