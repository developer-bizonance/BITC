"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EventRegistrationModalProps {
  children?: React.ReactNode;
  eventId?: string;
  isGeneralUpdate?: boolean;
}

export default function EventRegistrationModal({ children, eventId, isGeneralUpdate }: EventRegistrationModalProps) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

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
          (children as React.ReactElement) || (
            <Button className="inline-flex items-center justify-center h-14 px-10 rounded-full text-white text-lg font-bold shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] border-0">
              Get Event Updates
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-slate-900 mb-2">
            {isGeneralUpdate ? "Get Event Updates" : "Event Registration"}
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
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-900"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-900"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-900"
                placeholder="+91 9876543210"
              />
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
                    placeholder="E.g. XYZ College"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="course" className="block text-sm font-semibold text-slate-700 mb-1">
                      Course
                    </label>
                    <input
                      type="text"
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-900"
                      placeholder="E.g. B.Tech"
                    />
                  </div>
                  <div>
                    <label htmlFor="graduationYear" className="block text-sm font-semibold text-slate-700 mb-1">
                      Grad. Year
                    </label>
                    <input
                      type="text"
                      id="graduationYear"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-900"
                      placeholder="E.g. 2026"
                    />
                  </div>
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
              {status === "loading" ? "Submitting..." : (isGeneralUpdate ? "Subscribe to Updates" : "Submit Registration")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
