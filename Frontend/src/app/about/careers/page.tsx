"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import DocumentUpload from "@/components/ui/DocumentUpload";
import {
  Briefcase,
  Heart,
  TrendingUp,
  BookOpen,
  Coffee,
  Users,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  Star,
  X,
  Send,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
  Award,
  Building,
  Check,
  AlertCircle,
  Calendar,
  Paperclip,
  ChevronDown,
} from "lucide-react";
import { getApiBase } from "@/lib/utils";

interface JobOpeningItem {
  id?: string;
  title: string;
  type: string;
  location: string;
  experience: string;
  department?: string;
  description?: string;
  specialities?: string;
}




// Helper to format experience with default "+ Years"
function formatExperience(exp?: string): string {
  if (!exp) return "1+ Years";
  const trimmed = exp.trim();
  if (!trimmed) return "1+ Years";
  if (/fresher/i.test(trimmed)) return trimmed;
  if (/years?/i.test(trimmed)) return trimmed;
  if (trimmed.endsWith("+")) return `${trimmed} Years`;
  if (/^\d+\s*(-|to)\s*\d+$/i.test(trimmed)) return `${trimmed} Years`;
  if (/^\d+$/.test(trimmed)) return `${trimmed}+ Years`;
  return `${trimmed}+ Years`;
}

// Default mentor domains matching dashboard
const defaultMentorDomains = [
  "Industry Experts",
  "Technical Consultants",
  "Corporate Trainers",
];

export default function CareersPage() {
  const [openingsList, setOpeningsList] = useState<JobOpeningItem[]>([]);
  const [, setLoading] = useState(false);
  const [domainOptions, setDomainOptions] = useState<string[]>(defaultMentorDomains);

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
        console.warn("Could not load dynamic mentor domains, using defaults:", err);
      }
    }
    loadDynamicDomains();
    return () => {
      isMounted = false;
    };
  }, []);

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Faculty / Technical Trainer");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
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
  const [resumeFile, setResumeFile] = useState<{ name: string; size: string; data: string } | null>(null);

  useEffect(() => {
    async function loadCareers() {
      setLoading(true);
      try {
        let list: JobOpeningItem[] = [];

        // 1. Primary: fetch from /api/careers (which queries Neon PostgreSQL)
        try {
          const res = await fetch("/api/careers", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.openings) && data.openings.length > 0) {
              list = data.openings;
            }
          }
        } catch (localErr) {
          console.warn("Notice: /api/careers local fetch:", localErr);
        }

        // 2. Direct API Fallback (ensures live data even if DB connection quota is hit on serverless)
        if (list.length === 0) {
          try {
            const apiUrl = getApiBase();
            const resRemote = await fetch(`${apiUrl}/careers`, { cache: "no-store" });
            if (resRemote.ok) {
              const dataRemote = await resRemote.json();
              const remoteList = Array.isArray(dataRemote.openings)
                ? dataRemote.openings
                : Array.isArray(dataRemote)
                  ? dataRemote
                  : [];
              if (remoteList.length > 0) {
                list = remoteList;
              }
            }
          } catch (remoteErr) {
            console.warn("Notice: backend /careers fallback:", remoteErr);
          }
        }

        if (list.length > 0) {
          setOpeningsList(list);
        }
      } catch (err) {
        console.warn("Failed to load dynamic careers:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCareers();

  }, []);

  const openApplyModal = (roleTitle?: string) => {
    const role = roleTitle || "";
    setSelectedRole(role);
    setForm((prev) => ({
      ...prev,
      position: role,
    }));
    setErrors({});
    setTouched({});
    setSubmitSuccess(false);
    setSubmitError(null);
    setIsApplyModalOpen(true);
  };

  // Validation function per field
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
    } else if (name === "dateToJoin") {
      if (form.joinQuickOption === "Custom Date" && !value) {
        error = "Please select your expected joining date.";
      }
    } else if (name === "otherSubjectCourse") {
      if (form.subjectCourse === "Other" && !value.trim()) {
        error = "Please specify your domain.";
      }
    } else if (name === "subjectCourse") {
      if (!value) {
        error = "Please select a certification specialization.";
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

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitError("Please fill out all required fields with valid information.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const finalDateToJoin = form.joinQuickOption === "Custom Date" ? form.dateToJoin : form.joinQuickOption;
    const finalSubjectCourse = form.subjectCourse === "Other" && form.otherSubjectCourse.trim()
      ? form.otherSubjectCourse.trim()
      : form.subjectCourse.trim();

    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        position: form.position,
        subjectCourse: finalSubjectCourse,
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

      // 2. Fallback to local Next.js route ONLY IF backend failed
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
        setForm({
          fullName: "",
          email: "",
          phone: "",
          position: "",
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
        setResumeFile(null);
        setErrors({});
        setTouched({});
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
    <div className="flex flex-col min-h-screen text-[15px]">

      {/* ── HERO ── */}
      <section className="relative w-full lg:min-h-[calc(100vh-80px)] bg-white text-slate-900 py-14 sm:py-18 lg:py-28 overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1000px] mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center lg:my-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium rounded-full px-4 py-1.5 text-sm mb-6 border border-primary/20">
            <Briefcase className="w-4 h-4" />
            Careers Opportunities
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 leading-[1.2]">
            Teach &amp; Inspire At <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">BITC</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-[900px] mx-auto leading-relaxed mb-8">
            Join a premier industrial training centre. Share your industry expertise, mentor passionate students, and shape the next generation of tech leaders.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => openApplyModal()}
              className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 font-normal flex items-center gap-2 justify-center hover:shadow-xl shadow-orange-500/20 hover:-translate-y-0.5 transition-all text-base cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-700" /> Apply Now
            </button>
            <Link
              href="#current-openings"
              className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full bg-slate-100 text-slate-600 font-normal flex items-center justify-center border border-slate-200 hover:bg-slate-200 transition-all text-base"
            >
              View Openings
            </Link>
          </div>
        </div>
      </section>

      {/* ── CURRENT OPENINGS ── */}
      <section id="current-openings" className="pt-12 sm:pt-16 md:pt-24 pb-8 md:pb-10 bg-white scroll-mt-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Current <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Openings</span>
            </h2>
            <p className="text-gray-600 max-w-[620px] mx-auto text-base">
              Find your ideal faculty or trainer role and apply directly with your domain expertise.
            </p>
          </div>

          {openingsList.length === 0 ? (
            <div className="max-w-[750px] mx-auto text-center py-12 px-6 bg-slate-50/80 border border-dashed border-slate-200 rounded-3xl">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-100">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1.5">Open Faculty Hiring</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                We are actively welcoming trainers, mentors, and placement experts to join BITC. Submit your profile directly to our academic panel.
              </p>
              <button
                onClick={() => openApplyModal("Faculty / Technical Trainer")}
                className="px-6 py-3 rounded-full text-slate-800 font-normal text-sm hover:shadow-lg shadow-orange-500/20 transition-all bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:opacity-90 cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Apply Now
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-6xl mx-auto">
              {openingsList.map((job, i) => (
                <div
                  key={job.id || i}
                  className="group relative bg-white border border-slate-200/90 hover:border-amber-400 rounded-2xl p-5 md:p-5.5 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 items-center gap-4 lg:gap-6"
                >
                  {/* Left: Role Icon, Title & Metadata (6 cols) */}
                  <div className="lg:col-span-6 flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50/60 border border-amber-200/50 flex items-center justify-center shrink-0 text-amber-500/80 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                      <Briefcase className="w-4.5 h-4.5" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <h3 className="text-base md:text-lg font-medium text-slate-700 group-hover:text-amber-600 transition-colors truncate" title={job.title}>
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-normal">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-normal bg-slate-50 text-slate-500 border border-slate-200/60">
                          {job.type}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 font-normal text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 font-normal text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-amber-500/70" />
                          <span className="text-amber-700/80 font-normal">{formatExperience(job.experience)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Specialization Skills (4 cols) */}
                  <div className="lg:col-span-4 min-w-0">
                    {job.specialities ? (
                      <div>
                        <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" /> Specialization
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {job.specialities.split(",").map((s, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-50/80 text-slate-600 border border-slate-200/60 font-normal group-hover:bg-amber-50/60 group-hover:border-amber-200/60 transition-colors"
                            >
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400/80 italic font-normal">General Domain</div>
                    )}
                  </div>

                  {/* Right: Apply CTA (2 cols) */}
                  <div className="lg:col-span-2 flex justify-start lg:justify-end">
                    <button
                      onClick={() => openApplyModal(job.title)}
                      className="w-full lg:w-auto px-6 py-2.5 rounded-full text-slate-800 font-normal text-sm shadow-md shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all whitespace-nowrap bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:opacity-95 cursor-pointer flex items-center justify-center gap-2 group-hover:scale-105 active:scale-95"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Open Application / Don't see your domain? Banner */}
          <div className="mt-20 md:mt-24 max-w-6xl mx-auto bg-amber-50/40 border border-amber-200/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-amber-700/80 text-xs font-medium uppercase tracking-wider bg-white/80 px-3 py-1 rounded-full border border-amber-200/50">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> General Applications
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-800">Don&apos;t see your exact course or specialization?</h3>
              <p className="text-xs md:text-sm text-slate-500 max-w-xl font-normal">
                We are constantly expanding our mentor network. Submit your profile and syllabus expertise, and our academic panel will connect with you.
              </p>
            </div>
            <button
              onClick={() => openApplyModal("Open Faculty / General Application")}
              className="px-6 py-3 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 font-normal text-sm hover:opacity-90 shadow-md shadow-orange-500/20 hover:shadow-lg transition-all shrink-0 cursor-pointer flex items-center gap-2"
            >
              <span>Submit Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SPECIAL FACULTY & TRAINER APPLICATION MODAL ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto">

            {/* Modal Header */}
            {!submitSuccess ? (
              <div className="relative p-5 md:p-6 pb-2 shrink-0 border-b-0 bg-white">
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="mb-2 text-center pt-2">
                  <h3 className="text-2xl font-medium text-gray-600 mb-1">
                    Apply <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">For Faculty</span>
                  </h3>
                  <p className="text-slate-600 text-xs md:text-sm">
                    Join our network to train talent, share knowledge, or collaborate on tech.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative p-4 pb-0 shrink-0 bg-white flex justify-end">
                <button
                  onClick={() => {
                    setIsApplyModalOpen(false);
                    setSubmitSuccess(false);
                  }}
                  className="p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Modal Body */}
            <div className="px-5 md:px-8 pb-8 pt-2 overflow-y-auto flex-1 bg-white no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {submitSuccess ? (
                <div className="bg-white py-12 text-center h-full flex flex-col justify-center items-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-600 mb-4">Request Received!</h3>
                  <p className="text-slate-600 mb-8 max-w-sm mx-auto text-sm">
                    Thank you for applying to teach at BITC. Our HR team will reach out to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsApplyModalOpen(false);
                      setSubmitSuccess(false);
                    }}
                    className="px-8 py-3 rounded-xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-black font-medium text-sm hover:shadow-lg transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-3">
                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-medium text-slate-600">Name</label>
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        onBlur={() => handleBlur("fullName")}
                        className={`w-full px-3 py-2 rounded-xl border ${errors.fullName && touched.fullName ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800`}
                      />
                      {errors.fullName && touched.fullName && <p className="text-red-500 text-[10px] ml-1">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-medium text-slate-600">Email Id</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        className={`w-full px-3 py-2 rounded-xl border ${errors.email && touched.email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800`}
                      />
                      {errors.email && touched.email && <p className="text-red-500 text-[10px] ml-1">{errors.email}</p>}
                    </div>
                  </div>

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
                        className={`w-full px-3 py-2 rounded-xl border ${errors.phone && touched.phone ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800`}
                      />
                      {errors.phone && touched.phone && <p className="text-red-500 text-[10px] ml-1">{errors.phone}</p>}
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-medium text-slate-600">Mentor Domain</label>
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
                          className={`w-full px-3 py-2 pr-10 rounded-xl border ${errors.subjectCourse && touched.subjectCourse ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer text-sm ${
                            !form.subjectCourse ? "text-gray-400" : "text-slate-800 font-medium"
                          }`}
                        >
                          <option value="" disabled className="text-gray-400">Select Domain</option>
                          {domainOptions.map((catName) => (
                            <option key={catName} value={catName} className="text-slate-800">{catName}</option>
                          ))}
                          <option value="Other" className="text-slate-800">Other</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {errors.subjectCourse && touched.subjectCourse && <p className="text-red-500 text-[10px] ml-1">{errors.subjectCourse}</p>}
                    </div>
                  </div>

                  {form.subjectCourse === "Other" && (
                    <div className="space-y-1 text-left animate-in fade-in zoom-in duration-200">
                      <label className="text-xs font-semibold text-slate-700">Specify Mentor Domain</label>
                      <input
                        type="text"
                        placeholder="Enter your mentor domain"
                        value={form.otherSubjectCourse}
                        onChange={(e) => handleChange("otherSubjectCourse", e.target.value)}
                        onBlur={() => handleBlur("otherSubjectCourse")}
                        className={`w-full px-3 py-2 rounded-xl border ${errors.otherSubjectCourse && touched.otherSubjectCourse ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm`}
                      />
                      {errors.otherSubjectCourse && touched.otherSubjectCourse && (
                        <p className="text-red-500 text-[10px] ml-1">{errors.otherSubjectCourse}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700">LinkedIn profile url</label>
                    <input
                      type="text"
                      value={form.linkedinUrl}
                      onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
                    />
                  </div>

                  <DocumentUpload
                    label="CV/Profile (Max 5MB)"
                    required
                    file={resumeFile}
                    onFileSelect={handleFileSelect}
                    onFileRemove={removeResumeFile}
                    accept=".pdf,.doc,.docx"
                    error={errors.resume}
                  />

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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
