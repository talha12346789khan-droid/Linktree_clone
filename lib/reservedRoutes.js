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
]);

export function isProfilePath(pathname) {
  if (!pathname || pathname === "/") return false;
  const segment = pathname.replace(/^\//, "").split("/")[0];
  if (!segment || pathname.includes("/", 1)) return false;
  return !reservedRoutes.has(segment.toLowerCase());
}
