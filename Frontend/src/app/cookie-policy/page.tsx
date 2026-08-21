import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Read the Cookie Policy of BIZONANCE Industrial Training Centre (BITC).",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <Cookie className="w-8 h-8 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Cookie Policy</h1>
        </div>
        
        <p className="text-sm text-slate-500 mb-8">Last updated: August 2026</p>
        
        <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <p>
            This is the Cookie Policy for <strong>BIZONANCE Industrial Training Centre (BITC)</strong>.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 pt-4">What Are Cookies</h2>
          <p>
            As is common practice with almost all professional websites, this site uses cookies, which are tiny files downloaded to your computer, to improve your browsing experience.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 pt-4">How We Use Cookies</h2>
          <p>
            We use cookies for essential session management, analytics to understand visitor preferences, and performance optimizations.
          </p>

          <h2 className="text-xl font-bold text-slate-900 pt-4">Contact</h2>
          <p>
            If you have questions about our cookie policy, email <a href="mailto:info@bizonance.in" className="text-primary font-medium hover:underline">info@bizonance.in</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
