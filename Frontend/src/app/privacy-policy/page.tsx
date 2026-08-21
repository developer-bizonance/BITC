import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Privacy Policy of BIZONANCE Industrial Training Centre (BITC).",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
        </div>
        
        <p className="text-sm text-slate-500 mb-8">Last updated: August 2026</p>
        
        <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <p>
            At <strong>BIZONANCE Industrial Training Centre (BITC)</strong>, accessible from bitc-eight.vercel.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by BITC and how we use it.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 pt-4">Information We Collect</h2>
          <p>
            When you register for a course, submit an application form, or contact us, we may collect personal information including your name, email address, phone number, qualification details, and course interest.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 pt-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process course applications and enrollment.</li>
            <li>To provide, operate, and maintain our educational services.</li>
            <li>To communicate with you regarding classes, schedules, and placement opportunities.</li>
            <li>To send updates, newsletters, and promotional materials.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 pt-4">Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:info@bizonance.in" className="text-primary font-medium hover:underline">info@bizonance.in</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
