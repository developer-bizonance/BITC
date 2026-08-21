"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  X, Mail, User, Phone, CheckCircle2,
  ArrowRight, ShieldCheck, BookOpen, AlertCircle, RefreshCw
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
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
  };

  // ---------- Validation helpers ----------
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  // Phone must be exactly 10 digits, no letters/symbols
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
    if (!isValidEmail(email)) errors.email = "Enter a valid email address";
    if (!phone.trim()) errors.phone = "Phone number is required";
    else if (!isValidPhone(phone)) errors.phone = "Enter exactly 10 digits, numbers only";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingCourse) return;
    if (!validateApplyForm()) return;

    setSubmitting(true);
    setErrorMsg(null);

    const res = await applyForCourse(pendingCourse.id, pendingCourse.title, name, email, phone);

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
      <div className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 overflow-y-auto">

          {/* APPLICATION SUCCESS STATE */}
          {appliedRecord ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold tracking-wider uppercase">
                APPLICATION SUBMITTED
              </span>
              <h2 className="text-2xl font-black text-slate-900">Application Received!</h2>
              <p className="text-slate-600 text-sm max-w-sm mx-auto">
                Congratulations <span className="font-bold text-slate-900">{appliedRecord.userName}</span>! Your enrollment application for <span className="font-bold text-primary">{appliedRecord.courseTitle}</span> has been received.
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Application Ref ID:</span>
                  <span className="font-mono font-black text-slate-900">{appliedRecord.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Email:</span>
                  <span className="font-bold text-slate-800">{appliedRecord.userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Status:</span>
                  <span className="font-bold text-emerald-600">Under Admission Review</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Our academic counselor will contact you within 24 hours to complete course orientation and batch scheduling.
              </p>

              <Button
                onClick={handleClose}
                className="w-full h-12 rounded-2xl bg-slate-900 text-white font-extrabold hover:bg-slate-800 mt-2"
              >
                Done & Return to Site
              </Button>
            </div>
          ) : (
            <>
              {/* MODAL TITLE HEADER */}
              <div className="mb-6">
                {pendingCourse && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
                    <BookOpen className="w-3.5 h-3.5" />
                    Applying for: {pendingCourse.title}
                  </div>
                )}

                <h2 className="text-2xl font-black text-slate-900">
                  Course Application
                </h2>
                <p className="text-slate-500 text-xs mt-1 font-medium">
                  Please provide your details below to submit your course application.
                </p>
              </div>

              {/* GLOBAL ERROR MESSAGE */}
              {errorMsg && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-red-800 leading-relaxed">{errorMsg}</p>
                </div>
              )}

              {/* COURSE APPLICATION CONFIRMATION (APPLY) */}
              <form onSubmit={handleApplySubmit} className="space-y-4" noValidate>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => {
                        setName(sanitizeName(e.target.value));
                        clearFieldError("name");
                      }}
                      onBlur={() => {
                        if (!name.trim()) setFieldErrors((prev) => ({ ...prev, name: "Name is required" }));
                      }}
                      className={`w-full h-11 pl-10 pr-4 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white transition-all text-slate-900 ${fieldErrors.name
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-primary"
                        }`}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-[11px] font-bold text-red-600 mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearFieldError("email");
                      }}
                      onBlur={() => {
                        if (!email.trim()) setFieldErrors((prev) => ({ ...prev, email: "Email is required" }));
                      }}
                      className={`w-full h-11 pl-10 pr-4 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white transition-all text-slate-900 ${fieldErrors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-primary"
                        }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] font-bold text-red-600 mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => {
                        setPhone(sanitizePhone(e.target.value));
                        clearFieldError("phone");
                      }}
                      onBlur={() => {
                        if (!phone.trim()) {
                          setFieldErrors((prev) => ({ ...prev, phone: "Phone number is required" }));
                        } else if (!isValidPhone(phone)) {
                          setFieldErrors((prev) => ({ ...prev, phone: "Enter exactly 10 digits, numbers only" }));
                        }
                      }}
                      className={`w-full h-11 pl-10 pr-4 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white transition-all text-slate-900 ${fieldErrors.phone
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-primary"
                        }`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-[11px] font-bold text-red-600 mt-1">{fieldErrors.phone}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-xl bg-slate-900 text-white text-sm font-extrabold hover:bg-slate-800 shadow-md shadow-slate-900/20 border-0 transition-all mt-4"
                >
                  {submitting ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Submit Application <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                
                <p className="text-center text-[10px] text-slate-400 font-medium mt-4">
                  By submitting, you agree to our <a href="#" className="underline hover:text-slate-600">Terms & Conditions</a>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}