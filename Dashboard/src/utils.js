export const getApiUrl = () => {
  const envApi =
    import.meta.env?.VITE_API_URL ||
    (typeof process !== "undefined" && process.env?.VITE_API_URL) ||
    import.meta.env?.NEXT_PUBLIC_API_URL ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL);

  let url = (envApi && typeof envApi === "string" ? envApi.trim() : "").replace(/\/+$/, "");

  if (!url) {
    url = import.meta.env?.DEV ? "http://localhost:5000/api" : "https://bitcapi.bizonance.com/api";
  }

  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }

  return url;
};

export const getSiteUrl = () => {
  const envSite =
    import.meta.env?.VITE_SITE_URL ||
    (typeof process !== "undefined" && process.env?.VITE_SITE_URL) ||
    import.meta.env?.NEXT_PUBLIC_SITE_URL ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SITE_URL);

  let url = (envSite && typeof envSite === "string" ? envSite.trim() : "").replace(/\/+$/, "");

  if (!url) {
    url = import.meta.env?.DEV ? "http://localhost:3000" : "https://bitc.bizonance.com";
  }

  return url;
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
    return `${getSiteUrl()}${cleanPath}`;
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
      const isMatch = !targetTab || 
        data.tab === targetTab || 
        (targetTab === "Career Applications" && data.tab === "Faculty Applications") || 
        (targetTab === "Faculty Applications" && data.tab === "Career Applications");
      if (isMatch) {
        setHighlightTarget(data);
        if (clearTimer) clearTimeout(clearTimer);
        clearTimer = setTimeout(() => {
          setHighlightTarget(null);
          try { sessionStorage.removeItem("bitc_highlight_target"); } catch { }
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
    } catch { }

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

    if (targetId && itemId) {
      return itemId === targetId || itemId.includes(targetId) || targetId.includes(itemId);
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

export const formatWhatsAppUrl = (phone, name = "", customMessage = "") => {
  if (!phone) return "";
  const cleaned = String(phone).replace(/\D/g, "");
  if (!cleaned) return "";
  // If 10 digits (standard Indian mobile number), prepend 91
  const fullNumber = cleaned.length === 10 ? `91${cleaned}` : cleaned;
  const message = customMessage || (name ? `Hello ${name}, this is from BITC (BIZONANCE Industrial Training Centre)...` : `Hello, this is from BITC (BIZONANCE Industrial Training Centre)...`);
  return `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
};

export function parseEventEndTimestamp(dateInput, timeInput) {
  if (!dateInput) return null;
  let year, month, day;

  const str = typeof dateInput === 'string' ? dateInput : (dateInput ? new Date(dateInput).toISOString() : '');
  const dateMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    year = parseInt(dateMatch[1], 10);
    month = parseInt(dateMatch[2], 10) - 1;
    day = parseInt(dateMatch[3], 10);
  } else {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    year = d.getFullYear();
    month = d.getMonth();
    day = d.getDate();
  }

  function parseTimeStr(tStr, fallbackMeridiem) {
    if (!tStr) return null;
    const match = tStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (!match) return null;
    let h = parseInt(match[1], 10);
    const m = match[2] ? parseInt(match[2], 10) : 0;
    const meridiem = (match[3] || fallbackMeridiem || '').toUpperCase();

    if (meridiem === 'PM' && h < 12) h += 12;
    if (meridiem === 'AM' && h === 12) h = 0;
    return { hours: h, minutes: m };
  }

  let endHours = 23;
  let endMinutes = 59;
  let endSeconds = 59;
  let endMs = 999;

  if (timeInput && typeof timeInput === 'string' && timeInput.trim()) {
    const trimmed = timeInput.trim();
    const parts = trimmed.split(/[-–—]|(?:\s+to\s+)/i);

    const firstMeridiem = parts[0]?.match(/(am|pm)/i)?.[1] || null;
    const secondMeridiem = parts[1]?.match(/(am|pm)/i)?.[1] || null;

    if (parts.length > 1) {
      const endParsed = parseTimeStr(parts[parts.length - 1], secondMeridiem || firstMeridiem);
      if (endParsed) {
        endHours = endParsed.hours;
        endMinutes = endParsed.minutes;
        endSeconds = 0;
        endMs = 0;
      }
    } else {
      const startParsed = parseTimeStr(parts[0], firstMeridiem);
      if (startParsed) {
        endHours = startParsed.hours;
        endMinutes = startParsed.minutes;
        endSeconds = 0;
        endMs = 0;
      }
    }
  }

  return new Date(year, month, day, endHours, endMinutes, endSeconds, endMs).getTime();
}

export function parseEventStartTimestamp(dateInput, timeInput) {
  if (!dateInput) return 0;
  let year, month, day;

  const str = typeof dateInput === 'string' ? dateInput : (dateInput ? new Date(dateInput).toISOString() : '');
  const dateMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    year = parseInt(dateMatch[1], 10);
    month = parseInt(dateMatch[2], 10) - 1;
    day = parseInt(dateMatch[3], 10);
  } else {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 0;
    year = d.getFullYear();
    month = d.getMonth();
    day = d.getDate();
  }

  let startHours = 0;
  let startMinutes = 0;

  if (timeInput && typeof timeInput === 'string' && timeInput.trim()) {
    const trimmed = timeInput.trim();
    const parts = trimmed.split(/[-–—]|(?:\s+to\s+)/i);

    const firstMeridiem = parts[0]?.match(/(am|pm)/i)?.[1] || null;
    const secondMeridiem = parts[1]?.match(/(am|pm)/i)?.[1] || null;

    let fallbackMeridiem = firstMeridiem;
    if (!fallbackMeridiem && secondMeridiem) {
      const hMatch = parts[0].trim().match(/^(\d{1,2})/);
      const h = hMatch ? parseInt(hMatch[1], 10) : 0;
      fallbackMeridiem = (h >= 7 && h <= 11) ? 'AM' : secondMeridiem;
    }

    const match = parts[0].trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = match[2] ? parseInt(match[2], 10) : 0;
      const meridiem = (match[3] || fallbackMeridiem || '').toUpperCase();

      if (meridiem === 'PM' && h < 12) h += 12;
      if (meridiem === 'AM' && h === 12) h = 0;
      startHours = h;
      startMinutes = m;
    }
  }

  return new Date(year, month, day, startHours, startMinutes, 0, 0).getTime();
}

export function isUpcomingEventDate(dateInput, timeInput) {
  if (!dateInput) return false;
  const endTimestamp = parseEventEndTimestamp(dateInput, timeInput);
  if (!endTimestamp) return false;
  return Date.now() < endTimestamp;
}

