import { defineRouting } from "next-intl/routing";

export const locales = [
  "en",
  "ur",
  "hi",
  "ja",
  "es",
  "ar",
  "fr",
  "de",
  "pt",
  "tr",
  "zh",
];

export const rtlLocales = ["ar", "ur"];

export const localeNames = {
  en: "English",
  ur: "اردو",
  hi: "हिन्दी",
  ja: "日本語",
  es: "Español",
  ar: "العربية",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  tr: "Türkçe",
  zh: "简体中文",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

export function isRtlLocale(locale) {
  return rtlLocales.includes(locale);
}
