"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, AlertCircle, Loader2, Clock, Navigation, ExternalLink, ArrowRight, ChevronDown } from "lucide-react";
import { getApiBase } from "@/lib/utils";

function findMatchingEnquiryType(types: string[], query: string): string {
  if (!query || !query.trim() || !types || types.length === 0) return "";
  const qTrim = query.trim();
  const qLower = qTrim.toLowerCase();

  // 1. Exact match (case insensitive, trimmed)
  const exact = types.find((t) => t.trim().toLowerCase() === qLower);
  if (exact) return exact;

  // 2. Normalized match (alphanumeric only)
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const qNorm = norm(qTrim);
  const normalizedMatch = types.find((t) => norm(t) === qNorm);
  if (normalizedMatch) return normalizedMatch;

  // 3. Substring match
  const substringMatch = types.find((t) => {
    const tLower = t.toLowerCase();
    return tLower.includes(qLower) || qLower.includes(tLower);
  });
  if (substringMatch) return substringMatch;

  // 4. Token / Keyword match (e.g. "placement" in "Placement & Student Recruitment" matches "BITC Placement")
  const qWords = qLower.split(/[\s&/_-]+/).filter((w) => w.length >= 4);
  const tokenMatch = types.find((t) => {
    const tLower = t.toLowerCase();
    return qWords.some((word) => tLower.includes(word));
  });
  if (tokenMatch) return tokenMatch;

  return "";
}

function ContactContent() {
  const searchParams = useSearchParams();
  const paramEnquiry = searchParams.get("enquiry") || searchParams.get("type") || searchParams.get("enquiryType") || "";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    enquiryType: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [enquiryTypes, setEnquiryTypes] = useState<string[]>([]);
  const [loadingTypes, setLoadingTypes] = useState<boolean>(true);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoadingTypes(true);
        const res = await fetch(`${getApiBase()}/cms/enquiryTypes`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Deduplicate to guarantee clean list and unique keys from dashboard
            const unique = Array.from(
              new Set(data.map((t: string) => (typeof t === "string" ? t.trim() : "")).filter(Boolean))
            );
            setEnquiryTypes(unique);
          }
        }
      } catch (e) {
        console.error("Failed to fetch dynamic enquiry types from dashboard", e);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    if (enquiryTypes.length === 0) return;

    // 1. Check URL query param first
    let targetQuery = paramEnquiry;

    // 2. If no query param, check document.referrer to auto-detect where user came from
    if (!targetQuery && typeof document !== "undefined" && document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        const path = refUrl.pathname.toLowerCase();
        if (path.includes("/placement")) {
          targetQuery = "BITC Placement";
        } else if (path.includes("/partner")) {
          targetQuery = "Hiring Partners";
        } else if (path.includes("/event")) {
          targetQuery = "Technical Workshop";
        } else if (path.includes("/scholarship")) {
          targetQuery = "Scholarship Application";
        } else if (path.includes("/certificat") || path.includes("/course")) {
          targetQuery = "Certification Inquiry";
        }
      } catch (e) {
        // ignore invalid URL
      }
    }

    if (targetQuery) {
      const matched = findMatchingEnquiryType(enquiryTypes, targetQuery);
      if (matched) {
        setFormData((prev) => ({
          ...prev,
          enquiryType: matched,
        }));
      }

      // Scroll directly to the contact form
      const timer = setTimeout(() => {
        const formEl = document.getElementById("contact-form");
        if (formEl) {
          formEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [paramEnquiry, enquiryTypes]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "fullName":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2) return "Full name must be at least 2 characters.";
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Full name must contain only letters and spaces.";
        return "";

      case "email":
        if (!value.trim()) return "Email Id is required.";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) return "Please enter a valid Email Id (e.g. name@gmail.com).";
        return "";

      case "phone":
        const cleanPhone = value.replace(/[^0-9]/g, "");
        if (!value.trim()) return "Contact number is required.";
        if (cleanPhone.length !== 10) return "Contact number must be exactly 10 digits.";
        if (!/^[6-9]\d{9}$/.test(cleanPhone)) return "Contact number must start with 6, 7, 8, or 9.";
        return "";

      case "city":
        if (!value.trim()) return "City is required.";
        if (value.trim().length < 2) return "City name must be at least 2 characters.";
        return "";

      case "enquiryType":
        if (!value.trim()) return "Please select an enquiry type.";
        return "";

      case "message":
        if (!value.trim()) return "Your message is required.";
        if (value.trim().length < 5) return "Your message must be at least 5 characters long.";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (field: string, value: any) => {
    let processedValue = typeof value === "string" ? value : String(value ?? "");

    if (field === "phone") {
      processedValue = processedValue.replace(/[^0-9]/g, "").slice(0, 10);
    }

    setErrorMessage(null);
    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    if (fieldErrors[field]) {
      const err = validateField(field, processedValue);
      setFieldErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field: string) => {
    const value = (formData as any)[field] || "";
    const err = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, (formData as any)[key]);
      if (err) errors[key] = err;
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setErrorMessage("Please correct the highlighted errors in the form before submitting.");
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    try {
      let success = false;
      let errorMsg = "";

      // 1. Submit directly to Central Backend API (primary store)
      try {
        const apiBase = getApiBase();
        const contactEndpoint = apiBase.endsWith("/contact")
          ? apiBase
          : `${apiBase.replace(/\/$/, "")}/contact`;
        const res = await fetch(contactEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          success = true;
        } else {
          const d = await res.json().catch(() => ({}));
          errorMsg = d.error || "";
        }
      } catch (apiErr) {
        console.warn("Direct contact API notice:", apiErr);
      }

      // 2. Fallback to local Next.js route ONLY IF backend failed
      if (!success) {
        try {
          const localRes = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (localRes.ok) {
            success = true;
          } else {
            const d = await localRes.json().catch(() => ({}));
            errorMsg = d.error || errorMsg;
          }
        } catch (localErr) {
          console.warn("Local contact API notice:", localErr);
        }
      }

      if (success) {
        setSubmitted(true);
      } else {
        throw new Error(errorMsg || "Failed to send message. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative overflow-x-hidden bg-white min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative flex w-full items-center justify-center overflow-hidden bg-white px-4 py-6 sm:min-h-[calc(100vh-80px)] sm:px-6 sm:py-16 lg:min-h-[calc(100vh-85px)] lg:py-20">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col-reverse items-center gap-6 sm:gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col justify-center text-center lg:w-[46%] lg:flex-none lg:text-left animate-in fade-in slide-in-from-left-8 duration-700">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.2]">
              <span>Get in Touch with <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">BITC</span></span>
              <br />
              <span>We're Here to Help.</span>
            </h1>
            <p className="mt-4 max-w-xl mx-auto lg:mx-0 text-sm leading-relaxed text-[#666] sm:mt-5 sm:text-base lg:text-lg">
              Whether you have a question about our certifications, need career guidance, or want to explore partnership opportunities — our team is ready to assist you.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5 sm:mt-7 sm:gap-3 lg:justify-start animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[300ms] fill-mode-both">
              <a href="https://wa.me/918956727311?text=Hello%2C%20I%20want%20to%20get%20in%20touch%20with%20BITC" target="_blank" rel="noreferrer" className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-[#111827] shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 sm:px-6 sm:py-3">
                <svg viewBox="0 0 32 32" width="18" height="18" fill="#25D366" aria-hidden="true" className="shrink-0">
                  <path d="M16.001 3C9.007 3 3 9.007 3 16.001c0 2.813.92 5.412 2.482 7.512L3.5 29l5.653-1.955A12.94 12.94 0 0 0 16 29c6.994 0 13-6.006 13-13S22.995 3 16.001 3zm0 23.6a10.55 10.55 0 0 1-5.4-1.5l-.387-.23-3.354 1.16 1.128-3.267-.253-.4A10.56 10.56 0 1 1 26.6 16c0 5.85-4.75 10.6-10.599 10.6zm5.79-7.94c-.318-.159-1.884-.93-2.176-1.037-.292-.107-.505-.159-.717.16-.212.318-.823 1.036-1.009 1.249-.186.212-.372.24-.69.08-.318-.159-1.343-.495-2.558-1.577-.945-.843-1.583-1.884-1.769-2.203-.186-.318-.02-.49.139-.649.143-.142.318-.372.478-.557.16-.186.212-.318.318-.53.106-.212.053-.398-.026-.557-.08-.16-.717-1.729-.983-2.368-.259-.622-.523-.538-.717-.548l-.611-.011c-.212 0-.557.08-.849.398-.292.318-1.113 1.089-1.113 2.657 0 1.567 1.14 3.083 1.299 3.295.159.212 2.245 3.43 5.44 4.81.76.328 1.353.524 1.815.671.762.243 1.457.209 2.006.127.612-.091 1.884-.771 2.15-1.516.265-.744.265-1.383.186-1.516-.08-.132-.292-.212-.61-.371z"></path>
                </svg> Chat with us
              </a>
              <a href="tel:+918956727311" className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-[#111827] shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 sm:px-6 sm:py-3">
                <Phone className="w-[15px] h-[15px] text-[#f97316]" /> Call us
              </a>
              <a href="mailto:info@bizonance.in" className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-[#111827] shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 sm:px-6 sm:py-3">
                <Mail className="w-[15px] h-[15px] text-[#2f55d4]" /> Email us
              </a>
            </div>
          </div>
          <div className="relative w-full shrink-0 lg:w-[52%] animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
            <div className="relative aspect-[4/3] w-full max-h-[520px] lg:max-h-[640px]">
              <Image src="/contact1.png" alt="BITC contact support" fill sizes="(max-width: 1024px) 100vw, 800px" className="object-contain object-center" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Form & Cards Section */}
      <section id="contact-form" className="bg-white px-4 py-8 sm:px-6 sm:py-16 border-t border-slate-100 scroll-mt-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-[1.2]">Contact <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Us</span></h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-[#666] sm:text-base">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>
          </div>

          <div className="flex flex-col gap-5 sm:gap-8 lg:flex-row lg:items-start">

            {/* Left: Contact Cards (Shown below form on mobile, on left on desktop) */}
            <div className="flex h-full flex-col gap-3 sm:gap-4 lg:w-[360px] shrink-0 order-2 lg:order-1">

              <div className="flex items-start gap-3.5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-md sm:gap-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[100ms]">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-md border border-gray-100/80 sm:h-12 sm:w-12 p-2.5 sm:p-2.5">
                  <Image src="/icons/map.png" alt="Corporate Office" width={48} height={48} className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold text-[#888]">Corporate Office</p>
                  <p className="text-sm leading-relaxed font-semibold text-[#111]">BIZONANCE Industrial Training Centre</p>
                  <p className="text-sm leading-relaxed text-[#555]">Near Delhi Public School, Ravi Kiran Colony, Saturna, Amravati MH 444605</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=BIZONANCE+INDIA+PVT.+LTD.+Near+Delhi+Public+School+Saturna+Amravati" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-orange-50 border border-orange-200/80 px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-100 transition-colors">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-md sm:gap-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[180ms]">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-md border border-gray-100/80 sm:h-12 sm:w-12 p-2.5 sm:p-2.5">
                  <Image src="/icons/call.png" alt="Learner Support" width={48} height={48} className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold text-[#888]">Learner's Support</p>
                  <p className="text-sm leading-relaxed font-semibold text-[#111]">+91 89567 27311</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-md sm:gap-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[260ms]">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-md border border-gray-100/80 sm:h-12 sm:w-12 p-2.5 sm:p-2.5">
                  <Image src="/icons/Mail.png" alt="Official Email" width={48} height={48} className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold text-[#888]">Official Email</p>
                  <p className="text-sm leading-relaxed font-semibold text-[#111]">info@bizonance.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-md sm:gap-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[340ms]">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-md border border-gray-100/80 sm:h-12 sm:w-12 p-1 sm:p-1.5">
                  <Image src="/icons/clock.png" alt="Working Hours" width={48} height={48} className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold text-[#888]">Working Hours</p>
                  <p className="text-sm leading-relaxed font-semibold text-[#111]">Mon – Sat: 10:00 AM – 7:00 PM</p>
                  <div className="mt-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 border border-red-200/80 px-2.5 py-0.5 text-xs font-bold text-red-600 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      Sunday: Closed
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[500ms]">
                <p className="text-xs font-bold text-orange-600">Company info</p>
                <p className="mt-2 text-sm font-semibold text-[#111]">BIZONANCE INDIA PRIVATE LIMITED</p>
                <p className="mt-1 text-xs text-[#777]">CIN: U74999MH2017PTC301018</p>
                <p className="text-xs text-[#777]">Registered Trademark · IP India</p>
              </div>

            </div>

            {/* Right: Contact Form (Shown first on mobile, on right on desktop) */}
            <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 order-1 lg:order-2">
              {submitted ? (
                <div className="rounded-2xl border border-gray-200/80 bg-white p-8 sm:p-12 shadow-xl shadow-slate-200/60 flex flex-col items-center justify-center text-center min-h-[400px]">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-600 mb-3">Message Sent Successfully!</h3>
                  <p className="text-slate-600 mb-8 max-w-md">
                    Thank you for reaching out. Our team has received your message and will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ fullName: "", email: "", phone: "", city: "", enquiryType: "", message: "" });
                    }}
                    className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xl shadow-slate-200/60 sm:rounded-3xl sm:p-8 space-y-5">

                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-600">Name <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${fieldErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      onBlur={() => handleBlur("fullName")}
                    />
                    {fieldErrors.fullName && <p className="text-xs text-red-500 font-medium">{fieldErrors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-slate-600">Email Id <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="email"
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                      />
                      {fieldErrors.email && <p className="text-xs text-red-500 font-medium">{fieldErrors.email}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-slate-600">Contact Number <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {fieldErrors.phone ? (
                          <p className="text-xs text-red-500 font-medium">{fieldErrors.phone}</p>
                        ) : <span></span>}
                        <span className="text-[11px] text-[#999] shrink-0 ml-auto">{formData.phone.length}/10 digits</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-600">City <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${fieldErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      onBlur={() => handleBlur("city")}
                    />
                    {fieldErrors.city && <p className="text-xs text-red-500 font-medium">{fieldErrors.city}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-600">Enquiry Type <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        required
                        className={`w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${
                          formData.enquiryType === "" ? 'text-gray-400' : 'text-slate-800 font-medium'
                        } ${fieldErrors.enquiryType ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 focus:bg-white'}`}
                        value={formData.enquiryType}
                        onChange={(e) => handleChange("enquiryType", e.target.value)}
                        onBlur={() => handleBlur("enquiryType")}
                      >
                        <option value="" disabled className="text-gray-400">{loadingTypes ? "Loading enquiry types..." : "Select enquiry type"}</option>
                        {enquiryTypes.map((type, idx) => (
                          <option key={`${type}-${idx}`} value={type} className="text-slate-800">{type}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {fieldErrors.enquiryType && <p className="text-xs text-red-500 font-medium">{fieldErrors.enquiryType}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-600">Your Message <span className="text-red-500">*</span></label>
                      <span className="text-[11px] font-medium text-[#999]">{formData.message.length} chars</span>
                    </div>
                    <textarea
                      required
                      rows={4}
                      className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${fieldErrors.message ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      onBlur={() => handleBlur("message")}
                    ></textarea>
                    {fieldErrors.message && <p className="text-xs text-red-500 font-medium">{fieldErrors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full h-10 items-center justify-center gap-2 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 text-sm font-normal hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
