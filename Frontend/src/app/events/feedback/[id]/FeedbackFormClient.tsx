"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, CalendarDays, Users, Phone, User, CheckCircle2, AlertCircle, ArrowLeft, Frown, Sparkles, Send } from "lucide-react";
import { resolveImageUrl, getApiBase } from "@/lib/utils";
import EventRegistrationModal from "@/components/events/EventRegistrationModal";

interface FeedbackFormClientProps {
  form: {
    id: string;
    eventTitle: string;
    speakerName: string;
    eventDate?: string | null;
    posterUrl?: string | null;
    description?: string | null;
  };
}

export default function FeedbackFormClient({ form }: FeedbackFormClientProps) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const starLabels: Record<number, string> = {
    1: "Needs Improvement",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent & Outstanding!",
  };

  const handleNoAttendance = async () => {
    setAttending(false);
    setErrorMsg(null);
    try {
      const payload = {
        attended: false,
        formId: form.id,
        eventId: (form as any).eventId || null,
        eventTitle: form.eventTitle,
        eventSlug: (form as any).slug || null,
      };
      let res = await fetch(`/api/event-feedback/forms/${form.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        await fetch(`${getApiBase()}/event-feedback/forms/${form.id}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    } catch (e) {
      // Non-blocking log
    }
  };

  const validatePhone = (value: string): boolean => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setPhoneError("Please enter your 10-digit contact number");
      return false;
    }
    if (clean.length !== 10) {
      setPhoneError("Contact number must be exactly 10 digits");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(clean)) {
      setPhoneError("Please enter a valid mobile number starting with 6, 7, 8, or 9");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (!validatePhone(phone)) {
      setErrorMsg(phoneError || "Please enter a valid 10-digit contact number");
      return;
    }
    if (rating === 0) {
      setErrorMsg("Please select a star rating for the event");
      return;
    }

    setSubmitting(true);
    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const payload = {
        attended: true,
        name: name.trim(),
        phone: cleanPhone,
        rating,
        feedback: feedback.trim(),
        formId: form.id,
        eventId: (form as any).eventId || null,
        eventTitle: form.eventTitle,
        eventSlug: (form as any).slug || null,
      };

      let res = await fetch(`/api/event-feedback/forms/${form.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        res = await fetch(`${getApiBase()}/event-feedback/forms/${form.id}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10 md:py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 1. Event Info Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xl shadow-slate-100/60 overflow-hidden relative space-y-5">
          <div className="text-center space-y-2.5 flex flex-col items-center">
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              Event Feedback Form
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {form.eventTitle}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 pt-1">
              {form.speakerName && (
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <Users className="w-4 h-4 text-primary shrink-0" />
                  <span>{form.speakerName}</span>
                </div>
              )}
              {form.eventDate && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    {new Date(form.eventDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {form.description && (
              <p className="text-xs sm:text-sm text-slate-600 pt-2 leading-relaxed whitespace-pre-wrap max-w-xl mx-auto text-center">
                {form.description}
              </p>
            )}
          </div>

          {/* Poster image displayed after the info */}
          {form.posterUrl && (
            <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50 max-h-72 sm:max-h-80">
              <img
                src={resolveImageUrl(form.posterUrl)}
                alt={form.eventTitle}
                className="w-full h-full max-h-72 sm:max-h-80 object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("bitcapi.bizonance.com")) {
                    const clean = form.posterUrl?.startsWith("/") ? form.posterUrl : `/${form.posterUrl}`;
                    target.src = `https://bitcapi.bizonance.com${clean}`;
                  } else {
                    const parent = target.parentElement;
                    if (parent) parent.style.display = "none";
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* 2. Interactive Feedback Flow */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xl shadow-slate-100/60">
          {submitted ? (
            /* Success State Screen */
            <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Thank You for Your Feedback!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your response for <strong>{form.eventTitle}</strong> has been successfully recorded. Your insights help us continuously elevate the quality of BITC programs and workshops!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Question: Are you attending the event today? (Shown only initially before selection) */}
              {attending === null && (
                <div className="space-y-3">
                  <label className="block text-sm sm:text-base font-semibold text-slate-800 text-center sm:text-left">
                    Are you attending the event today? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto sm:mx-0">
                    <button
                      type="button"
                      onClick={() => {
                        setAttending(true);
                        setErrorMsg(null);
                      }}
                      className="py-3 px-4 rounded-2xl font-medium text-sm transition-all flex items-center justify-center gap-2 border cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Yes, I am
                    </button>
                    <button
                      type="button"
                      onClick={handleNoAttendance}
                      className="py-3 px-4 rounded-2xl font-medium text-sm transition-all flex items-center justify-center gap-2 border cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300"
                    >
                      <Frown className="w-4 h-4" />
                      No, I didn't
                    </button>
                  </div>
                </div>
              )}

              {/* Case 1: User chose "No" -> Show "Ohh! You missed a great opportunity!" + Subscribe Now Component */}
              {attending === false && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50 border border-amber-200/70 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-xl sm:text-2xl font-bold text-amber-950">
                        Ohh! You missed a great opportunity!
                      </h3>
                      <p className="text-xs sm:text-sm text-amber-800/90 max-w-md mx-auto leading-relaxed">
                        We missed having you with us today at <strong>{form.eventTitle}</strong> with <strong>{form.speakerName}</strong>.
                        Don't worry! BITC hosts insightful workshops, hackathons, and corporate sessions all year round.
                      </p>
                    </div>
                  </div>

                  {/* Get Notified About Latest Events / Subscribe Now component */}
                  <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                      Get Notified About <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Latest Events</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed font-normal">
                      Stay in the loop with our latest event. Register now to get the latest updates and early access invitations straight to your inbox!
                    </p>
                    <div className="pt-2">
                      <EventRegistrationModal
                        isGeneralUpdate={true}
                        triggerText="Subscribe Now"
                        triggerClassName="inline-flex items-center justify-center h-12 px-8 sm:px-10 rounded-full text-slate-800/85 text-sm sm:text-base font-medium shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Case 2: User chose "Yes" -> Show Full Feedback Form */}
              {attending === true && (
                <form onSubmit={handleSubmit} className="space-y-5 pt-3 animate-in fade-in duration-300">
                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Name & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {phone.length}/10 digits
                        </span>
                      </div>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          required
                          value={phone}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setPhone(clean);
                            if (phoneError) setPhoneError(null);
                          }}
                          onBlur={() => {
                            if (phone) validatePhone(phone);
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white outline-none transition-all ${
                            phoneError
                              ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          }`}
                        />
                      </div>
                      {phoneError && (
                        <p className="text-[11px] text-red-500 font-medium mt-1">
                          {phoneError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rating in the Form of Stars */}
                  <div className="p-4 sm:p-5 bg-amber-50/50 border border-amber-200/60 rounded-2xl text-center space-y-2">
                    <label className="block text-xs font-semibold text-slate-800">
                      How would you rate your event experience? <span className="text-red-500">*</span>
                    </label>

                    {/* Star Rating Group */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const activeStar = hoverRating ? star <= hoverRating : star <= rating;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 cursor-pointer transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                            title={`${star} Star`}
                          >
                            <Star
                              className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors ${
                                activeStar
                                  ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                                  : "text-slate-300 hover:text-amber-200"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Dynamic Label for Selected Rating */}
                    <p className="text-xs font-semibold text-amber-800 min-h-[18px]">
                      {starLabels[hoverRating || rating] || "Click a star to rate"}
                    </p>
                  </div>

                  {/* Feedback Comments */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Feedback / Suggestions
                    </label>
                    <textarea
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-900 font-bold rounded-full text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? "Submitting Your Feedback..." : "Submit Event Feedback"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

