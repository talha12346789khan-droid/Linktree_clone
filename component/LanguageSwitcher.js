"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, routing } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function LanguageSwitcher({ compact = false }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (e) => {
    const next = e.target.value;
    if (next && next !== locale) {
      router.replace(pathname, { locale: next });
    }
  };

  return (
    <label className={compact ? "block w-full" : "relative"}>
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        onChange={onChange}
        className={
          compact
            ? "w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            : "cursor-pointer rounded-full border border-gray-200 bg-white py-1.5 ps-2 pe-7 text-xs font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 md:text-sm"
        }
        aria-label={t("language")}
      >
        {routing.locales.map((code) => (
          <option key={code} value={code}>
            {localeNames[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
