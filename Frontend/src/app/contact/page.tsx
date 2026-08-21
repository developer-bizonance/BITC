"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactPage() {
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

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "fullName":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2) return "Full name must be at least 2 characters.";
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Full name must contain only letters and spaces.";
        return "";

      case "email":
        if (!value.trim()) return "Email address is required.";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) return "Please enter a valid email address (e.g. name@gmail.com).";
        return "";

      case "phone":
        const cleanPhone = value.replace(/[^0-9]/g, "");
        if (!value.trim()) return "Phone number is required.";
        if (cleanPhone.length !== 10) return "Phone number must be exactly 10 digits.";
        if (!/^[6-9]\d{9}$/.test(cleanPhone)) return "Mobile number must start with 6, 7, 8, or 9.";
        return "";

      case "city":
        if (!value.trim()) return "City is required.";
        if (value.trim().length < 2) return "City name must be at least 2 characters.";
        return "";

      case "enquiryType":
        if (!value.trim()) return "Please select an enquiry type.";
        return "";

      case "message":
        if (!value.trim()) return "Message is required.";
        if (value.trim().length < 5) return "Message must be at least 5 characters long.";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (field: string, value: any) => {
    let processedValue = typeof value === "string" ? value : String(value ?? "");

    // Restrict phone input to numbers only, max 10 digits
    if (field === "phone") {
      processedValue = processedValue.replace(/[^0-9]/g, "").slice(0, 10);
    }

    setErrorMessage(null);
    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    // Real-time error validation if field was previously touched
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to send message. Please try again.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <section className="bg-white py-16 text-slate-900 text-center border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4">
          <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Contact <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Us</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Have questions about our courses, partnerships, or corporate training? Get in touch with our team today.
          </p>
        </div>
      </section>

      {/* 2. Main Content */}
      <section className="py-16">
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Left Column: Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Get In Touch</h2>
              <p className="text-slate-600 mb-10 leading-relaxed">
                Whether you're looking to upgrade your skills, organize a workshop, or discuss hiring opportunities, we are here to help. Reach out to us through any of the channels below.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">BIZONANCE INDIA PRIVATE LIMITED</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Near Delhi Public School, Ravi Kiran Colony,<br />
                      Saturna, Amravati, MH 444605<br />
                      <span className="text-xs text-slate-500 font-semibold mt-1 inline-block">CIN: U74999MH2017PTC301018</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Contact Number</h3>
                    <p className="text-slate-600 text-sm">
                      <a href="tel:+918956727311" className="hover:text-primary transition-colors font-medium">+91 89567 27311</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Email Address</h3>
                    <p className="text-slate-600 text-sm">
                      <a href="mailto:info@bizonance.in" className="hover:text-primary transition-colors font-medium">info@bizonance.in</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Container */}
              <div className="mt-12 rounded-2xl overflow-hidden shadow-md border border-slate-200 h-[280px] bg-slate-100 relative group">
                <iframe
                  title="BIZONANCE Location Map"
                  src="https://maps.google.com/maps?q=20.911,77.7443+(BIZONANCE)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
                <a
                  href="https://www.google.com/maps/search/BIZONANCE/@20.911,77.7443,17z?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-slate-800 hover:text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  View on Google Maps
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>
              
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center flex flex-col items-center">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mb-4" />
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Message Sent Successfully!</h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Thank you, <strong>{formData.fullName || "User"}</strong>! Your message details have been dispatched to <strong>info@bizonance.in</strong>. Our team will contact you shortly.
                  </p>
                  <Button 
                    onClick={() => {
                      setSubmitted(false);
                      setFieldErrors({});
                      setFormData({ fullName: "", email: "", phone: "", city: "", enquiryType: "", message: "" });
                    }} 
                    variant="outline"
                    className="rounded-full px-6"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {errorMessage && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                      <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      onBlur={() => handleBlur("fullName")}
                      className={fieldErrors.fullName ? "border-red-500 ring-1 ring-red-500" : ""}
                    />
                    {fieldErrors.fullName && (
                      <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={fieldErrors.email ? "border-red-500 ring-1 ring-red-500" : ""}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                      <Input
                        id="phone"
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit phone number"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        className={fieldErrors.phone ? "border-red-500 ring-1 ring-red-500" : ""}
                      />
                      {fieldErrors.phone && (
                        <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                      <Input
                        id="city"
                        placeholder="e.g. Amravati"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        onBlur={() => handleBlur("city")}
                        className={fieldErrors.city ? "border-red-500 ring-1 ring-red-500" : ""}
                      />
                      {fieldErrors.city && (
                        <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {fieldErrors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Enquiry Type */}
                  <div className="space-y-2">
                    <Label htmlFor="enquiryType">Enquiry Type <span className="text-red-500">*</span></Label>
                    <Select 
                      onValueChange={(val: any) => {
                        handleChange("enquiryType", val);
                        // Clear any existing error once a value is selected
                        setFieldErrors((prev) => {
                          const updated = { ...prev };
                          delete updated["enquiryType"];
                          return updated;
                        });
                      }} 
                      value={formData.enquiryType}
                    >
                      <SelectTrigger id="enquiryType" className={fieldErrors.enquiryType ? "border-red-500 ring-1 ring-red-500" : ""}>
                        <SelectValue placeholder="Select enquiry type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic Collaboration (MOU)">Academic Collaboration (MOU)</SelectItem>
                        <SelectItem value="Academic Workshops & Bootcamps">Academic Workshops & Bootcamps</SelectItem>
                        <SelectItem value="Faculty Development Program (FDP)">Faculty Development Program (FDP)</SelectItem>
                        <SelectItem value="Industry Visit">Industry Visit</SelectItem>
                        <SelectItem value="Corporate Training">Corporate Training</SelectItem>
                        <SelectItem value="Employee Upskill">Employee Upskill</SelectItem>
                        <SelectItem value="Leadership Program">Leadership Program</SelectItem>
                        <SelectItem value="Hiring Partners / Industry Partnership">Hiring Partners / Industry Partnership</SelectItem>
                        <SelectItem value="Placement & Student Recruitment">Placement & Student Recruitment</SelectItem>
                        <SelectItem value="Scholarship Application">Scholarship Application</SelectItem>
                        <SelectItem value="Course & Certification Inquiry">Course & Certification Inquiry</SelectItem>
                        <SelectItem value="Other Enquiry">Other Enquiry</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldErrors.enquiryType && (
                      <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.enquiryType}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      className={`min-h-[120px] resize-none ${fieldErrors.message ? "border-red-500 ring-1 ring-red-500" : ""}`}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      onBlur={() => handleBlur("message")}
                    />
                    {fieldErrors.message && (
                      <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base font-bold text-white bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0 shadow-lg cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
