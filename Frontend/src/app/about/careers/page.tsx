"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Heart,
  TrendingUp,
  BookOpen,
  Coffee,
  Users,
  ArrowRight,
  CheckCircle2,
  Upload,
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
  FileText,
  Calendar,
  Paperclip,
  Trash2,
  ChevronDown,
} from "lucide-react";

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


const defaultOpenings: JobOpeningItem[] = [
  { title: "Faculty – Full Stack Development", type: "Full-Time", location: "On-Site", experience: "3+ Years", department: "Academic & Training", specialities: "MERN, Java, Python" },
  { title: "Technical Trainer – Data Science", type: "Full-Time", location: "On-Site", experience: "2+ Years", department: "Academic & Training", specialities: "Python, Machine Learning, SQL" },
  { title: "Industry Expert", type: "Part-Time", location: "Hybrid", experience: "5+ Years", department: "Academic & Training", specialities: "Industry Insights, Mentorship, Tech Leadership" },
  { title: "T and P Office", type: "Full-Time", location: "On-Site", experience: "3+ Years", department: "Placement Cell", specialities: "Corporate Relations, Placement Coordination, HR Networking" },
];


// All courses & certifications available across BITC website categorized
const courseCertificationOptions = [
  { category: "Information Technology", courses: [] },
  { category: "Digital Media Technology", courses: [] },
  { category: "Management Programs", courses: [] },
  { category: "Design Programs", courses: [] },
];

export default function CareersPage() {
  const [openingsList, setOpeningsList] = useState<JobOpeningItem[]>(defaultOpenings);

  const [, setLoading] = useState(false);

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Faculty – Full Stack Development");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "Faculty – Full Stack Development",
    subjectCourse: "MERN Stack Development (MongoDB, Express, React, Node)",
    experience: "3-5 Years",
    qualification: "B.Tech / BE",
    otherQualification: "",
    dateToJoin: "",
    joinQuickOption: "Immediate",
    currentOrg: "",
    resumeUrl: "",
    linkedinUrl: "",
    coverNote: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resumeFile, setResumeFile] = useState<{ name: string; size: string; data: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadCareers() {
      setLoading(true);
      try {
        const res = await fetch("/api/careers");
        if (res.ok) {
          const data = await res.json();
          if (data.openings && data.openings.length > 0) {
            setOpeningsList(data.openings);
          }
        }
      } catch (err) {
        console.warn("Failed to load dynamic careers, using fallback:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCareers();

  }, []);

  const openApplyModal = (roleTitle?: string) => {
    const role = roleTitle || "Faculty / Technical Trainer";
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
        error = "Mobile number is required.";
      } else if (cleanPhone.length < 10) {
        error = `Please enter full 10-digit number (${cleanPhone.length}/10).`;
      } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        error = "Mobile number must start with 6, 7, 8, or 9.";
      }
    } else if (name === "otherQualification") {
      if (form.qualification === "Other" && !value.trim()) {
        error = "Please specify your degree / qualification.";
      }
    } else if (name === "dateToJoin") {
      if (form.joinQuickOption === "Custom Date" && !value) {
        error = "Please select your expected joining date.";
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

    if (form.qualification === "Other") {
      const oqErr = validateField("otherQualification", form.otherQualification);
      if (oqErr) newErrors.otherQualification = oqErr;
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
      qualification: true,
      otherQualification: true,
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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        position: form.position,
        subjectCourse: form.subjectCourse,
        experience: form.experience,
        qualification: form.qualification,
        otherQualification: form.otherQualification,
        dateToJoin: finalDateToJoin || "Immediate",
        currentOrg: form.currentOrg.trim(),
        resumeUrl: resumeFile ? resumeFile.data : form.resumeUrl.trim(),
        resumeFileName: resumeFile ? resumeFile.name : "",
        linkedinUrl: form.linkedinUrl.trim(),
        coverNote: form.coverNote.trim(),
      };

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess(true);
        setForm({
          fullName: "",
          email: "",
          phone: "",
          position: "Faculty – Full Stack Development",
          subjectCourse: "Information Technology",
          experience: "3-5 Years",
          qualification: "B.Tech / BE",
          otherQualification: "",
          dateToJoin: "",
          joinQuickOption: "Immediate",
          currentOrg: "",
          resumeUrl: "",
          linkedinUrl: "",
          coverNote: "",
        });
        setResumeFile(null);
        setErrors({});
        setTouched({});
      } else {
        setSubmitError(data.error || "Failed to submit application. Please try again.");
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
      <section className="relative w-full min-h-[calc(100vh-80px)] bg-white text-slate-900 py-20 lg:py-28 overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-[1000px] mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium rounded-full px-5 py-2 text-sm uppercase tracking-widest mb-8 border border-primary/20">
            <Briefcase className="w-4 h-4" />
            Careers & Faculty Hiring
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 leading-[1.2]">
            Teach & Inspire At <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">BITC</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-[900px] mx-auto leading-relaxed mb-8">
            Join a premier industrial training centre. Share your industry expertise, mentor passionate students, and shape the next generation of tech leaders.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openApplyModal()}
              className="h-14 px-8 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-black font-medium flex items-center gap-2 justify-center hover:shadow-xl shadow-orange-500/20 hover:-translate-y-0.5 transition-all text-base cursor-pointer"
            >
              <Sparkles className="w-5 h-5" /> Apply as Faculty / Trainer
            </button>
            <Link
              href="#current-openings"
              className="h-14 px-8 rounded-full bg-slate-100 text-slate-900 font-medium flex items-center justify-center border border-slate-200 hover:bg-slate-200 transition-all text-base"
            >
              View Openings
            </Link>
          </div>
        </div>
      </section>


      {/* ── CURRENT OPENINGS ── */}
      <section id="current-openings" className="py-16 md:py-24 bg-white scroll-mt-20">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Current <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Openings</span></h2>
            <p className="text-gray-600 max-w-[600px] mx-auto text-lg">Select a role and apply directly with your course specialization.</p>
          </div>

          <div className="space-y-4 max-w-[950px] mx-auto">
            {openingsList.map((job, i) => (
              <div key={job.id || i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md hover:border-primary/30 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    {job.department && (
                      <span className="text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full">
                        {job.department}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <Briefcase className="w-3.5 h-3.5 text-primary" /> {job.type}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-primary" /> {job.experience}
                    </span>
                  </div>
                  {job.specialities && (
                    <div className="mt-3 text-sm text-slate-600">
                      <span className="font-bold text-slate-800">Specialities:</span> {job.specialities}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => openApplyModal(job.title)}
                  className="px-6 py-2.5 rounded-full text-black font-medium text-sm hover:shadow-lg shadow-orange-500/20 transition-all whitespace-nowrap bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:opacity-90 cursor-pointer"
                >
                  Apply Now
                </button>
              </div>
            ))}
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
            <div className="relative p-5 md:p-6 pb-2 shrink-0 border-b-0 bg-white">
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="mb-2 text-center pt-2">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  Apply <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">For Faculty</span>
                </h3>
                <p className="text-slate-600 text-xs md:text-sm">
                  Join our network to train talent, share knowledge, or collaborate on tech.
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-5 md:px-8 pb-8 pt-2 overflow-y-auto flex-1 bg-white">
              {submitSuccess ? (
                <div className="bg-white py-12 text-center h-full flex flex-col justify-center items-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Request Received!</h3>
                  <p className="text-slate-600 mb-8 max-w-sm mx-auto text-sm">
                    Thank you for applying to teach at BITC. Our HR team will reach out to you shortly.
                  </p>
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
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
                      <label className="text-xs font-semibold text-slate-700">Name</label>
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        onBlur={() => handleBlur("fullName")}
                        placeholder="Enter your Full name"
                        className={`w-full px-3 py-2 rounded-xl border ${errors.fullName && touched.fullName ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm`}
                      />
                      {errors.fullName && touched.fullName && <p className="text-red-500 text-[10px] ml-1">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-slate-700">Email Id</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        placeholder="Enter Your Email id"
                        className={`w-full px-3 py-2 rounded-xl border ${errors.email && touched.email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm`}
                      />
                      {errors.email && touched.email && <p className="text-red-500 text-[10px] ml-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-slate-700">Contact </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        placeholder="Enter your mobile number"
                        className={`w-full px-3 py-2 rounded-xl border ${errors.phone && touched.phone ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm`}
                      />
                      {errors.phone && touched.phone && <p className="text-red-500 text-[10px] ml-1">{errors.phone}</p>}
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-slate-700">Teaching / Industry Experience</label>
                      <div className="relative">
                        <select
                          value={form.experience}
                          onChange={(e) => handleChange("experience", e.target.value)}
                          className="w-full px-3 py-2 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer text-sm"
                        >
                          <option value="Fresher / <1 Year">Fresher / &lt; 1 Year</option>
                          <option value="1-3 Years">1 - 3 Years</option>
                          <option value="3-5 Years">3 - 5 Years</option>
                          <option value="5-8 Years">5 - 8 Years</option>
                          <option value="8+ Years">8+ Years (Senior Lead / Architect)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-slate-700">Certification Domain</label>
                      <div className="relative">
                        <select
                          value={form.subjectCourse}
                          onChange={(e) => handleChange("subjectCourse", e.target.value)}
                          onBlur={() => handleBlur("subjectCourse")}
                          className={`w-full px-3 py-2 pr-10 rounded-xl border ${errors.subjectCourse && touched.subjectCourse ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer text-sm`}
                        >
                          {courseCertificationOptions.map((group) => (
                            <option key={group.category} value={group.category}>{group.category}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {errors.subjectCourse && touched.subjectCourse && <p className="text-red-500 text-[10px] ml-1">{errors.subjectCourse}</p>}
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-slate-700">Highest Qualification</label>
                      <div className="relative">
                        <select
                          value={form.qualification}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm((prev) => ({
                              ...prev,
                              qualification: val,
                              ...(val !== "Other" ? { otherQualification: "" } : {}),
                            }));
                          }}
                          className="w-full px-3 py-2 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer text-sm"
                        >
                          <option value="B.Tech / BE">B.Tech / B.E.</option>
                          <option value="M.Tech / ME">M.Tech / M.E.</option>
                          <option value="MCA / M.Sc IT">MCA / M.Sc. IT / CS</option>
                          <option value="BCA / B.Sc CS">BCA / B.Sc. CS</option>
                          <option value="PhD / Doctorate">PhD / Doctorate</option>
                          <option value="MBA / PGDM">MBA / PGDM</option>
                          <option value="Industry certified professional">Industry certified professional</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {form.qualification === "Other" && (
                    <div className="space-y-1 text-left animate-in fade-in zoom-in duration-200">
                      <label className="text-xs font-semibold text-slate-700">Specify Qualification</label>
                      <input
                        type="text"
                        required
                        value={form.otherQualification}
                        onChange={(e) => handleChange("otherQualification", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700">LinkedIn profile url</label>
                    <input
                      type="url"
                      value={form.linkedinUrl}
                      onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-1 text-left pt-1">
                    <label className="text-xs font-semibold text-slate-700">Resume / CV (Max 5MB)</label>
                    {resumeFile ? (
                      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <p className="text-xs font-semibold text-slate-700 truncate">{resumeFile.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={removeResumeFile}
                          className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-3 py-4 rounded-xl border border-slate-200 border-dashed bg-slate-50 hover:bg-slate-100 focus:bg-white transition-all text-sm text-center cursor-pointer"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <span className="text-slate-500 font-medium text-xs flex items-center justify-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Click to upload</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-black text-[15px] font-medium flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all mt-1 disabled:opacity-50"
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
