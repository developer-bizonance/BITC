"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
import { getApiBase } from "@/lib/utils";
import DocumentUpload from "@/components/ui/DocumentUpload";

export function PartnerWithUsForm({ onSuccess, type = "corporate" }: { onSuccess?: () => void; type?: "educational" | "corporate" }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mouFile, setMouFile] = useState<{ name: string; size: string; data: string } | null>(null);
  const [uploadingMou, setUploadingMou] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "",
    website: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: any): string => {
    switch (field) {
      case "organizationName":
      case "contactPerson":
      case "designation":
      case "message":
        if (!value || typeof value !== 'string' || !value.trim()) return "This field is required.";
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

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, mou: "File size exceeds 5MB limit. Please upload a smaller file." }));
      return;
    }

    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    setUploadingMou(true);
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy.mou;
      return copy;
    });

    const reader = new FileReader();
    reader.onload = async () => {
      let finalUrl = reader.result as string;

      try {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("image", file);
        const uploadRes = await fetch(`${getApiBase()}/upload?category=mou`, {
          method: "POST",
          body: uploadData,
        });
        if (uploadRes.ok) {
          const resData = await uploadRes.json();
          if (resData.url || resData.path) {
            finalUrl = resData.url || resData.path;
          }
        }
      } catch (uploadErr) {
        console.warn("Direct upload notice (using data URL fallback):", uploadErr);
      }

      setMouFile({
        name: file.name,
        size: sizeStr,
        data: finalUrl,
      });
      setUploadingMou(false);
    };
    reader.readAsDataURL(file);
  };

  const removeMouFile = () => {
    setMouFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, (formData as any)[key]);
      if (error) errors[key] = error;
    });

    if (!mouFile) {
      errors.mou = "Please upload an MoU document.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        type: type,
        ...formData,
        partnershipType: "MoU Collaboration",
        mouFile: mouFile?.data || "",
        mouFileName: mouFile?.name || "",
        mouFileSize: mouFile?.size || "",
      };

      let success = false;

      // 1. Submit to central backend API
      try {
        const res = await fetch(`${getApiBase()}/partnership-applications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) success = true;
      } catch (apiErr) {
        console.warn("Direct partnership API notice:", apiErr);
      }

      // 2. Fallback to local Next.js route ONLY IF backend failed
      if (!success) {
        try {
          const localRes = await fetch("/api/partnership-applications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          if (localRes.ok) success = true;
        } catch (localErr) {
          console.warn("Local partnership notice:", localErr);
        }
      }

      if (success) {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 md:p-12 text-center h-full flex flex-col justify-center items-center rounded-2xl">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">Request received!</h3>
        <p className="text-slate-600 mb-8 max-w-sm mx-auto">
          Thank you for your interest in partnering with BITC. Our {type === "educational" ? "academic relations" : "corporate relations"} team will review your MoU document and reach out to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 sm:p-7 md:p-8 relative overflow-hidden rounded-2xl">
      <div className="mb-4 text-center">
        <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1.5">
          {type === "educational" ? "Academic " : "Corporate "}
          <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Partnership</span>
        </h3>
        <p className="text-slate-600 text-xs md:text-sm">
          {type === "educational"
            ? "Join our network to collaborate on academic initiatives, workshops, and student development."
            : "Join our network to grow your business, train your workforce, or hire skilled talent."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="space-y-1 text-left">
            <label className="text-xs font-medium text-slate-600">
              {type === "educational" ? "Institution Name" : "Business Name"} <span className="text-red-500">*</span>
            </label>
            <input required name="organizationName" value={formData.organizationName} onChange={handleChange} onBlur={() => handleBlur("organizationName")} type="text" className={`w-full px-3.5 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800 ${fieldErrors.organizationName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.organizationName && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.organizationName}</p>}
          </div>
          <div className="space-y-1 text-left">
            <label className="text-xs font-medium text-slate-600">
              {type === "educational" ? "Institution Website" : "Business Website"} <span className="text-red-500">*</span>
            </label>
            <input required name="website" value={formData.website} onChange={handleChange} onBlur={() => handleBlur("website")} type="url" className={`w-full px-3.5 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800 ${fieldErrors.website ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.website && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.website}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="space-y-1 text-left">
            <label className="text-xs font-medium text-slate-600">Contact Person Name <span className="text-red-500">*</span></label>
            <input required name="contactPerson" value={formData.contactPerson} onChange={handleChange} onBlur={() => handleBlur("contactPerson")} type="text" className={`w-full px-3.5 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800 ${fieldErrors.contactPerson ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.contactPerson && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.contactPerson}</p>}
          </div>
          <div className="space-y-1 text-left">
            <label className="text-xs font-medium text-slate-600">Designation <span className="text-red-500">*</span></label>
            <input required name="designation" value={formData.designation} onChange={handleChange} onBlur={() => handleBlur("designation")} type="text" className={`w-full px-3.5 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800 ${fieldErrors.designation ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.designation && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.designation}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="space-y-1 text-left">
            <label className="text-xs font-medium text-slate-600">Email Id <span className="text-red-500">*</span></label>
            <input required name="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur("email")} type="email" className={`w-full px-3.5 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800 ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.email && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.email}</p>}
          </div>
          <div className="space-y-1 text-left">
            <label className="text-xs font-medium text-slate-600">Contact Number <span className="text-red-500">*</span></label>
            <input required name="phone" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur("phone")} type="tel" className={`w-full px-3.5 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm text-slate-800 ${fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
            {fieldErrors.phone && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.phone}</p>}
          </div>
        </div>

        <DocumentUpload
          label="Upload MoU (Max 5MB)"
          required
          file={mouFile}
          onFileSelect={handleFileSelect}
          onFileRemove={removeMouFile}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
          error={fieldErrors.mou}
          uploading={uploadingMou}
        />

        <div className="space-y-1.5 text-left">
          <label className="text-xs font-medium text-slate-600">Your Message <span className="text-red-500">*</span></label>
          <textarea required name="message" value={formData.message} onChange={handleChange} onBlur={() => handleBlur("message")} rows={3} placeholder="Provide brief notes, collaboration objectives, or any key details..." className={`w-full px-3.5 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none text-sm text-slate-800 placeholder:text-gray-400 ${fieldErrors.message ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}></textarea>
          {fieldErrors.message && <p className="text-[10px] text-red-500 font-medium">{fieldErrors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || uploadingMou}
          className="w-full h-12 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 text-sm font-medium flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all mt-3 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Submitting Details...
            </span>
          ) : (
            <>
              Submit Details <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
