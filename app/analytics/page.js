"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AnalyticsCharts from "@/component/AnalyticsCharts";

export default function AnalyticsPage() {
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
        <p className="text-lg text-white">Loading...</p>
      </main>
    );
  }

  if (!data && !loading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-6 text-center">
        <h1 className="text-2xl font-bold text-white">No profile yet</h1>
        <p className="mt-2 text-purple-100">
          Create your link in bio first to see analytics.
        </p>
        <Link
          href="/generate"
          className="mt-6 rounded-lg bg-white px-6 py-3 font-bold text-purple-700"
        >
          Go to My Links
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-4 md:p-6">
      <div className="mx-auto w-full max-w-3xl mt-50 md:mt-50">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-white md:text-4xl">
              Your analytics
            </h1>
            <p className="mt-2 text-purple-100">
              Track profile visits and link clicks over time.
            </p>
            {data?.handle && (
              <p className="mt-1 text-sm text-purple-200">
                Profile:{" "}
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
                {days} days
              </button>
            ))}
          </div>
        </div>

        {loading || !data ? (
          <p className="text-center text-white">Loading stats...</p>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-white p-5 text-center shadow-2xl">
                <p className="text-2xl font-bold text-purple-600">
                  {data.profileViews.toLocaleString()}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-600">
                  Profile visits
                </p>
                <p className="mt-1 text-xs text-gray-400">All time</p>
              </div>
              <div className="rounded-lg bg-white p-5 text-center shadow-2xl">
                <p className="text-2xl font-bold text-pink-600">
                  {data.totalClicks.toLocaleString()}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-600">
                  Link clicks
                </p>
                <p className="mt-1 text-xs text-gray-400">All time</p>
              </div>
              <div className="rounded-lg bg-white p-5 text-center shadow-2xl">
                <p className="text-2xl font-bold text-indigo-600">
                  {data.summary?.viewsInRange?.toLocaleString() ?? 0}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-600">
                  Views ({range}d)
                </p>
              </div>
              <div className="rounded-lg bg-white p-5 text-center shadow-2xl">
                <p className="text-2xl font-bold text-violet-600">
                  {data.summary?.clicksInRange?.toLocaleString() ?? 0}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-600">
                  Clicks ({range}d)
                </p>
                {data.summary?.viewsInRange > 0 && (
                  <p className="mt-1 text-xs text-gray-400">
                    CTR {(data.summary.ctr * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>

            <AnalyticsCharts series={data.series} range={range} />

            <div className="rounded-lg bg-white p-6 shadow-2xl">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Link breakdown
              </h2>
              {data.links.length === 0 ? (
                <p className="text-gray-500">No links on your profile yet.</p>
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
                        {link.clicks.toLocaleString()} clicks
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
            ← Edit my links
          </Link>
        </p>
      </div>
    </main>
  );
}
