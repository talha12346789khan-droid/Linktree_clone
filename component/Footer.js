"use client";

import { usePathname } from "next/navigation";
import { marketingPrefixes } from "@/lib/navMenus";
import { isProfilePath } from "@/lib/reservedRoutes";

const Footer = () => {
  const pathname = usePathname();
  const isMarketingPage = marketingPrefixes.some((prefix) =>
    pathname?.startsWith(prefix)
  );
  const isProfilePage = isProfilePath(pathname);

  const usePurpleTheme =
    isMarketingPage ||
    isProfilePage ||
    pathname?.startsWith("/generate") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/support") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/analytics");

  let footerClasses = "mt-auto px-4 py-4 text-center text-sm";

  if (pathname === "/" || usePurpleTheme) {
    footerClasses +=
      pathname === "/"
        ? " bg-[#d2e823] text-cyan-800"
        : " bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 text-purple-100";
  } else {
    footerClasses +=
      " bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 text-purple-100";
  }

  return (
    <footer className={footerClasses}>
      <p>© 2026 Linktree-clone. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
