import { API_BASE_URL } from "@/lib/env";

export function resolveMediaUrl(url?: string | null) {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${apiOrigin}${url}`;
}