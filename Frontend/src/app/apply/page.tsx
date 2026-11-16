"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getApiBase } from "@/lib/utils";
import DocumentUpload from "@/components/ui/DocumentUpload";
import {
  Briefcase,
  GraduationCap,
  Send,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Check,
  Calendar,
  Paperclip,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
interface ApplyFormProps {
  title?: React.ReactNode;
  subtitle?: string;
  defaultRole?: string;
  onClose?: () => void;
}

const defaultDomains = [
  "Industry Experts",
  "Technical Consultants",
  "Corporate Trainers",
];

export function ApplyFormContent({ title, subtitle, defaultRole, onClose }: ApplyFormProps = {}) {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || defaultRole || "Industry Expert & Mentor";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: searchParams.get("role") || defaultRole || "Industry Expert & Mentor",
    subjectCourse: "",
    otherSubjectCourse: "",
    experience: "",
    qualification: "",
    otherQualification: "",
    dateToJoin: "",
    joinQuickOption: "",
    currentOrg: "",
    resumeUrl: "",
    linkedinUrl: "",
    coverNote: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<{ name: string; size: string; data: string } | null>(null);
  const [domainOptions, setDomainOptions] = useState<string[]>(defaultDomains);

  useEffect(() => {
    let isMounted = true;
    async function loadDynamicDomains() {
      try {
        const res = await fetch(`${getApiBase()}/mentor-categories`);
        if (res.ok) {
          const data = await res.json();
          if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
            const list = data.categories
              .map((c: any) => (typeof c === "string" ? c : c.name)?.trim())
              .filter(Boolean);
            if (isMounted && list.length > 0) {
              setDomainOptions(list);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic mentor domains, using fallback defaults:", err);
      }
    }
    loadDynamicDomains();
    return () => {
      isMounted = false;
    };
  }, []);

  // Field validator
  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "fullName") {
      if (!value.trim()) {
        error = "Full Name is required.";
      } else if (value.trim().length < 3) {
        error = "Name must be at least 3 characters.";
      }
    } else if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!value.trim()) {
        error = "Email Id is required.";
      } else if (!emailRegex.test(value.trim())) {
        error = "Please enter a valid Email Id (e.g. name@example.com).";
      }
    } else if (name === "phone") {
      const cleanPhone = value.replace(/\D/g, "");
      if (!cleanPhone) {
        error = "Contact number is required.";
      } else if (cleanPhone.length < 10) {
        error = `Please enter full 10-digit number (${cleanPhone.length}/10).`;
      } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        error = "Contact number must start with 6, 7, 8, or 9.";
      }
    } else if (name === "otherSubjectCourse") {
      if (form.subjectCourse === "Other" && !value.trim()) {
        error = "Please specify your domain.";
      }
    } else if (name === "subjectCourse") {
      if (!value) {
        error = "Please select a working domain.";
      }
    } else if (name === "dateToJoin") {
      if (form.joinQuickOption === "Custom Date" && !value) {
        error = "Please select your expected joining date.";
      }
    }
    return error;
  };

  // Run validation across all fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const fnErr = validateField("fullName", form.fullName);
    if (fnErr) newErrors.fullName = fnErr;

    const emErr = validateField("email", form.email);
    if (emErr) newErrors.email = emErr;

    const phErr = validateField("phone", form.phone);
    if (phErr) newErrors.phone = phErr;

    const scErr = validateField("subjectCourse", form.subjectCourse);
    if (scErr) newErrors.subjectCourse = scErr;

    if (form.subjectCourse === "Other") {
      const oscErr = validateField("otherSubjectCourse", form.otherSubjectCourse);
      if (oscErr) newErrors.otherSubjectCourse = oscErr;
    }

    if (form.joinQuickOption === "Custom Date") {
      const dtErr = validateField("dateToJoin", form.dateToJoin);
      if (dtErr) newErrors.dateToJoin = dtErr;
    }

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      subjectCourse: true,
      otherSubjectCourse: true,
      dateToJoin: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, (form as any)[field] || "");
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[field] = error;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleChange = (field: string, value: string) => {
    let sanitized = value;
    if (field === "phone") {
      // Strictly allow only numbers and maximum 10 digits
      sanitized = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((prev) => ({ ...prev, [field]: sanitized }));
    if (touched[field]) {
      const error = validateField(field, sanitized);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) {
          next[field] = error;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  // Handle File Upload
  const handleFileSelect = (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: "File size exceeds 5MB limit. Please upload a smaller file." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setResumeFile({
        name: file.name,
        size: sizeStr,
        data: reader.result as string,
      });

      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr.resume;
        return newErr;
      });
    };
    reader.readAsDataURL(file);
  };

  const removeResumeFile = () => {
    setResumeFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitError("Please fill out all required fields with valid information.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const finalDateToJoin = form.joinQuickOption === "Custom Date" ? form.dateToJoin : (form.joinQuickOption || form.dateToJoin || "");
    const finalCourse = form.subjectCourse === "Other" && form.otherSubjectCourse?.trim()
      ? form.otherSubjectCourse.trim()
      : (form.subjectCourse?.trim() || "");
    const finalPosition = form.position || defaultRole || "Industry Expert & Mentor";

    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        position: finalPosition,
        subjectCourse: finalCourse,
        experience: form.experience ? form.experience.trim() : "",
        qualification: form.qualification ? form.qualification.trim() : "",
        otherQualification: form.otherQualification ? form.otherQualification.trim() : "",
        dateToJoin: finalDateToJoin ? finalDateToJoin.trim() : "",
        currentOrg: form.currentOrg ? form.currentOrg.trim() : "",
        resumeUrl: resumeFile ? resumeFile.data : form.resumeUrl.trim(),
        resumeFileName: resumeFile ? resumeFile.name : "",
        linkedinUrl: form.linkedinUrl.trim(),
        coverNote: form.coverNote.trim(),
      };

      let success = false;
      let errorMsg = "";

      // 1. Direct submit to Central Backend API (primary database)
      try {
        const apiBase = getApiBase();
        const apiRes = await fetch(`${apiBase}/careers/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (apiRes.ok) {
          success = true;
        } else {
          const d = await apiRes.json().catch(() => ({}));
          errorMsg = d.error || "";
        }
      } catch (apiErr) {
        console.warn("Direct API apply notice:", apiErr);
      }

      // 2. Dual-submit fallback to local Next.js route ONLY IF backend failed
      if (!success) {
        try {
          const localRes = await fetch("/api/careers/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (localRes.ok) {
            success = true;
          } else {
            const d = await localRes.json().catch(() => ({}));
            errorMsg = d.error || errorMsg;
          }
        } catch (localErr) {
          console.warn("Local apply notice:", localErr);
        }
      }

      if (success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(errorMsg || "Failed to submit application. Please try again.");
      }
    } catch (err) {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {submitSuccess ? (
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Check className="w-10 h-10" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium mb-3">
            Application Submitted
          </span>
          {(() => {
            const selectedDomain =
              form.subjectCourse === "Other" && form.otherSubjectCourse?.trim()
                ? form.otherSubjectCourse.trim()
                : (form.subjectCourse?.trim() || form.position || "Certification Program");

            return (
              <>
                <p className="text-slate-600 max-w-lg mx-auto mb-6 text-base leading-relaxed">
                  Thank you, <strong className="text-slate-900">{form.fullName}</strong>. Your application to teach{" "}
                  <strong className="text-primary">{selectedDomain}</strong> has been successfully submitted to our Academic Board.
                </p>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 max-w-md mx-auto mb-2 text-left space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-800">Certification Domain:</span>
                    <span className="font-semibold text-slate-900">{selectedDomain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-800">Contact Email:</span>
                    <span>{form.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-800">Next Step:</span>
                    <span className="text-primary font-bold">HR Review</span>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-5 md:p-6 pb-2 text-center bg-white">
            <h3 className="text-2xl font-medium text-gray-600 mb-1">
              {title || (
                <>
                  Apply <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">as Mentor</span>
                </>
              )}
            </h3>
            <p className="text-slate-600 text-xs md:text-sm">
              {subtitle || "Join our network to train talent, share knowledge, or collaborate on tech."}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-5 md:px-8 pb-8 pt-2 space-y-3 bg-white">
            {submitError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Candidate Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-600">Name</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  onBlur={() => handleBlur("fullName")}
                  className={`w-full px-3 py-2 rounded-xl border ${touched.fullName && errors.fullName
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200 bg-slate-50"
                    } focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800`}
                />
                {touched.fullName && errors.fullName && (
                  <p className="text-red-500 text-[10px] ml-1">{errors.fullName}</p>
                )}
              </div>
              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-600">Email Id</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full px-3 py-2 rounded-xl border ${touched.email && errors.email
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200 bg-slate-50"
                    } focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800`}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-[10px] ml-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Mobile & Applying Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-600">Contact Number</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={`w-full px-3 py-2 rounded-xl border ${touched.phone && errors.phone
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200 bg-slate-50"
                    } focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800`}
                />
                {touched.phone && errors.phone && (
                  <p className="text-red-500 text-[10px] ml-1">{errors.phone}</p>
                )}
              </div>
              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-600">Working Domain</label>
                <div className="relative">
                  <select
                    value={form.subjectCourse}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange("subjectCourse", val);
                      if (val !== "Other") {
                        setForm((prev) => ({ ...prev, otherSubjectCourse: "" }));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.otherSubjectCourse;
                          return next;
                        });
                      }
                    }}
                    onBlur={() => handleBlur("subjectCourse")}
                    className={`w-full px-3 py-2 pr-10 rounded-xl border ${touched.subjectCourse && errors.subjectCourse
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200 bg-slate-50"
                      } focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer text-sm ${!form.subjectCourse ? "text-gray-400" : "text-slate-800 font-medium"
                      }`}
                  >
                    <option value="" disabled className="text-gray-400">Select Domain</option>
                    {domainOptions.map((domain) => (
                      <option key={domain} value={domain} className="text-slate-800">{domain}</option>
                    ))}
                    <option value="Other" className="text-slate-800">Other</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {touched.subjectCourse && errors.subjectCourse && (
                  <p className="text-red-500 text-[10px] ml-1">{errors.subjectCourse}</p>
                )}
              </div>
            </div>

            {form.subjectCourse === "Other" && (
              <div className="space-y-1 text-left animate-in fade-in zoom-in duration-200">
                <label className="text-xs font-semibold text-slate-700">Specify Working Domain</label>
                <input
                  type="text"
                  placeholder="Enter your working domain"
                  value={form.otherSubjectCourse}
                  onChange={(e) => handleChange("otherSubjectCourse", e.target.value)}
                  onBlur={() => handleBlur("otherSubjectCourse")}
                  className={`w-full px-3 py-2 rounded-xl border ${touched.otherSubjectCourse && errors.otherSubjectCourse
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200 bg-slate-50"
                    } focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm`}
                />
                {touched.otherSubjectCourse && errors.otherSubjectCourse && (
                  <p className="text-red-500 text-[10px] ml-1">{errors.otherSubjectCourse}</p>
                )}
              </div>
            )}

            {/* LinkedIn Profile */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-600">LinkedIn profile url</label>
              <input
                type="text"
                value={form.linkedinUrl}
                onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800"
              />
            </div>

            {/* CV/Profile Upload Button & Link */}
            <DocumentUpload
              label="CV/Profile (Max 5MB)"
              required
              file={resumeFile}
              onFileSelect={handleFileSelect}
              onFileRemove={removeResumeFile}
              accept=".pdf,.doc,.docx"
              error={errors.resume}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 text-sm font-normal flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all mt-1 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit Details"} <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              🔒 Your contact information is kept confidential and reviewed solely by BITC HR.
            </p>
          </form>
        </div>
      )}
    </div >
  );
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/about/careers"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Careers Page
          </Link>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading Application Form...</div>}>
          <ApplyFormContent />
        </Suspense>
      </div>
    </div>
  );
}
