"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-lg">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function AdminStatsPage() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const { status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      const data = await res.json();
      if (data.success) setStats(data.stats);
      else toast.error(data.message);
    } catch {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin/stats");
      return;
    }
    if (status === "authenticated") loadStats();
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600">
        <p className="text-white">{tCommon("loading")}</p>
      </main>
    );
  }

  if (forbidden) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-6 text-center">
        <h1 className="text-2xl font-bold text-white">{t("accessDenied")}</h1>
        <p className="mt-2 text-purple-100">{t("adminEmailRequired")}</p>
        <Link href="/" className="mt-6 text-white underline">
          {t("goHome")}
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-4 md:p-6">
      <ToastContainer />
      <div className="mx-auto w-full max-w-4xl mt-50">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              {t("statsTitle")}
            </h1>
            <p className="text-sm text-purple-100">{t("statsSubtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadStats}
              className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30"
            >
              {tCommon("refresh")}
            </button>
            <Link
              href="/admin/moderation"
              className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30"
            >
              {tNav("moderation")}
            </Link>
            <Link
              href="/admin/support"
              className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30"
            >
              {tNav("support")}
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-white">{tCommon("loading")}</p>
        ) : stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label={t("siteVisits")}
              value={stats.siteVisits.toLocaleString()}
              hint={t("siteVisitsHint")}
            />
            <StatCard
              label={t("handlesCreated")}
              value={stats.totalHandles.toLocaleString()}
              hint={t("handlesHint")}
            />
            <StatCard
              label={t("usersAccounts")}
              value={stats.totalUsers.toLocaleString()}
              hint={t("usersHint")}
            />
            <StatCard
              label={t("usersWithHandle")}
              value={stats.usersWithHandle.toLocaleString()}
              hint={t("usersWithHandleHint")}
            />
            <StatCard
              label={t("profileViews")}
              value={stats.totalProfileViews.toLocaleString()}
              hint={t("profileViewsHint")}
            />
            <StatCard
              label={t("openReports")}
              value={stats.openReports.toLocaleString()}
              hint={t("openReportsHint")}
            />
            <StatCard
              label={t("bannedUsers")}
              value={stats.bannedUsers.toLocaleString()}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
