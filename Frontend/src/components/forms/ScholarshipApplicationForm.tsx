"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { courses } from "@/data/courses";

export function ScholarshipApplicationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    category: "",
    course: "",
    message: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "fullName":
        if (!value.trim()) return "Full name is required.";
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Name must contain only letters and spaces.";
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
        return "";
      case "city":
        if (!value.trim()) return "City is required.";
        return "";
      case "category":
        if (!value.trim()) return "Domain is required.";
        return "";
      case "course":
        if (!value.trim()) return "Certification is required.";
        return "";
      case "message":
        if (!value.trim()) return "Message is required.";
        if (value.trim().length < 20) return "Please write a descriptive message (at least 20 chars).";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field: string) => {
    const error = validateField(field, (formData as any)[field]);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "phone") {
      processedValue = processedValue.replace(/\D/g, '').slice(0, 10);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (fieldErrors[name]) {
      const error = validateField(name, processedValue);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    const errors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, (formData as any)[key]);
      if (error) errors[key] = error;
    });

    if (!cvFile) {
      errors["cvFile"] = "CV is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the errors in the form before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      let cvBase64 = "";
      let cvFileName = "";
      if (cvFile) {
        cvBase64 = await toBase64(cvFile);
        cvFileName = cvFile.name;
      }

      const payload = {
        ...formData,
        cvBase64,
        cvFileName
      };

      const res = await fetch("/api/scholarships/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setIsSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        category: "",
        course: "",
        message: "",
      });
      setCvFile(null);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100 text-center h-full flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Application Submitted!</h3>
        <p className="text-slate-600 mb-8 max-w-sm mx-auto">
          Thank you for applying for the BITC Scholarship. Our team will review your application and contact you shortly.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="px-8 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-5 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Scholarship <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Application</span></h3>
          <p className="text-slate-600 text-sm md:text-base">Please fill in your details accurately to apply for the scholarship.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-slate-700">Name <span className="text-red-500">*</span></label>
              <input required name="fullName" value={formData.fullName} onChange={handleChange} onBlur={() => handleBlur("fullName")} type="text" placeholder="Enter your full name" className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium ${fieldErrors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
              {fieldErrors.fullName && <p className="text-xs text-red-500 font-medium">{fieldErrors.fullName}</p>}
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-slate-700">Email <span className="text-red-500">*</span></label>
              <input required name="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur("email")} type="email" placeholder="Enter your Email id" className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
              {fieldErrors.email && <p className="text-xs text-red-500 font-medium">{fieldErrors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-slate-700">Contact <span className="text-red-500">*</span></label>
              <input required name="phone" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur("phone")} type="tel" maxLength={10} placeholder="Enter Your mobile Number" className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium ${fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
              {fieldErrors.phone && <p className="text-xs text-red-500 font-medium">{fieldErrors.phone}</p>}
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-slate-700">City <span className="text-red-500">*</span></label>
              <input required name="city" value={formData.city} onChange={handleChange} onBlur={() => handleBlur("city")} type="text" placeholder="Enter your city" className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium ${fieldErrors.city ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
              {fieldErrors.city && <p className="text-xs text-red-500 font-medium">{fieldErrors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-slate-700">Select certification domain <span className="text-red-500">*</span></label>
              <select 
                required 
                name="category"
                value={formData.category}
                onChange={(e) => {
                  handleChange(e);
                  setFormData(prev => ({ ...prev, course: "" }));
                }}
                onBlur={() => handleBlur("category")}
                className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer ${fieldErrors.category ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
              >
                <option value="" disabled>Select Domain</option>
                {Array.from(new Set(courses.map(c => c.category)))
                  .sort((a, b) => {
                    const order = ["Information Technology", "Digital media technology", "Management Certifications", "Design Certifications"];
                    return order.indexOf(a) - order.indexOf(b);
                  })
                  .map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
              </select>
              {fieldErrors.category && <p className="text-xs text-red-500 font-medium">{fieldErrors.category}</p>}
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-slate-700">Select Certification <span className="text-red-500">*</span></label>
              <select 
                required 
                name="course"
                value={formData.course}
                onChange={handleChange}
                onBlur={() => handleBlur("course")}
                disabled={!formData.category}
                className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${fieldErrors.course ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
              >
                <option value="" disabled>Select Certification</option>
                {courses.filter(c => c.category === formData.category).map(course => (
                  <option key={course.slug} value={course.title}>
                    {course.title}
                  </option>
                ))}
              </select>
              {fieldErrors.course && <p className="text-xs text-red-500 font-medium">{fieldErrors.course}</p>}
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-sm font-semibold text-slate-700">Upload CV <span className="text-red-500">*</span></label>
            <input required onChange={handleFileChange} type="file" accept=".pdf,.doc,.docx" className={`w-full px-4 py-2 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500/10 file:text-orange-700 hover:file:bg-orange-500/20 cursor-pointer text-slate-600 ${fieldErrors.cvFile ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.cvFile && <p className="text-xs text-red-500 font-medium">{fieldErrors.cvFile}</p>}
          </div>

          <div className="space-y-2 text-left">
            <label className="text-sm font-semibold text-slate-700">Message <span className="text-red-500">*</span></label>
            <textarea required name="message" value={formData.message} onChange={handleChange} onBlur={() => handleBlur("message")} rows={3} placeholder="Why do you think you deserve this scholarship?" className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none placeholder:text-slate-400 placeholder:font-medium ${fieldErrors.message ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}></textarea>
            {fieldErrors.message && <p className="text-xs text-red-500 font-medium">{fieldErrors.message}</p>}
          </div>

          <button disabled={isSubmitting} type="submit" className="w-full h-14 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-black text-lg font-medium flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none">
            {isSubmitting ? (
              <span className="flex items-center"><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</span>
            ) : (
              <span className="flex items-center">Submit <ArrowRight className="ml-2 w-5 h-5" /></span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
