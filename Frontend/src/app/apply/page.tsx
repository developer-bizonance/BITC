"use client";

import React, { useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
  Trash2,
  Upload,
  FileText,
} from "lucide-react";

// Categorized courses & certifications available across BITC website
const courseCertificationOptions = [
  {
    category: "💻 IT & Full Stack Software Development",
    courses: [
      "MERN Stack Development (MongoDB, Express, React, Node)",
      "MEAN Stack Development (MongoDB, Express, Angular, Node)",
      "Full Stack Java Development (Spring Boot, Microservices, React)",
      "Full Stack Python Development (Django, FastAPI, PostgreSQL)",
      "React.js & Next.js Frontend Architecture",
      "Node.js Backend & API Development",
      "Mobile App Development (Flutter & React Native)",
      "Software Testing & QA Automation (Selenium, Cypress)",
    ],
  },
  {
    category: "🤖 AI, Data Science & Analytics",
    courses: [
      "Data Science & Machine Learning (Python, Pandas, Scikit-Learn)",
      "Artificial Intelligence & Deep Learning (TensorFlow, PyTorch)",
      "Business Intelligence & Data Analytics (PowerBI, Tableau, SQL)",
      "Big Data Engineering (Spark, Hadoop, Kafka)",
      "Generative AI & LLM Applications",
    ],
  },
  {
    category: "☁️ Cloud Computing & Cyber Security",
    courses: [
      "Cloud Computing & Architecture (AWS / Microsoft Azure / GCP)",
      "DevOps & SRE (Docker, Kubernetes, Jenkins, CI/CD, Terraform)",
      "Cyber Security & Ethical Hacking",
      "Network Engineering & Systems Security",
    ],
  },
  {
    category: "📊 Management, Business & Marketing",
    courses: [
      "Digital Marketing & Growth Hacking (SEO, SEM, Meta Ads, SMM)",
      "Product Management & Agile Scrum Methodology",
      "Business Analytics & Financial Analysis",
      "Human Resource Management & Talent Acquisition",
    ],
  },
  {
    category: "🎨 UI/UX Design & Multimedia",
    courses: [
      "UI/UX Design & Design Systems (Figma, Adobe XD)",
      "Graphic Design & Visual Communication (Photoshop, Illustrator)",
      "3D Modeling, Motion Graphics & Animation",
      "Video Editing & Production (Premiere Pro, After Effects)",
    ],
  },
  {
    category: "🏛️ Placement Cell & Institutional Roles",
    courses: [
      "Training & Placement Officer (TPO) / Corporate Relations",
      "Soft Skills, Communication & Personality Development Trainer",
      "Quantitative Aptitude & Logical Reasoning Trainer",
      "Technical Mock Interview & Resume Building Mentor",
    ],
  },
];

function ApplyFormContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "Faculty – Full Stack Development";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: initialRole,
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
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<{ name: string; size: string; data: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        error = "Email address is required.";
      } else if (!emailRegex.test(value.trim())) {
        error = "Please enter a valid email address (e.g. name@example.com).";
      }
    } else if (name === "phone") {
      const cleanPhone = value.replace(/\D/g, "");
      if (!cleanPhone) {
        error = "Phone number is required.";
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
        error = "Please select a course / certification specialization.";
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="w-full max-w-3xl mx-auto">
      {submitSuccess ? (
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Check className="w-10 h-10" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider mb-3">
            Application Submitted
          </span>
          <h2 className="text-3xl font-black text-slate-900 mb-3">Welcome to the BITC Talent Pool!</h2>
          <p className="text-slate-600 max-w-lg mx-auto mb-8 text-base leading-relaxed">
            Thank you, <strong className="text-slate-900">{form.fullName}</strong>. Your application to teach{" "}
            <strong className="text-primary">{form.subjectCourse}</strong> has been successfully submitted to our Academic Board.
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 max-w-md mx-auto mb-8 text-left space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="font-bold text-slate-800">Applied Role:</span>
              <span>{form.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-800">Contact Email:</span>
              <span>{form.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-800">Availability / Date:</span>
              <span className="text-emerald-700 font-bold">
                {form.joinQuickOption === "Custom Date" ? form.dateToJoin : form.joinQuickOption}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-800">Next Step:</span>
              <span className="text-primary font-bold">HR Review & Demo Call</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="/about/careers"
              className="px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-lg"
            >
              Back to Careers
            </Link>
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setForm({
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
                setResumeFile(null);
                setErrors({});
                setTouched({});
              }}
              className="px-8 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm transition-all"
            >
              Submit Another
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-2 border border-primary/30">
              <Sparkles className="w-3.5 h-3.5" /> Official Application Portal
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Faculty & Trainer <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Application Form</span>
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Select the course or certification you wish to teach, upload your resume, and submit your profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="p-6 md:p-10 space-y-6 bg-slate-50/40">
            {submitError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Candidate Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  onBlur={() => handleBlur("fullName")}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none transition-all font-medium shadow-sm ${
                    touched.fullName && errors.fullName
                      ? "border-red-500 ring-2 ring-red-100 bg-red-50/20"
                      : "border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                  }`}
                />
                {touched.fullName && errors.fullName && (
                  <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="e.g. rajesh.sharma@example.com"
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none transition-all font-medium shadow-sm ${
                    touched.email && errors.email
                      ? "border-red-500 ring-2 ring-red-100 bg-red-50/20"
                      : "border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                  }`}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Phone & Applying Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Phone / WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  placeholder="e.g. 9876543210 (10 Digits)"
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none transition-all font-medium shadow-sm ${
                    touched.phone && errors.phone
                      ? "border-red-500 ring-2 ring-red-100 bg-red-50/20"
                      : "border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                  }`}
                />
                {touched.phone && errors.phone && (
                  <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Position Applied For <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium cursor-pointer shadow-sm"
                >
                  <option value="Faculty – Full Stack Development">Faculty – Full Stack Development</option>
                  <option value="Technical Trainer – Data Science">Technical Trainer – Data Science</option>
                  <option value="Industry Expert & Mentor">Industry Expert & Mentor</option>
                  <option value="T and P Office (Placement Cell)">T and P Office (Placement Cell)</option>
                  <option value="Visiting Corporate Trainer">Visiting Corporate Trainer</option>
                  <option value="Soft Skills & Aptitude Trainer">Soft Skills & Aptitude Trainer</option>
                </select>
              </div>
            </div>

            {/* 🌟 SPECIAL COURSE & CERTIFICATION DROPDOWN 🌟 */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 p-5 rounded-2xl border-2 border-primary/40 shadow-sm">
              <label className="block text-xs font-extrabold text-slate-900 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2 text-primary font-black text-sm">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Which Course / Certification will you teach? <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
                  All Website Specializations
                </span>
              </label>
              <select
                value={form.subjectCourse}
                onChange={(e) => handleChange("subjectCourse", e.target.value)}
                onBlur={() => handleBlur("subjectCourse")}
                className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-slate-900 text-sm font-bold focus:outline-none transition-all cursor-pointer shadow ${
                  touched.subjectCourse && errors.subjectCourse
                    ? "border-red-500 ring-2 ring-red-100"
                    : "border-primary focus:ring-4 focus:ring-primary/20"
                }`}
              >
                {courseCertificationOptions.map((group) => (
                  <optgroup key={group.category} label={group.category} className="font-extrabold text-slate-900 bg-slate-100 py-1">
                    {group.courses.map((course) => (
                      <option key={course} value={course} className="font-medium text-slate-800 bg-white py-1">
                        {course}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {touched.subjectCourse && errors.subjectCourse && (
                <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.subjectCourse}
                </p>
              )}
            </div>

            {/* Highest Qualification & Current Company (Always 2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Highest Qualification <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.qualification}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      qualification: val,
                      ...(val !== "Other" ? { otherQualification: "" } : {}),
                    }));
                    if (val !== "Other") {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.otherQualification;
                        return next;
                      });
                    }
                  }}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium cursor-pointer shadow-sm"
                >
                  <option value="B.Tech / BE">B.Tech / B.E.</option>
                  <option value="M.Tech / ME">M.Tech / M.E.</option>
                  <option value="MCA / M.Sc IT">MCA / M.Sc. IT / Computer Science</option>
                  <option value="BCA / B.Sc CS">BCA / B.Sc. Computer Science</option>
                  <option value="PhD / Doctorate">PhD / Doctorate</option>
                  <option value="MBA / PGDM">MBA / PGDM</option>
                  <option value="Industry Certified Professional">Industry Certified Professional</option>
                  <option value="Other">Other (Please specify degree)</option>
                </select>
              </div>

              {/* Current Company / College is ALWAYS visible here */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Current Company / College
                </label>
                <input
                  type="text"
                  value={form.currentOrg}
                  onChange={(e) => handleChange("currentOrg", e.target.value)}
                  placeholder="e.g. Infosys, TCS, or Freelance Trainer"
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Dedicated Extra Row When 'Other' Education is Selected */}
            {form.qualification === "Other" && (
              <div className="p-4 bg-orange-50/60 rounded-2xl border-2 border-orange-200 animate-in fade-in zoom-in-95 duration-200">
                <label className="block text-xs font-bold text-orange-800 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-orange-600" />
                  Specify Your Degree / Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.otherQualification}
                  onChange={(e) => handleChange("otherQualification", e.target.value)}
                  onBlur={() => handleBlur("otherQualification")}
                  placeholder="e.g. B.Sc Electronics, Diploma in Computer Engineering, M.Phil"
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none transition-all font-medium shadow-sm ${
                    touched.otherQualification && errors.otherQualification
                      ? "border-red-500 ring-2 ring-red-100 bg-red-50/30"
                      : "border-orange-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  }`}
                />
                {touched.otherQualification && errors.otherQualification && (
                  <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.otherQualification}
                  </p>
                )}
              </div>
            )}

            {/* Date to Join / Availability Field */}
            <div className="bg-slate-100/90 p-5 rounded-2xl border border-slate-200 shadow-sm">
              <label className="block text-xs font-bold text-slate-900 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" /> Expected Date to Join / Availability <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {["Immediate", "Within 15 Days", "1st of Next Month", "Custom Date"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setForm({ ...form, joinQuickOption: opt });
                      if (opt !== "Custom Date") {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.dateToJoin;
                          return next;
                        });
                      }
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                      form.joinQuickOption === opt
                        ? "bg-slate-900 text-white border-slate-900 shadow"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {form.joinQuickOption === "Custom Date" && (
                <div className="mt-2.5 animate-in fade-in duration-150">
                  <input
                    type="date"
                    value={form.dateToJoin}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => handleChange("dateToJoin", e.target.value)}
                    onBlur={() => handleBlur("dateToJoin")}
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none font-medium shadow-sm ${
                      touched.dateToJoin && errors.dateToJoin
                        ? "border-red-500 ring-2 ring-red-100 bg-red-50/20"
                        : "border-slate-200 focus:ring-2 focus:ring-primary"
                    }`}
                  />
                  {touched.dateToJoin && errors.dateToJoin && (
                    <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.dateToJoin}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Resume Upload Button & Link */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-primary" /> Upload Resume / CV (.PDF, .DOCX)
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Max size: 5MB</span>
              </label>

              {resumeFile ? (
                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 truncate max-w-[300px]">{resumeFile.name}</p>
                      <p className="text-xs text-emerald-700 font-semibold">{resumeFile.size} • Ready for upload</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeResumeFile}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-100/50 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-primary bg-white hover:bg-primary/5 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group shadow-sm"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-primary mb-2 transition-colors" />
                  <p className="text-sm font-bold text-slate-800 group-hover:text-primary">
                    Click to upload Resume / CV file
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Supports PDF, DOC, DOCX up to 5MB</p>
                </div>
              )}
            </div>

            {/* LinkedIn Profile */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium shadow-sm"
              />
            </div>

            {/* Cover Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Teaching Philosophy / Brief Introduction
              </label>
              <textarea
                rows={3}
                value={form.coverNote}
                onChange={(e) => handleChange("coverNote", e.target.value)}
                placeholder="Share your practical experience, preferred teaching modules, and passion for training students..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium resize-none shadow-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white font-black text-base hover:shadow-2xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5"
              >
                {submitting ? (
                  <>Submitting Your Application...</>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Submit Faculty & Trainer Application
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                🔒 Your application is sent securely to the BITC Academic & Recruitment Board.
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/about/careers"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-colors"
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
