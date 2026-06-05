import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import "../globals.css";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { Providers } from "../providers";
import { routing, isRtlLocale } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = {
  metadataBase: new URL("https://linktree-clone-murex-chi.vercel.app"),
  verification: {
    google: "6K3CppAo8my14wPDGqfgIHU-2kw8o646p_MUzItTz1Y",
  },
  title: "LinkTree Clone ",
  description:
    "Create your personal link in bio page with LinkTree Clone. Share all your important links from Instagram, TikTok, YouTube & more in one place. Free and easy!",
  keywords: [
    "link in bio",
    "linktree alternative",
    "bio link",
    "link management",
    "social media links",
    "profile links",
  ],
  authors: [{ name: "LinkTree Clone" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://linktree-clone-murex-chi.vercel.app",
    siteName: "LinkTree Clone",
    title: "LinkTree Clone - Create Your Link in Bio",
    description:
      "Share all your important links in one place. 50M+ people use link-in-bio pages.",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "LinkTree Clone - Link in Bio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkTree Clone - Create Your Link in Bio",
    description:
      "Share all your important links in one place. Create your link in bio now!",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "https://linktree-clone-murex-chi.vercel.app",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              {children}
              <Footer />
            </div>
            <SpeedInsights />
            <Analytics />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
