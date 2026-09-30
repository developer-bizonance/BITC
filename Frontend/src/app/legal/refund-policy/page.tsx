import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Read the Refund Policy of BIZONANCE Industrial Training Centre (BITC).",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Refund <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Policy</span></h1>
        </div>
        
        <p className="text-sm text-slate-500 mb-8">Last updated: August 2026</p>
        
        <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <p>
            At <strong>BIZONANCE Industrial Training Centre (BITC)</strong>, we strive to ensure that our students receive the highest quality of education and training. We want you to be completely satisfied with your certification programs. However, we understand that situations may arise where you need to request a refund. This Refund Policy outlines the terms and conditions under which refunds are provided.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 pt-4">Eligibility for <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Refunds</span></h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cancellation within 7 Days:</strong> If you enroll in a certification program and choose to cancel your enrollment within 7 days of payment (and before the commencement of the batch), you are eligible for a full refund, minus any administrative or transaction fees.</li>
            <li><strong>Batch Cancellation by BITC:</strong> If BIZONANCE cancels a batch or certification program for any reason, all enrolled students will receive a 100% full refund without any deductions.</li>
            <li><strong>After Batch Commencement:</strong> Once the batch has commenced and classes have started, fees are strictly non-refundable under any circumstances.</li>
          </ul>
          
          <h2 className="text-xl font-bold text-slate-900 pt-4">Refund <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Process</span></h2>
          <p>
            To request a refund, please send a formal email to our support team at <a href="mailto:info@bizonance.in" className="text-primary font-medium hover:underline">info@bizonance.in</a> with your full name, enrollment details, and the reason for your refund request. 
          </p>
          <p>
            Once your refund request is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed and automatically credited back to your original method of payment within 7-14 business days.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 pt-4">Non-Refundable <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Fees</span></h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Registration fees or seat booking fees (if explicitly stated as non-refundable).</li>
            <li>Payment gateway transaction charges.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 pt-4">Contact <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Us</span></h2>
          <p>
            If you have any questions or concerns regarding our Refund Policy, please do not hesitate to contact our admissions desk at <a href="mailto:info@bizonance.in" className="text-primary font-medium hover:underline">info@bizonance.in</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
