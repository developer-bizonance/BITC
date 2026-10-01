"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";

export function PartnerWithUsForm({ onSuccess, type = "corporate" }: { onSuccess?: () => void; type?: "educational" | "corporate" }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    website: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    partnershipType: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "organizationName":
      case "contactPerson":
      case "designation":
      case "partnershipType":
      case "message":
        if (!value.trim()) return "This field is required.";
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
      case "website":
        if (!value.trim()) return "Website is required.";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field: string) => {
    const error = validateField(field, (formData as any)[field]);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "phone") {
      processedValue = processedValue.replace(/[^0-9]/g, "").slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    
    if (fieldErrors[name]) {
      const error = validateField(name, processedValue);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, (formData as any)[key]);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const res = await fetch("/api/partnership-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: type,
          ...formData
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        if (onSuccess) {
          setTimeout(onSuccess, 3000);
        }
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit form. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 md:p-12 text-center h-full flex flex-col justify-center items-center rounded-2xl">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Request received!</h3>
        <p className="text-slate-600 mb-8 max-w-sm mx-auto">
          Thank you for your interest in partnering with BITC. Our corporate relations team will reach out to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 md:p-6 relative overflow-hidden rounded-2xl">
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-1">Partner <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">with us</span></h3>
        <p className="text-slate-600 text-xs md:text-sm">Join our network to hire talent, train your workforce, or collaborate on tech.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">
              {type === "educational" ? "Institution / College Name" : "Company Name"} <span className="text-red-500">*</span>
            </label>
            <input required name="organizationName" value={formData.organizationName} onChange={handleChange} onBlur={() => handleBlur("organizationName")} type="text" placeholder={type === "educational" ? "Enter institution/college name" : "Enter company name"} className={`w-full px-3 py-2 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm ${fieldErrors.organizationName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.organizationName && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.organizationName}</p>}
          </div>
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">
              {type === "educational" ? "Institution Website" : "Company Website"} <span className="text-red-500">*</span>
            </label>
            <input required name="website" value={formData.website} onChange={handleChange} onBlur={() => handleBlur("website")} type="url" placeholder="https://www.example.com" className={`w-full px-3 py-2 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm ${fieldErrors.website ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.website && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.website}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Contact Person <span className="text-red-500">*</span></label>
            <input required name="contactPerson" value={formData.contactPerson} onChange={handleChange} onBlur={() => handleBlur("contactPerson")} type="text" placeholder="Enter contact person's name" className={`w-full px-3 py-2 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm ${fieldErrors.contactPerson ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.contactPerson && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.contactPerson}</p>}
          </div>
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Designation / Job Title <span className="text-red-500">*</span></label>
            <input required name="designation" value={formData.designation} onChange={handleChange} onBlur={() => handleBlur("designation")} type="text" placeholder="Enter designation or job title" className={`w-full px-3 py-2 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm ${fieldErrors.designation ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.designation && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.designation}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Email Id <span className="text-red-500">*</span></label>
            <input required name="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur("email")} type="email" placeholder="Enter your email id" className={`w-full px-3 py-2 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.email && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.email}</p>}
          </div>
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Contact <span className="text-red-500">*</span></label>
            <input required name="phone" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur("phone")} type="tel" placeholder="Enter your mobile number" className={`w-full px-3 py-2 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm ${fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.phone && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.phone}</p>}
          </div>
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-slate-700">Partnership Type <span className="text-red-500">*</span></label>
          <div className="relative">
            <select required name="partnershipType" value={formData.partnershipType} onChange={handleChange} onBlur={() => handleBlur("partnershipType")} className={`w-full px-3 py-2 pr-10 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer text-sm ${fieldErrors.partnershipType ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
              <option value="" disabled>Select partnership type</option>
              {type === "corporate" ? (
                <>
                  <option value="Campus Hiring">Campus Hiring</option>
                  <option value="Corporate Training / Upskilling">Corporate Training / Upskilling</option>
                  <option value="Tech Consulting & Development">Tech Consulting & Development</option>
                  <option value="Live Project Outsourcing">Live Project Outsourcing</option>
                  <option value="Employer Branding (Hackathons, etc.)">Employer Branding (Hackathons, etc.)</option>
                  <option value="CSR Initiatives">CSR Initiatives</option>
                  <option value="Other">Other</option>
                </>
              ) : (
                <>
                  <option value="Academic MoU / Center of Excellence">Academic MoU / Center of Excellence</option>
                  <option value="Faculty Development Programs">Faculty Development Programs</option>
                  <option value="Workshops & Guest Lectures">Workshops & Guest Lectures</option>
                  <option value="Hackathons & Bootcamps">Hackathons & Bootcamps</option>
                  <option value="Industrial Visits">Industrial Visits</option>
                  <option value="Live projects collaboration">Live projects collaboration</option>
                  <option value="R&D Collaboration">R&D Collaboration</option>
                  <option value="Placement Drives">Placement Drives</option>
                  <option value="Other">Other</option>
                </>
              )}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {fieldErrors.partnershipType && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.partnershipType}</p>}
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-slate-700">Message <span className="text-red-500">*</span></label>
          <textarea required name="message" value={formData.message} onChange={handleChange} onBlur={() => handleBlur("message")} rows={2} placeholder="Write your message here..." className={`w-full px-3 py-2 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none text-sm ${fieldErrors.message ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}></textarea>
          {fieldErrors.message && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.message}</p>}
        </div>

        <button type="submit" className="w-full h-11 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-black text-[15px] font-medium flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all mt-1">
          Submit Details <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
