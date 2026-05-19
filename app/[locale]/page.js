"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import AppRatings from "@/component/AppRatings";
import SiteVisitTracker from "@/component/SiteVisitTracker";

export default function Home() {
  const t = useTranslations("home");
  const router = useRouter();
  const [text, setText] = useState("");

  const createTree = () => {
    if (!text.trim()) {
      alert(t("handleRequired"));
      return;
    }
    router.push(`/generate?handle=${encodeURIComponent(text)}`);
  };

  return (
    <main className="flex flex-1 flex-col bg-[#d2e823]">
      <SiteVisitTracker />
      <section className="grid flex-1 grid-cols-1 gap-8 px-4 md:grid-cols-2 md:gap-0 md:px-0">
        <div className="flex flex-col justify-center md:ms-[10vw] mt-50">
          <p className="text-cyan-800 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            {t("title1")}{" "}
          </p>
          <p className="text-cyan-800 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            {t("title2")}
          </p>
          <p className="text-cyan-800 text-base md:text-lg lg:text-xl my-4 font-semibold leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="input flex flex-col sm:flex-row gap-2 mt-4">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createTree()}
              className="px-4 py-3 focus:outline-cyan-800 rounded-md border border-b-cyan-700 flex-1 text-sm md:text-base"
              type="text"
              placeholder={t("handlePlaceholder")}
            />
            <button
              onClick={() => createTree()}
              className="bg-slate-600 text-white rounded-full py-3 px-6 md:px-8 font-semibold hover:bg-slate-700 hover:cursor-pointer transition w-full sm:w-auto text-sm md:text-base"
            >
              {t("claimCta")}
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center md:me-[10vw] mt-8 md:mt-0">
          <Image
            src="/images/home.png"
            width={400}
            height={400}
            alt="Linktree home"
            priority
            className="w-full max-w-md md:max-w-full h-auto"
          />
        </div>
      </section>

      <AppRatings />
    </main>
  );
}
