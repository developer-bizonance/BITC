"use client";

import React, { createContext, useContext, useState } from "react";

export interface CourseApplyPayload {
  id: string;
  title: string;
}

interface AuthContextType {
  applyForCourse: (courseId: string, courseTitle: string, name: string, email: string, phone: string) => Promise<{ success: boolean; application?: any; error?: string }>;
  
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

  const applyForCourse = async (courseId: string, courseTitle: string, name: string, email: string, phone: string) => {
    try {
      const res = await fetch("/api/courses/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, courseTitle, name, email, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Failed to submit application" };
      }

      return { success: true, application: data.application };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to submit application" };
    }
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
