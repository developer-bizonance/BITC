"use client";
import { ChevronRight } from 'lucide-react';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EventRegistrationModalProps {
  children?: React.ReactNode;
  triggerText?: string;
  triggerClassName?: string;
  eventId?: string;
  eventName?: string;
  isGeneralUpdate?: boolean;
}

export default function EventRegistrationModal({ children, eventId, eventName, isGeneralUpdate, triggerText, triggerClassName }: EventRegistrationModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    graduationYear: "",
    eventId: eventId || "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Full name is required.";
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
      default:
        return "";
    }
  };

  const handleBlur = (field: string) => {
    const error = validateField(field, (formData as any)[field]);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setStatus("loading");
    setErrorMessage("");

    const errors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      if (['name', 'email', 'phone'].includes(key)) {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/event-registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit registration.");
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      setStatus("error");
      setErrorMessage("Network error. Please try again later.");
    }
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setStatus("idle");
        setFormData({ name: "", email: "", phone: "", college: "", course: "", graduationYear: "", eventId: eventId || "" });
        setErrorMessage("");
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger
        render={
          (triggerText ? <Button className={triggerClassName}>{triggerText}{triggerText === 'Register Now' && <ChevronRight className='w-4 h-4 ml-1' />}</Button> : (children as React.ReactElement)) || (
            <Button className="inline-flex items-center justify-center h-14 px-10 rounded-full text-black text-lg font-medium shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
              Get event updates
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-slate-900 mb-2">
            {isGeneralUpdate ? "Get event updates" : "Event Registration"}
          </DialogTitle>
        </DialogHeader>

        {status === "success" ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{isGeneralUpdate ? "Subscribed Successfully!" : "Registration Successful!"}</h3>
            <p className="text-slate-600">
              {isGeneralUpdate ? "You will now receive updates about our upcoming events." : "Thank you for registering. We will be in touch with you shortly."}
            </p>
            <Button onClick={() => handleClose(false)} className="mt-4 w-full rounded-full">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-900 ${fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                placeholder="Enter your full name"
              />
              {fieldErrors.name && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                Email Id <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-900 ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                placeholder="Enter your email id"
              />
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">
                Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur("phone")}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-900 ${fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                placeholder="Enter your mobile number"
              />
              {fieldErrors.phone && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.phone}</p>}
            </div>
            
            {!isGeneralUpdate && (
              <>
                <div>
                  <label htmlFor="college" className="block text-sm font-semibold text-slate-700 mb-1">
                    College/University
                  </label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-900"
                    placeholder="Enter Your College/University"
                  />
                </div>
                <div>
                  <label htmlFor="eventName" className="block text-sm font-semibold text-slate-700 mb-1">
                    Event Name
                  </label>
                  <input
                    type="text"
                    id="eventName"
                    name="eventName"
                    readOnly
                    value={eventName || "General Update"}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-500 bg-slate-50 cursor-not-allowed"
                  />
                </div>
              </>
            )}

            {status === "error" && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full h-12 mt-4 text-base rounded-full shadow-md shadow-orange-500/20 bg-primary hover:bg-orange-600"
            >
              {status === "loading" ? "Submitting..." : (isGeneralUpdate ? "Subscribe" : "Submit")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
