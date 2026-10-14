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
