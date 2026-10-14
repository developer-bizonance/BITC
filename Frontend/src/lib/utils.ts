import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Canonical API base URL helper — loaded strictly from environment variable with safe fallback */
export const getApiBase = (): string => {
  const envApi = process.env.NEXT_PUBLIC_API_URL;
  if (envApi && typeof envApi === "string") {
    return envApi.trim().replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
    return "https://bitcapi.bizonance.com/api";
  }

  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return "https://bitcapi.bizonance.com/api";
  }

  return "http://localhost:5000/api";
};

/** Canonical site URL helper — loaded from environment variable with fallback */
export const getSiteUrl = (): string => {
  const envSite = process.env.NEXT_PUBLIC_SITE_URL;
  if (envSite && typeof envSite === "string") {
    return envSite.trim().replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return window.location.origin;
    }
  }

  return "https://bitc.bizonance.com";
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
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const normalized = trimmed.replace(/\\/g, "/");
  const cleanPath = normalized.startsWith("/") ? normalized : `/${normalized}`;
  // If it's an uploaded file on the backend, point to the backend server
  if (cleanPath.startsWith("/uploads/")) {
    return `${getServerBase()}${cleanPath}`;
  }
  // Otherwise, it's a static frontend asset
  return cleanPath;
}
