"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  X, CheckCircle2,
  ArrowRight, ShieldCheck, BookOpen, AlertCircle, RefreshCw, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    pendingCourse,
    applyForCourse,
  } = useAuth();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [message, setMessage] = useState("");
  const [course, setCourse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync pending course to the course dropdown state
  React.useEffect(() => {
    if (pendingCourse) {
      setCourse(pendingCourse.title);
    }
  }, [pendingCourse]);

  // Field-level validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Application Success state
  const [appliedRecord, setAppliedRecord] = useState<any | null>(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMsg(null);
    setAppliedRecord(null);
    setFieldErrors({});
    setName("");
    setEmail("");
    setPhone("");
    setCity("");
    setQualification("");
    setSpecialization("");
    setMessage("");
    setCourse("");
  };

  // ---------- Validation helpers ----------
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  // Mobile must be exactly 10 digits, no letters/symbols
  const isValidPhone = (value: string) =>
    /^[0-9]{10}$/.test(value.trim());

  // Name must be letters (and spaces) only, no digits/symbols
  const isValidName = (value: string) =>
    /^[A-Za-z\s]{2,}$/.test(value.trim());

  // Strip out digits as the user types, so numbers can never appear in Full Name
  const sanitizeName = (value: string) => value.replace(/[0-9]/g, "");

  // Strip out non-digit characters as the user types, and cap at 10 digits
  const sanitizePhone = (value: string) => value.replace(/[^0-9]/g, "").slice(0, 10);

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateApplyForm = () => {
    const errors: Record<string, string> = {};
    if (!isValidName(name)) errors.name = "Name must contain only letters";
    if (!isValidEmail(email)) errors.email = "Enter a valid Email Id";
    if (!phone.trim()) errors.phone = "Contact number is required";
    else if (!isValidPhone(phone)) errors.phone = "Enter exactly 10 digits, numbers only";
    if (!city.trim()) errors.city = "City is required";
    if (!qualification.trim()) errors.qualification = "Qualification is required";
    if (!specialization.trim()) errors.specialization = "Specialization is required";
    if (!course.trim()) errors.course = "Certification is required";
    if (!message.trim()) errors.message = "Message is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingCourse) return;
    if (!validateApplyForm()) return;

    setSubmitting(true);
    setErrorMsg(null);

    // Use the pendingCourse slug or id
    const appliedCourseId = (pendingCourse as any)?.slug || pendingCourse?.id || course.trim().toLowerCase().replace(/[\s_]+/g, "-");

    const res = await applyForCourse(appliedCourseId, course, name, email, phone, city, qualification, specialization, message);

    setSubmitting(false);

    if (res.success && res.application) {
      setAppliedRecord(res.application);
    } else {
      setErrorMsg(res.error || "Failed to submit application");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-200">

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4 md:p-6 overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {/* APPLICATION SUCCESS STATE */}
          {appliedRecord ? (
            <div className="text-center py-2 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold tracking-wider uppercase">
                APPLICATION SUBMITTED
              </span>
              <h2 className="text-2xl font-black text-slate-900">Application received!</h2>
              <p className="text-slate-600 text-sm max-w-sm mx-auto">
                Congratulations <span className="font-bold text-slate-900">{appliedRecord.userName}</span>! Your enrollment application for <span className="font-bold text-primary">{appliedRecord.courseTitle}</span> has been received.
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2">

                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Email Id:</span>
                  <span className="font-bold text-slate-800">{appliedRecord.userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Status:</span>
                  <span className="font-bold text-emerald-600">Under admission review</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Our academic counselor will contact you within 24 hours to complete certification orientation and batch scheduling.
              </p>

              <Button
                onClick={handleClose}
                className="w-full h-11 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 mt-2"
              >
                Done & Return to Site
              </Button>
            </div>
          ) : (
            <>
              {/* MODAL TITLE HEADER */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  Apply for {course || "Certification"}
                </h2>
                <p className="text-slate-500 text-xs mt-1 font-medium">
                  Please provide your details below to submit your application.
                </p>
              </div>

              {/* GLOBAL ERROR MESSAGE */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-red-800 leading-relaxed">{errorMsg}</p>
                </div>
              )}

              {/* CERTIFICATION APPLICATION CONFIRMATION (APPLY) */}
              <form onSubmit={handleApplySubmit} className="space-y-3" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(sanitizeName(e.target.value));
                        clearFieldError("name");
                      }}
                      onBlur={() => {
                        if (!name.trim()) setFieldErrors((prev) => ({ ...prev, name: "Name is required" }));
                      }}
                      className={`w-full h-10 px-4 bg-slate-50 border rounded-xl text-xs font-normal focus:outline-none focus:bg-white transition-all text-slate-800 ${fieldErrors.name
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-primary"
                        }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-[11px] font-medium text-red-500 mt-1">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">
                      Email Id <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearFieldError("email");
                      }}
                      onBlur={() => {
                        if (!email.trim()) setFieldErrors((prev) => ({ ...prev, email: "Email Id is required" }));
                      }}
                      className={`w-full h-10 px-4 bg-slate-50 border rounded-xl text-xs font-normal focus:outline-none focus:bg-white transition-all text-slate-800 ${fieldErrors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-primary"
                        }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[11px] font-medium text-red-500 mt-1">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {
                        setPhone(sanitizePhone(e.target.value));
                        clearFieldError("phone");
                      }}
                      onBlur={() => {
                        if (!phone.trim()) {
                          setFieldErrors((prev) => ({ ...prev, phone: "Contact number is required" }));
                        } else if (!isValidPhone(phone)) {
                          setFieldErrors((prev) => ({ ...prev, phone: "Enter exactly 10 digits, numbers only" }));
                        }
                      }}
                      className={`w-full h-10 px-4 bg-slate-50 border rounded-xl text-xs font-normal focus:outline-none focus:bg-white transition-all text-slate-800 ${fieldErrors.phone
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-primary"
                        }`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-[11px] font-medium text-red-500 mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        clearFieldError("city");
                      }}
                      onBlur={() => {
                        if (!city.trim()) setFieldErrors((prev) => ({ ...prev, city: "City is required" }));
                      }}
                      className={`w-full h-10 px-4 bg-slate-50 border rounded-xl text-xs font-normal focus:outline-none focus:bg-white transition-all text-slate-800 ${fieldErrors.city ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-primary"}`}
                    />
                    {fieldErrors.city && <p className="text-[11px] font-medium text-red-500 mt-1">{fieldErrors.city}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">
                      Higher Qualification <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={qualification}
                        onChange={(e) => {
                          setQualification(e.target.value);
                          clearFieldError("qualification");
                        }}
                        onBlur={() => {
                          if (!qualification.trim()) setFieldErrors((prev) => ({ ...prev, qualification: "Qualification is required" }));
                        }}
                        className={`w-full h-10 px-4 pr-10 bg-slate-50 border rounded-xl text-xs font-normal focus:outline-none focus:bg-white transition-all appearance-none cursor-pointer ${qualification === "" ? "text-gray-400" : "text-slate-800 font-medium"
                          } ${fieldErrors.qualification ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-primary"}`}
                      >
                        <option value="" disabled className="text-gray-400">Select Qualification</option>
                        <option value="B.E" className="text-slate-800">B.E</option>
                        <option value="M.E" className="text-slate-800">M.E</option>
                        <option value="B.Tech" className="text-slate-800">B.Tech</option>
                        <option value="M.Tech" className="text-slate-800">M.Tech</option>
                        <option value="B.C.A" className="text-slate-800">B.C.A</option>
                        <option value="M.C.A" className="text-slate-800">M.C.A</option>
                        <option value="B.Sc" className="text-slate-800">B.Sc</option>
                        <option value="M.Sc" className="text-slate-800">M.Sc</option>
                        <option value="B.Com" className="text-slate-800">B.Com</option>
                        <option value="M.Com" className="text-slate-800">M.Com</option>
                        <option value="B.B.A" className="text-slate-800">B.B.A</option>
                        <option value="M.B.A" className="text-slate-800">M.B.A</option>
                        <option value="Other" className="text-slate-800">Other</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {fieldErrors.qualification && <p className="text-[11px] font-medium text-red-500 mt-1">{fieldErrors.qualification}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">
                      Your Specialization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => {
                        setSpecialization(e.target.value);
                        clearFieldError("specialization");
                      }}
                      onBlur={() => {
                        if (!specialization.trim()) setFieldErrors((prev) => ({ ...prev, specialization: "Specialization is required" }));
                      }}
                      className={`w-full h-10 px-4 bg-slate-50 border rounded-xl text-xs font-normal focus:outline-none focus:bg-white transition-all text-slate-800 ${fieldErrors.specialization ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-primary"}`}
                    />
                    {fieldErrors.specialization && <p className="text-[11px] font-medium text-red-500 mt-1">{fieldErrors.specialization}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-500 block mb-1">
                      Certification <span className="text-red-500">*</span>
                    </label>
                    <div className="cursor-not-allowed">
                      <input
                        type="text"
                        value={course}
                        readOnly
                        disabled
                        tabIndex={-1}
                        className="w-full h-10 px-4 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 select-none pointer-events-none focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      clearFieldError("message");
                    }}
                    onBlur={() => {
                      if (!message.trim()) setFieldErrors((prev) => ({ ...prev, message: "Your message is required" }));
                    }}
                    className={`w-full p-4 bg-slate-50 border rounded-xl text-xs font-normal focus:outline-none focus:bg-white transition-all resize-none text-slate-800 ${fieldErrors.message ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-primary"}`}
                  />
                  {fieldErrors.message && <p className="text-[11px] font-medium text-red-500 mt-1">{fieldErrors.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 text-sm font-normal flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all border-0 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <>
                      Submit Details <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-center text-[10px] text-slate-400 font-medium mt-4">
                  By submitting, you agree to our <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Terms & Conditions</a>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}