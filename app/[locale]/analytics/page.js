"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import AnalyticsCharts from "@/component/AnalyticsCharts";

export default function AnalyticsPage() {
  const t = useTranslations("analytics");
  const tCommon = useTranslations("common");
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(7);

  const loadAnalytics = useCallback(async (days) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${days}`);
      const json = await res.json();
      if (json.success) setData(json.result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin?callbackUrl=/analytics");
      return;
    }
    if (status !== "authenticated") return;
    loadAnalytics(range);
  }, [status, router, range, loadAnalytics]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600">
        <p className="text-lg text-white">{tCommon("loading")}</p>
      </main>
    );
  }

  if (!data && !loading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-6 text-center">
        <h1 className="text-2xl font-bold text-white">{t("noProfile")}</h1>
        <p className="mt-2 text-purple-100">{t("noProfileHint")}</p>
        <Link
          href="/generate"
          className="mt-6 rounded-lg bg-white px-6 py-3 font-bold text-purple-700"
        >
          {t("goToLinks")}
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-4 md:p-6">
      <div className="mx-auto w-full max-w-3xl mt-50 md:mt-50">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-center md:text-start">
            <h1 className="text-2xl font-bold text-white md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-2 text-purple-100">{t("subtitle")}</p>
            {data?.handle && (
              <p className="mt-1 text-sm text-purple-200">
                {t("profile")}{" "}
                <Link
                  href={`/${encodeURIComponent(data.handle)}`}
                  className="font-semibold text-white underline"
                >
                  /{data.handle}
                </Link>
              </p>
            )}
          </div>
          <div className="flex justify-center gap-2">
            {[7, 30].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setRange(days)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  range === days
                    ? "bg-white text-purple-700 shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {days === 7 ? t("days7") : t("days30")}
              </button>
            ))}
          </div>
        </div>

        {loading || !data ? (
          <p className="text-center text-white">{t("loadingStats")}</p>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-white p-5 text-center shadow-2xl">
                <p className="text-2xl font-bold text-purple-600">
                  {data.profileViews.toLocaleString()}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-600">
                  {t("profileVisits")}
                </p>
                <p className="mt-1 text-xs text-gray-400">{tCommon("allTime")}</p>
              </div>
              <div className="rounded-lg bg-white p-5 text-center shadow-2xl">
                <p className="text-2xl font-bold text-pink-600">
                  {data.totalClicks.toLocaleString()}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-600">
                  {t("linkClicks")}
                </p>
                <p className="mt-1 text-xs text-gray-400">{tCommon("allTime")}</p>
              </div>
              <div className="rounded-lg bg-white p-5 text-center shadow-2xl">
                <p className="text-2xl font-bold text-indigo-600">
                  {data.summary?.viewsInRange?.toLocaleString() ?? 0}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-600">
                  {t("viewsRange", { days: range })}
                </p>
              </div>
              <div className="rounded-lg bg-white p-5 text-center shadow-2xl">
                <p className="text-2xl font-bold text-violet-600">
                  {data.summary?.clicksInRange?.toLocaleString() ?? 0}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-600">
                  {t("clicksRange", { days: range })}
                </p>
                {data.summary?.viewsInRange > 0 && (
                  <p className="mt-1 text-xs text-gray-400">
                    {t("ctr", {
                      pct: (data.summary.ctr * 100).toFixed(1),
                    })}
                  </p>
                )}
              </div>
            </div>

            <AnalyticsCharts series={data.series} range={range} />

            <div className="rounded-lg bg-white p-6 shadow-2xl">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                {t("linkBreakdown")}
              </h2>
              {data.links.length === 0 ? (
                <p className="text-gray-500">{t("noLinks")}</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.links.map((link, i) => (
                    <li
                      key={i}
                      className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800">
                          {link.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {link.url}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1.5 text-sm font-bold text-white">
                        {t("clicksCount", { count: link.clicks.toLocaleString() })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        <p className="mt-8 text-center">
          <Link
            href="/generate"
            className="text-sm font-semibold text-purple-100 hover:text-white"
          >
            {t("editLinks")}
          </Link>
        </p>
      </div>
    </main>
  );
}
