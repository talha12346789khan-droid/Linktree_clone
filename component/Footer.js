"use client";

import { usePathname } from "next/navigation";
import { marketingPrefixes } from "@/lib/navMenus";

const Footer = () => {
  const pathname = usePathname();
  const isMarketingPage = marketingPrefixes.some((prefix) =>
    pathname?.startsWith(prefix)
  );

  let footerClasses = "mt-auto px-4 py-4 text-center text-sm";

  if (
    pathname === "/" ||
    isMarketingPage ||
    pathname?.startsWith("/generate") ||
    pathname?.startsWith("/auth")
  ) {
    footerClasses +=
      pathname === "/"
        ? " bg-[#d2e823] text-cyan-800"
        : " bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 text-purple-100";
  } else {
    footerClasses +=
      " bg-gradient-to-br from-cyan-800 to-cyan-900 text-cyan-100";
  }

  return (
    <footer className={footerClasses}>
      <p>© 2026 Linktree-clone. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
