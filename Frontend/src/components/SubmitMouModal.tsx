"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, X } from "lucide-react";
import { PartnerWithUsForm } from "@/components/forms/PartnerWithUsForm";

interface SubmitMouButtonProps {
  className?: string;
  label?: string;
}

export function SubmitMouButton({
  className = "",
  label = "Submit MoU",
}: SubmitMouButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modalContent =
    isOpen && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative animate-in zoom-in-95 duration-200 shadow-2xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors z-20 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-3 sm:p-5">
                <PartnerWithUsForm type="corporate" onSuccess={() => setIsOpen(false)} />
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ||
          "inline-flex h-14 px-8 sm:px-10 rounded-full bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-slate-800 font-medium items-center justify-center hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] transition-all shadow-xl shadow-orange-500/20 hover:-translate-y-1 gap-2 cursor-pointer text-base sm:text-lg border-0"
        }
      >
        <span>{label}</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      {modalContent}
    </>
  );
}

export default SubmitMouButton;
