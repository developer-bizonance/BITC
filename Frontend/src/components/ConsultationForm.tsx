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
    topic: "Certification Selection",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2) return "Full name must be at least 2 characters.";
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Full name must contain only letters and spaces.";
        return "";
      case "email":
        if (!value.trim()) return "Email Id is required.";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) return "Please enter a valid Email Id.";
        return "";
      case "phone":
        const cleanPhone = value.replace(/[^0-9]/g, "");
        if (!value.trim()) return "Mobile number is required.";
        if (cleanPhone.length !== 10) return "Mobile number must be exactly 10 digits.";
        if (!/^[6-9]\d{9}$/.test(cleanPhone)) return "Mobile number must start with 6, 7, 8, or 9.";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field: string) => {
    const error = validateField(field, (formData as any)[field]);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "phone") {
      processedValue = processedValue.replace(/[^0-9]/g, "").slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    
    // Clear error as user types
    if (fieldErrors[name]) {
      const error = validateField(name, processedValue);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const errors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'topic') {
        const error = validateField(key, (formData as any)[key]);
        if (error) errors[key] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      setErrorMessage("Please fix the errors in the form before submitting.");
      return;
    }

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
      setFormData({ name: "", email: "", phone: "", topic: "Certification Selection" });
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  const isDark = theme === "dark";
  const labelClass = `block text-sm font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`;
  const inputClass = (fieldName: string) => `w-full rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
    fieldErrors[fieldName]
      ? "border-red-300 bg-red-50 text-slate-900"
      : isDark
      ? "bg-slate-800 border border-slate-700 text-black placeholder:text-slate-500"
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
        <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-black" : "text-slate-900"}`}>Request Received!</h3>
        <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          Thank you for reaching out. Our career counselors will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
      <div>
        <label className={labelClass}>Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          onBlur={() => handleBlur("name")}
          className={inputClass("name")}
          placeholder="Enter your full name"
        />
        {fieldErrors.name && <p className="text-xs text-red-500 mt-1.5 font-medium">{fieldErrors.name}</p>}
      </div>
      <div>
        <label className={labelClass}>Email Id <span className="text-red-500">*</span></label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur("email")}
          className={inputClass("email")}
          placeholder="Enter your email"
        />
        {fieldErrors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{fieldErrors.email}</p>}
      </div>
      <div>
        <label className={labelClass}>Contact <span className="text-red-500">*</span></label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          onBlur={() => handleBlur("phone")}
          className={inputClass("phone")}
          placeholder="Enter your mobile number"
        />
        {fieldErrors.phone && <p className="text-xs text-red-500 mt-1.5 font-medium">{fieldErrors.phone}</p>}
      </div>


      {status === "error" && <p className="text-red-500 text-sm font-medium">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-12 md:h-14 mt-2 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-900 text-base font-medium hover:opacity-90 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
