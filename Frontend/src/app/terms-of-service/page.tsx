import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service for BIZONANCE Industrial Training Centre (BITC).",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Terms of Service</h1>
        </div>
        
        <p className="text-sm text-slate-500 mb-8">Last updated: August 2026</p>
        
        <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <p>
            Welcome to <strong>BIZONANCE Industrial Training Centre (BITC)</strong>! These terms and conditions outline the rules and regulations for the use of BITC&apos;s Website and training programs.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 pt-4">User Responsibilities</h2>
          <p>
            By accessing this website and enrolling in our programs, we assume you accept these terms and conditions. Do not continue to use BITC if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 pt-4">Intellectual Property</h2>
          <p>
            Unless otherwise stated, BITC and/or its licensors own the intellectual property rights for all material on BITC. All intellectual property rights are reserved.
          </p>

          <h2 className="text-xl font-bold text-slate-900 pt-4">Contact Information</h2>
          <p>
            For any queries regarding our terms, please email us at <a href="mailto:info@bizonance.in" className="text-primary font-medium hover:underline">info@bizonance.in</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
