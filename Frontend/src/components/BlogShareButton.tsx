"use client";

import React, { useState, useRef, useEffect } from "react";
import { Share2 } from "lucide-react";
import { FaWhatsapp, FaTwitter, FaFacebookF } from "react-icons/fa";

interface BlogShareButtonProps {
  url: string;
  title: string;
  direction?: "up" | "down";
  align?: "left" | "right";
  className?: string;
}

export default function BlogShareButton({
  url,
  title,
  direction = "up",
  align = "right",
  className = "",
}: BlogShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getFullUrl = () => {
    if (typeof window === "undefined") return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const origin = window.location.origin;
    return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const handleShare = (platform: "whatsapp" | "twitter" | "facebook", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = getFullUrl();
    const shareText = encodeURIComponent(`${title} - BITC`);
    const encodedUrl = encodeURIComponent(fullUrl);

    let shareLink = "";
    if (platform === "whatsapp") {
      shareLink = `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`;
    } else if (platform === "twitter") {
      shareLink = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
    } else if (platform === "facebook") {
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "noopener,noreferrer,width=600,height=500");
    }
    setIsOpen(false);
  };

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const positionClasses = direction === "up" 
    ? "bottom-full mb-2" 
    : "top-full mt-2";

  const alignClasses = align === "left" 
    ? "left-0" 
    : "right-0";

  return (
    <div ref={menuRef} className={`relative inline-block text-left ${className}`}>
      {/* Share Icon Trigger Button */}
      <button
        type="button"
        onClick={toggleOpen}
        title="Share article"
        aria-label="Share article"
        aria-expanded={isOpen}
        className={`w-8 h-8 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-500 hover:text-primary flex items-center justify-center transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 ${
          isOpen ? "bg-slate-100 text-primary border-primary/30 ring-2 ring-primary/10" : ""
        }`}
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>

      {/* Dropdown Options: WhatsApp, Twitter, Facebook */}
      {isOpen && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`absolute ${positionClasses} ${alignClasses} z-50 w-40 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Share on
          </div>

          {/* 1. WhatsApp */}
          <button
            type="button"
            onClick={(e) => handleShare("whatsapp", e)}
            className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
              <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
            </div>
            <span>WhatsApp</span>
          </button>

          {/* 2. Twitter */}
          <button
            type="button"
            onClick={(e) => handleShare("twitter", e)}
            className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center shrink-0">
              <FaTwitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
            </div>
            <span>Twitter</span>
          </button>

          {/* 3. Facebook */}
          <button
            type="button"
            onClick={(e) => handleShare("facebook", e)}
            className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-[#1877F2]/10 flex items-center justify-center shrink-0">
              <FaFacebookF className="w-3 h-3 text-[#1877F2]" />
            </div>
            <span>Facebook</span>
          </button>
        </div>
      )}
    </div>
  );
}
