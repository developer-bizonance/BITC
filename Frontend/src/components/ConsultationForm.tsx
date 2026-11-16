"use client";

import { useState } from "react";
import { getApiBase } from "@/lib/utils";

interface ConsultationFormProps {
  theme?: "light" | "dark";
}

export default function ConsultationForm({ theme = "light" }: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    city: "",
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
        if (!value.trim()) return "Contact number is required.";
        if (cleanPhone.length !== 10) return "Contact number must be exactly 10 digits.";
        if (!/^[6-9]\d{9}$/.test(cleanPhone)) return "Contact number must start with 6, 7, 8, or 9.";
        return "";
      case "college":
        if (!value.trim()) return "School / College name is required.";
        if (value.trim().length < 2) return "School / College name must be at least 2 characters.";
        return "";
      case "city":
        if (!value.trim()) return "City is required.";
        if (value.trim().length < 2) return "City must be at least 2 characters.";
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
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        school: formData.college,
        collegeName: formData.college,
        city: formData.city,
        message: formData.topic,
        enquiryType: "Student Consulting",
        courseSlug: "consultation",
      };

      let success = false;
      let errorMsg = "";

      // 1. Primary submit to central backend API
      try {
        const response = await fetch(`${getApiBase()}/inquiries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          success = true;
        } else {
          const data = await response.json().catch(() => ({}));
          errorMsg = data.error || "";
        }
      } catch (apiErr) {
        console.warn("Direct inquiry API notice:", apiErr);
      }

      // 2. Fallback to local Next.js route ONLY IF central backend failed
      if (!success) {
        try {
          const localRes = await fetch("/api/inquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (localRes.ok) {
            success = true;
          } else {
            const data = await localRes.json().catch(() => ({}));
            errorMsg = data.error || errorMsg;
          }
        } catch (localErr) {
          console.warn("Local inquiry notice:", localErr);
        }
      }

      if (success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          college: "",
          city: "",
          topic: "Certification Selection",
        });
      } else {
        throw new Error(errorMsg || "Failed to submit request.");
      }
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  const isDark = theme === "dark";
  const labelClass = `block text-xs sm:text-sm font-medium mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`;
  const inputClass = (fieldName: string) => `w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
    fieldErrors[fieldName]
      ? "border-red-300 bg-red-50 text-slate-900"
      : isDark
      ? "bg-slate-800 border border-slate-700 text-slate-100"
      : "bg-slate-50 border border-slate-200 text-slate-800"
  }`;

  if (status === "success") {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className={`text-xl font-medium mb-1.5 ${isDark ? "text-black" : "text-gray-600"}`}>Request received!</h3>
        <p className={`text-xs sm:text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          Thank you for reaching out. Our career counselors will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-3 mt-1 no-scrollbar" onSubmit={handleSubmit}>
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
        />
        {fieldErrors.name && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.name}</p>}
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
        />
        {fieldErrors.email && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.email}</p>}
      </div>
      <div>
        <label className={labelClass}>Contact Number <span className="text-red-500">*</span></label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          onBlur={() => handleBlur("phone")}
          className={inputClass("phone")}
        />
        {fieldErrors.phone && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.phone}</p>}
      </div>
      <div>
        <label className={labelClass}>School / College Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="college"
          required
          value={formData.college}
          onChange={handleChange}
          onBlur={() => handleBlur("college")}
          className={inputClass("college")}
        />
        {fieldErrors.college && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.college}</p>}
      </div>
      <div>
        <label className={labelClass}>City <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="city"
          required
          value={formData.city}
          onChange={handleChange}
          onBlur={() => handleBlur("city")}
          className={inputClass("city")}
        />
        {fieldErrors.city && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.city}</p>}
      </div>

      {status === "error" && <p className="text-red-500 text-xs sm:text-sm font-medium">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-10 mt-2 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 text-sm font-normal flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Submitting..." : "Submit Details"}
      </button>
    </form>
  );
}
