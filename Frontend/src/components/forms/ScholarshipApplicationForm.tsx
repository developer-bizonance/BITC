"use client";

import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Loader2, ChevronDown } from "lucide-react";
import { getApiBase } from "@/lib/utils";
import DocumentUpload from "@/components/ui/DocumentUpload";

export function ScholarshipApplicationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coursesList, setCoursesList] = useState<Array<{ slug: string; title: string; category: string }>>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const apiBase = getApiBase();
        const [catsRes, coursesRes] = await Promise.allSettled([
          fetch(`${apiBase}/categories`, { cache: "no-store" }),
          fetch(`${apiBase}/courses`, { cache: "no-store" }),
        ]);

        let cats: string[] = [];
        if (catsRes.status === "fulfilled" && catsRes.value.ok) {
          const cData = await catsRes.value.json();
          if (Array.isArray(cData.categories)) {
            cats = cData.categories.map((c: any) => (typeof c === "string" ? c : c.name)?.trim()).filter(Boolean);
          }
        }

        if (coursesRes.status === "fulfilled" && coursesRes.value.ok) {
          const data = await coursesRes.value.json();
          if (Array.isArray(data.courses) && data.courses.length > 0) {
            setCoursesList(data.courses);
            data.courses.forEach((c: any) => {
              if (c.category && !cats.includes(c.category.trim())) {
                cats.push(c.category.trim());
              }
            });
          }
        }

        if (cats.length === 0) {
          try {
            const localRes = await fetch("/api/certifications", { cache: "no-store" });
            if (localRes.ok) {
              const localData = await localRes.json();
              if (Array.isArray(localData.courses) && localData.courses.length > 0) {
                setCoursesList(localData.courses);
                cats = Array.from(new Set(localData.courses.map((c: any) => c.category).filter(Boolean)));
              }
            }
          } catch (e) {}
        }

        setCategoriesList(cats);
      } catch (err) {
        console.warn("Failed to load categories/courses:", err);
      }
    }
    loadData();
  }, []);

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
        if (!value.trim()) return "Contact number is required.";
        if (cleanPhone.length !== 10) return "Contact number must be exactly 10 digits.";
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
        if (!value.trim()) return "Your message is required.";
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

      let success = false;
      let errorMsg = "";

      // 1. Submit to local Next.js route
      let res = await fetch("/api/scholarships/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) success = true;

      // 2. If same-origin returned error/404, fallback to external backend URL (/api/scholarships/apply)
      if (!res.ok) {
        const apiBase = getApiBase();
        const cleanBase = apiBase.replace(/\/api\/?$/, "");
        const fallbackUrl = `${cleanBase}/api/scholarships/apply`;
        try {
          res = await fetch(fallbackUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });
          if (res.ok) success = true;
        } catch (fetchErr) {
          console.warn("Backend direct fetch failed, attempting CMS fallback:", fetchErr);
        }
      }

      // 3. Ultra-resilient Tier 3: If backend endpoint not ready, save directly to live CMS store
      if (res.status === 404) {
        try {
          const apiBase = getApiBase();
          const cleanBase = apiBase.replace(/\/api\/?$/, "");
          const cmsUrl = `${cleanBase}/api/cms/scholarships`;
          const getRes = await fetch(cmsUrl).catch(() => null);
          const currentList = getRes && getRes.ok ? await getRes.json() : [];
          const appId = `SCH-${Date.now().toString().slice(-5)}`;
          const newApp = {
            _id: `sch-${Date.now()}`,
            id: appId,
            fullName: formData.fullName.trim(),
            name: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            city: formData.city.trim(),
            category: formData.category?.trim() || "",
            course: formData.course.trim(),
            message: formData.message?.trim() || "",
            cvFileName: cvFileName || "",
            cvBase64: cvBase64 || "",
            status: "Pending",
            createdAt: new Date().toISOString(),
          };
          const putRes = await fetch(cmsUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: [newApp, ...(Array.isArray(currentList) ? currentList : [])] }),
          }).catch(() => null);

          if (putRes && putRes.ok) {
            res = putRes;
          }
        } catch (cmsErr) {
          console.warn("CMS fallback save notice:", cmsErr);
        }
      }

      // 4. Safely parse JSON or handle errors gracefully without crashing on HTML
      let data: any = {};
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          data = {};
        }
      } else {
        const text = await res.text().catch(() => "");
        if (!res.ok) {
          throw new Error(`Submission server error (${res.status}). Please try again.`);
        }
      }

      if (!res.ok || (data && data.error)) {
        throw new Error((data && data.error) || "Failed to submit application");
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
        <h3 className="text-2xl font-medium text-gray-600 mb-4">Application Submitted!</h3>
        <p className="text-slate-600 mb-2 max-w-sm mx-auto">
          Thank you for applying for the BITC Scholarship. Our team will review your application and contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-5 text-center">
          <h3 className="text-2xl md:text-3xl font-medium text-gray-600 mb-2">Scholarship <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Application</span></h3>
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
              <label className="text-sm font-medium text-slate-600">Name <span className="text-red-500">*</span></label>
              <input required name="fullName" value={formData.fullName} onChange={handleChange} onBlur={() => handleBlur("fullName")} type="text" className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-800 ${fieldErrors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
              {fieldErrors.fullName && <p className="text-xs text-red-500 font-medium">{fieldErrors.fullName}</p>}
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-slate-600">Email Id <span className="text-red-500">*</span></label>
              <input required name="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur("email")} type="email" className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-800 ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
              {fieldErrors.email && <p className="text-xs text-red-500 font-medium">{fieldErrors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-slate-600">Contact Number <span className="text-red-500">*</span></label>
              <input required name="phone" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur("phone")} type="tel" maxLength={10} className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-800 ${fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
              {fieldErrors.phone && <p className="text-xs text-red-500 font-medium">{fieldErrors.phone}</p>}
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-slate-600">City <span className="text-red-500">*</span></label>
              <input required name="city" value={formData.city} onChange={handleChange} onBlur={() => handleBlur("city")} type="text" className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-800 ${fieldErrors.city ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`} />
              {fieldErrors.city && <p className="text-xs text-red-500 font-medium">{fieldErrors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-slate-600">Select certification domain <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  required 
                  name="category"
                  value={formData.category}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData(prev => ({ ...prev, course: "" }));
                  }}
                  onBlur={() => handleBlur("category")}
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer ${
                    !formData.category ? "text-gray-400" : "text-slate-800 font-medium"
                  } ${fieldErrors.category ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
                >
                  <option value="" disabled className="text-gray-400">Select Domain</option>
                  {categoriesList.map((category) => (
                    <option key={category} value={category} className="text-slate-800">{category}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {fieldErrors.category && <p className="text-xs text-red-500 font-medium">{fieldErrors.category}</p>}
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-slate-600">Select Certification <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  required 
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  onBlur={() => handleBlur("course")}
                  disabled={!formData.category}
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    !formData.course ? "text-gray-400" : "text-slate-800 font-medium"
                  } ${fieldErrors.course ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
                >
                  <option value="" disabled className="text-gray-400">Select Certification</option>
                  {coursesList
                    .filter((c) => {
                      if (!c.category || !formData.category) return false;
                      const cc = c.category.trim().toLowerCase();
                      const fc = formData.category.trim().toLowerCase();
                      return cc === fc || cc.replace(/ programs?$/i, "") === fc.replace(/ programs?$/i, "");
                    })
                    .map((course) => (
                      <option key={course.slug || course.title} value={course.title} className="text-slate-800">
                        {course.title}
                      </option>
                    ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {fieldErrors.course && <p className="text-xs text-red-500 font-medium">{fieldErrors.course}</p>}
            </div>
          </div>

          <DocumentUpload
            label="Upload CV (Max 5MB)"
            required
            file={cvFile ? {
              name: cvFile.name,
              size: cvFile.size > 1024 * 1024 ? `${(cvFile.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(cvFile.size / 1024)} KB`
            } : null}
            onFileSelect={(file) => {
              if (file.size > 5 * 1024 * 1024) {
                setFieldErrors((prev) => ({ ...prev, cvFile: "File size exceeds 5MB limit. Please upload a smaller file." }));
                setCvFile(null);
                return;
              }
              setFieldErrors((prev) => {
                const copy = { ...prev };
                delete copy.cvFile;
                return copy;
              });
              setCvFile(file);
            }}
            onFileRemove={() => setCvFile(null)}
            accept=".pdf,.doc,.docx"
            error={fieldErrors.cvFile}
          />

          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-slate-600">Your Message <span className="text-red-500">*</span></label>
            <textarea required name="message" value={formData.message} onChange={handleChange} onBlur={() => handleBlur("message")} rows={3} className={`w-full px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none text-slate-800 ${fieldErrors.message ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}></textarea>
            {fieldErrors.message && <p className="text-xs text-red-500 font-medium">{fieldErrors.message}</p>}
          </div>

          <button disabled={isSubmitting} type="submit" className="w-full h-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 text-sm font-normal flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all mt-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer">
            {isSubmitting ? (
              <span className="flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</span>
            ) : (
              <span className="flex items-center">Submit Details <ArrowRight className="ml-2 w-4 h-4" /></span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
