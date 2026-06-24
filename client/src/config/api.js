const rawApiUrl = (import.meta.env.VITE_API_URL || "").trim();

export const API = rawApiUrl.replace(/\/$/, "") || (import.meta.env.DEV ? "http://localhost:5000" : "");

export const getApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API}${normalizedPath}`;
};

export const buildApiUrl = (path = "") => {
  if (!API) return path.startsWith("/") ? path : `/${path}`;
  return `${API}${path.startsWith("/") ? path : `/${path}`}`;
};
