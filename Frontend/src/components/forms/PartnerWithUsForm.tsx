"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function PartnerWithUsForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      if (onSuccess) {
        setTimeout(onSuccess, 3000); // optional auto-close
      }
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 md:p-12 text-center h-full flex flex-col justify-center items-center rounded-2xl">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Request Received!</h3>
        <p className="text-slate-600 mb-8 max-w-sm mx-auto">
          Thank you for your interest in partnering with BITC. Our corporate relations team will reach out to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 relative overflow-hidden rounded-2xl">
      <div className="mb-6 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Partner <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">With Us</span></h3>
        <p className="text-slate-600 text-sm">Join our network to hire talent, train your workforce, or collaborate on tech.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-slate-700">Company Name</label>
            <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" />
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-slate-700">Company Website</label>
            <input required type="url" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-slate-700">Contact Person</label>
            <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" />
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-slate-700">Designation / Job Title</label>
            <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input required type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" />
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
            <input required type="tel" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" />
          </div>
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-slate-700">Partnership Type</label>
          <select required defaultValue="" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer">
            <option value="" disabled>Select Partnership Type</option>
            <option value="Campus Hiring">Campus Hiring</option>
            <option value="Corporate Training">Corporate Training</option>
            <option value="Live Projects Collaboration">Live Projects Collaboration</option>
            <option value="Workshops & Guest Lectures">Workshops & Guest Lectures</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-slate-700">Message</label>
          <textarea required rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"></textarea>
        </div>

        <button type="submit" className="w-full h-12 rounded-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white text-[15px] font-medium flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all mt-2">
          Submit Details <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
