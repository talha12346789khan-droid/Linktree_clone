import { locales } from "@/i18n/routing";

export const reservedRoutes = new Set([
  "product",
  "templates",
  "marketplace",
  "learn",
  "pricing",
  "generate",
  "auth",
  "support",
  "admin",
  "analytics",
  "api",
  ...locales,
]);

export function isProfilePath(pathname) {
  if (!pathname || pathname === "/") return false;
  const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);
  if (segments.length !== 2) return false;
  const [maybeLocale, maybeHandle] = segments;
  if (!locales.includes(maybeLocale)) return false;
  return !reservedRoutes.has(maybeHandle.toLowerCase());
}

export function stripLocaleFromPath(pathname) {
  if (!pathname) return "/";
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    return "/" + segments.slice(1).join("/") || "/";
  }
  return pathname;
}
