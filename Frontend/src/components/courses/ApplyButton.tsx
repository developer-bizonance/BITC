"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight } from "lucide-react";

interface ApplyButtonProps {
  courseId: string;
  courseTitle: string;
  className?: string;
  children?: React.ReactNode;
}

export function ApplyButton({ courseId, courseTitle, className, children }: ApplyButtonProps) {
  const { openApplyModal } = useAuth();

  return (
    <button
      onClick={() => openApplyModal({ id: courseId, title: courseTitle })}
      className={
        className ||
        "h-14 px-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white text-lg font-bold flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      }
    >
      {children || (
        <>
          Apply Now <ArrowRight className="ml-2 w-5 h-5" />
        </>
      )}
    </button>
  );
}
