"use client";

import { useState } from "react";

interface ConsultationFormProps {
  theme?: "light" | "dark";
}

export default function ConsultationForm({ theme = "light" }: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "Course Selection",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.topic,
          enquiryType: "Student Consulting",
          courseSlug: "consultation",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", topic: "Course Selection" });
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  const isDark = theme === "dark";
  const labelClass = `block text-sm font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`;
  const inputClass = `w-full rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
    isDark 
      ? "bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500" 
      : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400"
  }`;

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Request Received!</h3>
        <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          Thank you for reaching out. Our career counselors will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
      <div>
        <label className={labelClass}>Full Name</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className={inputClass}
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <label className={labelClass}>Email Address</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={inputClass}
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className={labelClass}>Phone Number</label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className={inputClass}
          placeholder="Enter your phone number"
        />
      </div>


      {status === "error" && <p className="text-red-500 text-sm font-medium">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-12 md:h-14 mt-2 rounded-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-900 text-base font-medium hover:opacity-90 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Submitting..." : "Book Consultation"}
      </button>
    </form>
  );
}
