"use client";

import React, { createContext, useContext, useState } from "react";
import { getApiBase } from "@/lib/utils";

export interface CourseApplyPayload {
  id: string;
  title: string;
}

interface AuthContextType {
  applyForCourse: (courseId: string, courseTitle: string, name: string, email: string, phone: string, city?: string, qualification?: string, specialization?: string, message?: string) => Promise<{ success: boolean; application?: any; error?: string }>;
  
  // Modal state management
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  pendingCourse: CourseApplyPayload | null;
  setPendingCourse: (course: CourseApplyPayload | null) => void;
  openApplyModal: (course: CourseApplyPayload) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCourse, setPendingCourse] = useState<CourseApplyPayload | null>(null);

  const applyForCourse = async (
    courseId: string,
    courseTitle: string,
    name: string,
    email: string,
    phone: string,
    city: string = "",
    qualification: string = "",
    specialization: string = "",
    message: string = ""
  ) => {
    const payload = {
      courseId,
      courseTitle,
      name,
      email,
      phone,
      city,
      qualification,
      specialization,
      message,
    };

    // Tier 1: Next.js internal API Route (/api/courses/apply)
    try {
      const res = await fetch("/api/courses/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        console.warn("[ApplyForCourse] Non-JSON response from /api/courses/apply:", text.slice(0, 100));
      }

      if (res.ok && (data.success || data.application)) {
        return { success: true, application: data.application };
      }
      if (!res.ok && data.error && res.status === 400) {
        // Validation error from server
        return { success: false, error: data.error };
      }
    } catch (tier1Err) {
      console.warn("[ApplyForCourse] Tier 1 Next.js route error:", tier1Err);
    }

    // Tier 2: Direct backend Express API (${getApiBase()}/courses/apply)
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/courses/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {}

      if (res.ok && (data.application || data.message || data.success)) {
        return { success: true, application: data.application };
      }
    } catch (tier2Err) {
      console.warn("[ApplyForCourse] Tier 2 backend route error:", tier2Err);
    }

    // Tier 3: Direct CMS / Neon DB persistence fallback
    try {
      const apiBase = getApiBase();
      const appId = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      const newApp = {
        id: appId,
        fullId: appId,
        userId: `user-${Date.now()}`,
        name: name.trim(),
        userName: name.trim(),
        email: email.trim().toLowerCase(),
        userEmail: email.trim().toLowerCase(),
        phone: cleanPhone,
        userPhone: cleanPhone,
        city: city.trim(),
        qualification: qualification.trim(),
        specialization: specialization.trim(),
        message: message.trim(),
        courseId,
        courseTitle,
        status: "UNDER_REVIEW",
        appliedAt: new Date().toISOString(),
      };

      const cmsRes = await fetch(`${apiBase}/cms/course-applications`);
      let list: any[] = [];
      if (cmsRes.ok) {
        const d = await cmsRes.json();
        list = Array.isArray(d) ? d : (d.data || []);
      }
      list.unshift(newApp);

      const putRes = await fetch(`${apiBase}/cms/course-applications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: list }),
      });

      if (putRes.ok) {
        return { success: true, application: newApp };
      }
    } catch (tier3Err) {
      console.warn("[ApplyForCourse] Tier 3 CMS fallback error:", tier3Err);
    }

    return {
      success: false,
      error: "Failed to submit course application. Please try again or call our admissions team directly.",
    };
  };

  const openApplyModal = (course: CourseApplyPayload) => {
    setPendingCourse(course);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        applyForCourse,
        isAuthModalOpen,
        setIsAuthModalOpen,
        pendingCourse,
        setPendingCourse,
        openApplyModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
