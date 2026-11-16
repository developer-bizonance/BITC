"use client";
import { ChevronRight, ChevronDown } from 'lucide-react';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getApiBase } from "@/lib/utils";
import { INDIAN_STATES, fetchStates, fetchCities } from "@/data/indianStatesCities";

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
  const [availableStates, setAvailableStates] = useState<string[]>(INDIAN_STATES);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    customCity: "",
    area: "",
    address: "",
    profession: "",
    college: "",
    education: "",
    course: "",
    graduationYear: "",
    eventId: eventId || "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchStates().then((states) => {
      if (states && states.length > 0) setAvailableStates(states);
    });
  }, []);

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state: newState,
      city: "",
      customCity: "",
      area: "",
      address: "",
    }));
    if (fieldErrors.state) {
      setFieldErrors((prev) => ({ ...prev, state: "" }));
    }
    if (fieldErrors.area) {
      setFieldErrors((prev) => ({ ...prev, area: "" }));
    }
    if (newState) {
      const cities = await fetchCities(newState);
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }
  };

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
        if (!value.trim()) return "Contact number is required.";
        if (cleanPhone.length !== 10) return "Contact number must be exactly 10 digits.";
        return "";
      case "state":
        if (!value.trim()) return "State is required.";
        return "";
      case "city":
        if (!value.trim()) return "City is required.";
        return "";
      case "customCity":
        if (formData.city === "CUSTOM" && !value.trim()) return "City name is required.";
        return "";
      case "area":
      case "address":
        if (formData.state && formData.city && !value.trim()) return "Address is required.";
        return "";
      case "profession":
        if (!value.trim()) return "Please select your profession.";
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
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
      ...(name === "area" ? { address: processedValue } : {}),
      ...(name === "city" && value !== "CUSTOM" ? { customCity: "" } : {}),
      ...(name === "city" && value === "" ? { area: "", address: "" } : {}),
      ...(name === "profession" ? { college: processedValue, education: processedValue } : {}),
      ...(name === "college" ? { education: processedValue } : {}),
    }));
    
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
    const requiredKeys = ['name', 'email', 'phone', 'state', 'city', 'profession'];
    if (formData.city === "CUSTOM") requiredKeys.push("customCity");
    if (formData.state && formData.city) requiredKeys.push("area");
    requiredKeys.forEach((key) => {
      const error = validateField(key, (formData as any)[key]);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      setErrorMessage("Please fix the errors in the form before submitting.");
      return;
    }

    try {
      const endpoint = isGeneralUpdate ? `${getApiBase()}/event-subscribers` : `${getApiBase()}/event-registrations`;
      const fallbackEndpoint = isGeneralUpdate ? `/api/event-subscribers` : `/api/event-registrations`;

      const baseCity = formData.city === "CUSTOM" ? formData.customCity.trim() : formData.city.trim();
      const cleanArea = (formData.area || formData.address || "").trim();
      const resolvedCityWithArea = cleanArea ? `${baseCity} (${cleanArea})` : baseCity;

      const submissionData = {
        ...formData,
        city: resolvedCityWithArea,
        area: cleanArea,
        address: cleanArea,
      };
      delete (submissionData as any).customCity;

      let res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!res.ok) {
        try {
          const fbRes = await fetch(fallbackEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submissionData),
          });
          if (fbRes.ok) res = fbRes;
        } catch {
          // Keep primary response
        }
      }

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit.");
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
        setFormData({
          name: "",
          email: "",
          phone: "",
          state: "",
          city: "",
          customCity: "",
          area: "",
          address: "",
          profession: "",
          college: "",
          education: "",
          course: "",
          graduationYear: "",
          eventId: eventId || ""
        });
        setAvailableCities([]);
        setFieldErrors({});
        setErrorMessage("");
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger
        render={
          (children as React.ReactElement) || (
            <Button
              className={
                triggerClassName ||
                "inline-flex items-center justify-center h-14 px-12 rounded-full text-slate-800 text-lg font-normal shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0 cursor-pointer"
              }
            >
              {triggerText || (isGeneralUpdate ? "Subscribe" : "Register Now")}
              {(triggerText === "Register Now" || (!triggerText && !isGeneralUpdate)) && (
                <ChevronRight className="w-4 h-4 ml-1" />
              )}
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 max-h-[95vh] overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-slate-900 mb-2">
            {isGeneralUpdate ? "Subscribe for Event Updates" : "Event Registration"}
          </DialogTitle>
        </DialogHeader>

        {status === "success" ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-600">{isGeneralUpdate ? "Subscribed Successfully!" : "Registration Successful!"}</h3>
            <p className="text-slate-600">
              {isGeneralUpdate ? "You will now receive updates about our upcoming events." : "Thank you for registering. We will be in touch with you shortly."}
            </p>
            <Button onClick={() => handleClose(false)} className="mt-4 w-full rounded-full">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            {!isGeneralUpdate && (
              <div className="select-none">
                <span className="block text-sm font-semibold text-slate-700 mb-1 select-none">
                  Event Name
                </span>
                <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-100 font-medium select-none cursor-not-allowed flex items-center pointer-events-none">
                  {eventName || "General Update"}
                </div>
                <input
                  type="hidden"
                  name="eventName"
                  value={eventName || "General Update"}
                />
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">
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
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-800 ${fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              />
              {fieldErrors.name && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">
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
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-800 ${fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              />
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-600 mb-1">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur("phone")}
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-800 ${fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              />
              {fieldErrors.phone && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.phone}</p>}
            </div>
            
            {/* State & City 2-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-slate-600 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleStateChange}
                    onBlur={() => handleBlur("state")}
                    className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors cursor-pointer ${
                      formData.state === "" ? "text-gray-400" : "text-slate-800 font-medium"
                    } ${fieldErrors.state ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 focus:bg-white'}`}
                  >
                    <option value="" disabled className="text-gray-400">Select State</option>
                    {availableStates.map((st) => (
                      <option key={st} value={st} className="text-slate-800">
                        {st}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {fieldErrors.state && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.state}</p>}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-600 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="city"
                    name="city"
                    required
                    disabled={!formData.state}
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={() => handleBlur("city")}
                    className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      formData.city === "" ? "text-gray-400" : "text-slate-800 font-medium"
                    } ${fieldErrors.city ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 focus:bg-white'}`}
                  >
                    <option value="" disabled className="text-gray-400">{formData.state ? "Select City" : "Select State First"}</option>
                    {availableCities.map((ct) => (
                      <option key={ct} value={ct} className="text-slate-800">
                        {ct}
                      </option>
                    ))}
                    {formData.state && <option value="CUSTOM" className="text-slate-800">+ Enter Custom City</option>}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {fieldErrors.city && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.city}</p>}
              </div>
            </div>

            {formData.city === "CUSTOM" && (
              <div>
                <label htmlFor="customCity" className="block text-sm font-medium text-slate-600 mb-1">
                  Enter City Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="customCity"
                  name="customCity"
                  required
                  placeholder="Enter your city"
                  value={formData.customCity}
                  onChange={handleChange}
                  onBlur={() => handleBlur("customCity")}
                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-800 ${fieldErrors.customCity ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                />
                {fieldErrors.customCity && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.customCity}</p>}
              </div>
            )}

            {/* Show Address after State and City are selected */}
            {Boolean(formData.state && formData.city && (formData.city !== "CUSTOM" || formData.customCity.trim().length > 0)) && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <label htmlFor="area" className="block text-sm font-medium text-slate-600 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  onBlur={() => handleBlur("area")}
                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-800 ${fieldErrors.area ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                />
                {fieldErrors.area && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.area}</p>}
              </div>
            )}
            
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-slate-600 mb-1">
                Profession <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="profession"
                  name="profession"
                  required
                  value={formData.profession}
                  onChange={handleChange}
                  onBlur={() => handleBlur("profession")}
                  className={`w-full appearance-none rounded-xl border px-4 py-2.5 pr-10 text-sm outline-none transition focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer ${
                    formData.profession === "" ? "text-gray-400" : "text-slate-800 font-medium"
                  } ${fieldErrors.profession ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 focus:bg-white"}`}
                >
                  <option value="" disabled className="text-gray-400">Select your profession</option>
                  <option value="Business Owner" className="text-slate-800">Business Owner</option>
                  <option value="Self Employed" className="text-slate-800">Self Employed</option>
                  <option value="Working Professional" className="text-slate-800">Working Professional</option>
                  <option value="Student" className="text-slate-800">Student</option>
                  <option value="Other" className="text-slate-800">Other</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {fieldErrors.profession && <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.profession}</p>}
            </div>

            {status === "error" && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full h-10 mt-4 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 text-sm font-normal flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Submitting..." : isGeneralUpdate ? "Subscribe" : "Submit Details"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
