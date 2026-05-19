"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
        <p className="text-white">Loading...</p>
      </main>
    );
  }

  if (forbidden) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Access denied</h1>
        <p className="mt-2 text-purple-100">Admin email required in ADMIN_EMAIL.</p>
        <Link href="/" className="mt-6 text-white underline">
          Go home
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
              Site statistics
            </h1>
            <p className="text-sm text-purple-100">
              Overview of visits, accounts, and handles
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadStats}
              className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30"
            >
              Refresh
            </button>
            <Link
              href="/admin/moderation"
              className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30"
            >
              Moderation
            </Link>
            <Link
              href="/admin/support"
              className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30"
            >
              Support
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-white">Loading stats...</p>
        ) : stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Website visits"
              value={stats.siteVisits.toLocaleString()}
              hint="Homepage visits (once per browser session)"
            />
            <StatCard
              label="Handles created"
              value={stats.totalHandles.toLocaleString()}
              hint="Total link-in-bio profiles"
            />
            <StatCard
              label="Users with accounts"
              value={stats.totalUsers.toLocaleString()}
              hint="Signed-in users who created a handle, rated, or reviewed"
            />
            <StatCard
              label="Users with a handle"
              value={stats.usersWithHandle.toLocaleString()}
              hint="Accounts that published a profile"
            />
            <StatCard
              label="Profile page views"
              value={stats.totalProfileViews.toLocaleString()}
              hint="All-time views across every @handle"
            />
            <StatCard
              label="Open review reports"
              value={stats.openReports.toLocaleString()}
              hint="Pending moderation"
            />
            <StatCard
              label="Banned users"
              value={stats.bannedUsers.toLocaleString()}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
