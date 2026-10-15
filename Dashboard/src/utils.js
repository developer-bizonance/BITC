export const getApiUrl = () => {
  const envApi = import.meta.env.VITE_API_URL;
  if (envApi && typeof envApi === "string") {
    return envApi.trim().replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (!isLocal) {
      return "https://bitcapi.bizonance.com/api";
    }
  }
  return "http://localhost:5000/api";
};

export const getServerBase = () => {
  return getApiUrl().replace(/\/api\/?$/, "");
};

export const resolveImageUrl = (imageUrl, fallback = "") => {
  if (!imageUrl || typeof imageUrl !== "string") return fallback;
  const trimmed = imageUrl.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  
  const normalized = trimmed.replace(/\\/g, "/");
  const cleanPath = normalized.startsWith("/") ? normalized : `/${normalized}`;
  
  if (cleanPath.startsWith("/uploads/")) {
    return `${getServerBase()}${cleanPath}`;
  }

  // If it's a local static logo or icon in public/
  if (cleanPath.startsWith("/logos/")) {
    return cleanPath;
  }

  // If it's a relative path to static assets (e.g. /MERN.jpg)
  if (cleanPath.match(/\.(jpg|jpeg|png|svg|webp|gif)$/i)) {
    const siteUrl =
      import.meta.env.VITE_SITE_URL ||
      (typeof window !== "undefined" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
        ? "https://bitc.bizonance.com"
        : "http://localhost:3000");
    return `${siteUrl.replace(/\/+$/, "")}${cleanPath}`;
  }

  return cleanPath;
};

// ── Hook to highlight records navigating from NotificationCenter ──
import { useState, useEffect } from "react";

export const useRecordHighlight = (targetTab) => {
  const [highlightTarget, setHighlightTarget] = useState(null);

  useEffect(() => {
    let clearTimer = null;

    const applyHighlight = (data) => {
      if (!data) return;
      const isMatch = !targetTab || data.tab === targetTab;
      if (isMatch) {
        setHighlightTarget(data);
        if (clearTimer) clearTimeout(clearTimer);
        clearTimer = setTimeout(() => {
          setHighlightTarget(null);
          try { sessionStorage.removeItem("bitc_highlight_target"); } catch {}
        }, 6000); // Highlight for 6 seconds
      }
    };

    // Check storage on component mount
    try {
      const stored = sessionStorage.getItem("bitc_highlight_target");
      if (stored) {
        const data = JSON.parse(stored);
        const isFresh = Date.now() - (data.timestamp || 0) < 15000;
        if (isFresh) {
          applyHighlight(data);
        }
      }
    } catch {}

    const onHighlightEvent = (e) => {
      applyHighlight(e.detail);
    };

    window.addEventListener("bitc:highlight", onHighlightEvent);

    return () => {
      if (clearTimer) clearTimeout(clearTimer);
      window.removeEventListener("bitc:highlight", onHighlightEvent);
    };
  }, [targetTab]);

  // Auto-scroll highlighted row into view
  useEffect(() => {
    if (highlightTarget) {
      const timer = setTimeout(() => {
        const el = document.querySelector('[data-highlighted="true"]');
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [highlightTarget]);

  const isHighlighted = (item) => {
    if (!highlightTarget || !item) return false;
    const targetId = String(highlightTarget.rawId || "").trim().toLowerCase();
    const targetEmail = String(highlightTarget.email || "").trim().toLowerCase();
    const targetName = String(highlightTarget.name || "").trim().toLowerCase();

    const itemId = String(item.id || item.fullId || item._id || "").trim().toLowerCase();
    const itemEmail = String(item.email || "").trim().toLowerCase();
    const itemName = String(item.name || item.fullName || item.organizationName || item.userName || "").trim().toLowerCase();

    if (targetId && itemId && (itemId === targetId || itemId.includes(targetId) || targetId.includes(itemId))) {
      return true;
    }
    if (targetEmail && itemEmail && itemEmail === targetEmail) {
      return true;
    }
    if (targetName && itemName && (itemName === targetName || itemName.includes(targetName) || targetName.includes(itemName))) {
      return true;
    }
    return false;
  };

  return { highlightTarget, isHighlighted };
};

