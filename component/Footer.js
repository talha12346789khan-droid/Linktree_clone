"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { marketingPrefixes } from "@/lib/navMenus";
import { isProfilePath, stripLocaleFromPath } from "@/lib/reservedRoutes";

const Footer = () => {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const path = stripLocaleFromPath(pathname);

  const isMarketingPage = marketingPrefixes.some((prefix) =>
    path?.startsWith(prefix)
  );
  const isProfilePage = isProfilePath(pathname);

  const usePurpleTheme =
    isMarketingPage ||
    isProfilePage ||
    path?.startsWith("/generate") ||
    path?.startsWith("/auth") ||
    path?.startsWith("/support") ||
    path?.startsWith("/admin") ||
    path?.startsWith("/analytics");

  let footerClasses = "mt-auto px-4 py-4 text-center text-sm";

  if (path === "/" || usePurpleTheme) {
    footerClasses +=
      path === "/"
        ? " bg-[#d2e823] text-cyan-800"
        : " bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 text-purple-100";
  } else {
    footerClasses +=
      " bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 text-purple-100";
  }

  return (
    <footer className={footerClasses}>
      <p>{t("copyright")}</p>
    </footer>
  );
};

export default Footer;
