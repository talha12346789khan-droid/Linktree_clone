"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";

export default function AdminModerationPage() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const { status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [banned, setBanned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [banForm, setBanForm] = useState({
    userId: "",
    userEmail: "",
    userName: "",
    reason: "",
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [reportsRes, banRes] = await Promise.all([
        fetch("/api/admin/reports"),
        fetch("/api/admin/ban"),
      ]);
      if (reportsRes.status === 403 || banRes.status === 403) {
        setForbidden(true);
        return;
      }
      const reportsData = await reportsRes.json();
      const banData = await banRes.json();
      if (reportsData.success) setReports(reportsData.reports);
      if (banData.success) setBanned(banData.banned);
    } catch {
      toast.error("Failed to load moderation data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin/moderation");
      return;
    }
    if (status === "authenticated") loadAll();
  }, [status, router]);

  const resolveReport = async (reportId, action) => {
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        loadAll();
      } else toast.error(data.message);
    } catch {
      toast.error("Action failed");
    }
  };

  const banUser = async (e) => {
    e.preventDefault();
    if (!banForm.userId && !banForm.userEmail) {
      toast.error("Provide userId or email");
      return;
    }
    try {
      const res = await fetch("/api/admin/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setBanForm({ userId: "", userEmail: "", userName: "", reason: "" });
        loadAll();
      } else toast.error(data.message);
    } catch {
      toast.error("Ban failed");
    }
  };

  const banFromReport = (report) => {
    setBanForm({
      userId: report.reviewUserId || "",
      userEmail: report.reviewUserEmail || "",
      userName: report.reviewUserName || "",
      reason: `Spam review on @${report.handle}`,
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const unbanUser = async (user) => {
    const params = new URLSearchParams();
    if (user.userId) params.set("userId", user.userId);
    if (user.userEmail) params.set("userEmail", user.userEmail);
    try {
      const res = await fetch(`/api/admin/ban?${params}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        loadAll();
      } else toast.error(data.message);
    } catch {
      toast.error("Unban failed");
    }
  };

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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              {t("moderationTitle")}
            </h1>
            <p className="text-purple-100 text-sm">{t("moderationSubtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/stats"
              className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30"
            >
              {tNav("siteStats")} →
            </Link>
            <Link
              href="/admin/support"
              className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30"
            >
              {t("supportInbox")} →
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-white">{tCommon("loading")}</p>
        ) : (
          <>
            <section className="mb-8 rounded-xl bg-white p-5 shadow-xl">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {t("openReportsTitle", { count: reports.length })}
              </h2>
              {reports.length === 0 ? (
                <p className="text-sm text-gray-500">{t("noOpenReports")}</p>
              ) : (
                <ul className="space-y-4">
                  {reports.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-lg border border-gray-100 p-4"
                    >
                      <p className="text-xs text-gray-500">
                        @{r.handle} · {t("reportedBy")} {r.reporterName}
                        {r.reporterRole === "owner" && (
                          <span className="ms-1 rounded bg-purple-100 px-1.5 py-0.5 font-semibold text-purple-800">
                            {t("profileOwner")}
                          </span>
                        )}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-gray-800">
                        {r.reviewUserName} — {r.reviewRating}★
                      </p>
                      <p className="mt-1 text-sm text-gray-600 italic">
                        &ldquo;{r.reviewComment}&rdquo;
                      </p>
                      <p className="mt-1 text-xs text-amber-700">
                        Reason: {r.reason}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => resolveReport(r.id, "delete_review")}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          {t("deleteReview")}
                        </button>
                        <button
                          type="button"
                          onClick={() => banFromReport(r)}
                          className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          {t("banAuthor")}
                        </button>
                        <button
                          type="button"
                          onClick={() => resolveReport(r.id, "dismiss")}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold"
                        >
                          {t("dismiss")}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mb-8 rounded-xl bg-white p-5 shadow-xl">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {t("bannedTitle", { count: banned.length })}
              </h2>
              {banned.length === 0 ? (
                <p className="text-sm text-gray-500">{t("noBanned")}</p>
              ) : (
                <ul className="space-y-2">
                  {banned.map((b) => (
                    <li
                      key={b.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 p-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold">{b.userName || b.userEmail}</p>
                        <p className="text-xs text-gray-500">
                          {b.userEmail} · {b.reason}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => unbanUser(b)}
                        className="rounded-lg border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800"
                      >
                        {t("unban")}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-xl bg-white p-5 shadow-xl">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t("banUser")}</h2>
              <form onSubmit={banUser} className="space-y-3">
                <input
                  value={banForm.userId}
                  onChange={(e) =>
                    setBanForm({ ...banForm, userId: e.target.value })
                  }
                  placeholder={t("userId")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  value={banForm.userEmail}
                  onChange={(e) =>
                    setBanForm({ ...banForm, userEmail: e.target.value })
                  }
                  placeholder={t("userEmail")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  value={banForm.userName}
                  onChange={(e) =>
                    setBanForm({ ...banForm, userName: e.target.value })
                  }
                  placeholder={t("displayName")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <textarea
                  value={banForm.reason}
                  onChange={(e) =>
                    setBanForm({ ...banForm, reason: e.target.value })
                  }
                  placeholder={t("banReason")}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700"
                >
                  {t("banSubmit")}
                </button>
              </form>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
