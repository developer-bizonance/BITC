"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";

export function PartnerWithUsForm({ onSuccess, type = "corporate" }: { onSuccess?: () => void; type?: "educational" | "corporate" }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      organizationName: { value: string };
      website: { value: string };
      contactPerson: { value: string };
      designation: { value: string };
      email: { value: string };
      phone: { value: string };
      partnershipType: { value: string };
      message: { value: string };
    };

    try {
      const res = await fetch("/api/partnership-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: type,
          organizationName: target.organizationName.value,
          website: target.website.value,
          contactPerson: target.contactPerson.value,
          designation: target.designation.value,
          email: target.email.value,
          phone: target.phone.value,
          partnershipType: target.partnershipType.value,
          message: target.message.value,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        if (onSuccess) {
          setTimeout(onSuccess, 3000);
        }
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit form. Please try again.");
    }
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
    <div className="bg-white p-5 md:p-6 relative overflow-hidden rounded-2xl">
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-1">Partner <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">With Us</span></h3>
        <p className="text-slate-600 text-xs md:text-sm">Join our network to hire talent, train your workforce, or collaborate on tech.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">
              {type === "educational" ? "Institution / College Name" : "Company Name"}
            </label>
            <input required name="organizationName" type="text" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm" />
          </div>
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">
              {type === "educational" ? "Institution Website" : "Company Website"}
            </label>
            <input required name="website" type="url" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Contact Person</label>
            <input required name="contactPerson" type="text" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm" />
          </div>
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Designation / Job Title</label>
            <input required name="designation" type="text" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <input required name="email" type="email" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm" />
          </div>
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Phone Number</label>
            <input required name="phone" type="tel" pattern="[0-9]{10}" minLength={10} maxLength={10} title="Please enter a valid 10-digit phone number" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm" />
          </div>
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-slate-700">Partnership Type</label>
          <div className="relative">
            <select required name="partnershipType" defaultValue="" className="w-full px-3 py-2 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer text-sm">
              <option value="" disabled>Select Partnership Type</option>
              <option value="Campus Hiring">Campus Hiring</option>
              <option value="Corporate Training">Corporate Training</option>
              <option value="Live Projects Collaboration">Live Projects Collaboration</option>
              <option value="Workshops & Guest Lectures">Workshops & Guest Lectures</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-slate-700">Message</label>
          <textarea required name="message" rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none text-sm"></textarea>
        </div>

        <button type="submit" className="w-full h-11 rounded-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white text-[15px] font-medium flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all mt-1">
          Submit Details <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
