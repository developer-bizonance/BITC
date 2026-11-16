import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Canonical API base URL helper — loaded strictly from environment variable with safe fallback */
export const getApiBase = (): string => {
  const envApi = process.env.NEXT_PUBLIC_API_URL;
  let base = (envApi && typeof envApi === "string" ? envApi.trim() : "").replace(/\/+$/, "");

  if (!base) {
    base = process.env.NODE_ENV === "production" ? "https://bitcapi.bizonance.com/api" : "http://localhost:5000/api";
  }

  if (!base.endsWith("/api")) {
    base = `${base}/api`;
  }

  return base;
};

/** Canonical site URL helper — loaded strictly from environment variable with safe fallback */
export const getSiteUrl = (): string => {
  const envSite = process.env.NEXT_PUBLIC_SITE_URL;
  let site = (envSite && typeof envSite === "string" ? envSite.trim() : "").replace(/\/+$/, "");

  if (!site) {
    site = process.env.NODE_ENV === "production" ? "https://bitc.bizonance.com" : "http://localhost:3000";
  }

  return site;
};

export const getServerBase = (): string => {
  return getApiBase().replace(/\/api\/?$/, "");
};

export const API_BASE = getApiBase();
export const SERVER_BASE = getServerBase();

export function resolveImageUrl(
  imageUrl: string | null | undefined,
  fallback = ""
): string {
  if (!imageUrl || typeof imageUrl !== "string") return fallback;
  const trimmed = imageUrl.trim();
  if (!trimmed) return fallback;

  // Handle any uploaded file path (relative or absolute with localhost/remote server)
  if (trimmed.includes("/uploads/")) {
    const uploadRelative = "/uploads/" + trimmed.split("/uploads/")[1];
    return `${getServerBase()}${uploadRelative}`;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const normalized = trimmed.replace(/\\/g, "/");
  const cleanPath = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return cleanPath;
}

export function parseEventEndTimestamp(dateInput: string | Date | null | undefined, timeInput?: string | null): number | null {
  if (!dateInput) return null;
  let year: number;
  let month: number;
  let day: number;

  const str = typeof dateInput === 'string' ? dateInput : (dateInput ? new Date(dateInput).toISOString() : '');
  const dateMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    year = parseInt(dateMatch[1], 10);
    month = parseInt(dateMatch[2], 10) - 1;
    day = parseInt(dateMatch[3], 10);
  } else {
    const d = new Date(dateInput as any);
    if (isNaN(d.getTime())) return null;
    year = d.getFullYear();
    month = d.getMonth();
    day = d.getDate();
  }

  function parseTimeStr(tStr: string, fallbackMeridiem?: string | null): { hours: number; minutes: number } | null {
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

export function parseEventStartTimestamp(dateInput: string | Date | null | undefined, timeInput?: string | null): number {
  if (!dateInput) return 0;
  let year: number;
  let month: number;
  let day: number;

  const str = typeof dateInput === 'string' ? dateInput : (dateInput ? new Date(dateInput).toISOString() : '');
  const dateMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    year = parseInt(dateMatch[1], 10);
    month = parseInt(dateMatch[2], 10) - 1;
    day = parseInt(dateMatch[3], 10);
  } else {
    const d = new Date(dateInput as any);
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

    let fallbackMeridiem: string | null = firstMeridiem;
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

export function isUpcomingEventDate(dateInput: string | Date | null | undefined, timeInput?: string | null): boolean {
  if (!dateInput) return false;
  const endTimestamp = parseEventEndTimestamp(dateInput, timeInput);
  if (!endTimestamp) return false;
  return Date.now() < endTimestamp;
}

export function eventSlug(title?: string | null, id?: string | number): string {
  if (title && typeof title === 'string' && title.trim()) {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/ & /g, '-')
      .replace(/[\/\s_]+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (slug) return slug;
  }
  return id ? String(id) : '';
}

export function matchesEvent(event: any, identifier: string): boolean {
  if (!identifier) return false;
  const decoded = decodeURIComponent(identifier).trim().toLowerCase().replace(/\/+$/, '');

  // 1. Direct ID match
  if (event.id && String(event.id).toLowerCase() === decoded) {
    return true;
  }

  // 2. Slug match on title
  if (event.title) {
    const slug = eventSlug(event.title);
    if (slug.toLowerCase() === decoded) return true;

    const cleanTitle = event.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanId = decoded.replace(/[^a-z0-9]/g, '');
    if (cleanTitle && cleanId && cleanTitle === cleanId) return true;
  }

  return false;
}
