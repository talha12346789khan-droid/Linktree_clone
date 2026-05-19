"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";

export default function SupportPage() {
  const t = useTranslations("support");
  const tCommon = useTranslations("common");
  const tAdmin = useTranslations("admin");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/support");
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/support");
      return;
    }
    if (status === "authenticated") loadTickets();
  }, [status, router]);

  const submitTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setSubject("");
        setMessage("");
        loadTickets();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600">
        <p className="text-lg text-white">{tCommon("loading")}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-4 md:p-6">
      <ToastContainer />
      <div className="mx-auto mb-6 w-full max-w-2xl mt-50 md:mb-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-purple-100">{t("subtitle")}</p>
        </div>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-2xl">
          <h2 className="mb-4 text-xl font-bold text-gray-800">{t("newTicket")}</h2>
          <form onSubmit={submitTicket} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                {t("subject")}
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Brief summary of your issue"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                {t("message")}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your issue in detail..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-bold text-white transition hover:shadow-lg disabled:opacity-60"
            >
              {submitting ? t("sending") : t("send")}
            </button>
          </form>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-2xl">
          <h2 className="mb-4 text-xl font-bold text-gray-800">{t("yourTickets")}</h2>
          {loading ? (
            <p className="text-gray-500">{tCommon("loading")}</p>
          ) : tickets.length === 0 ? (
            <p className="text-gray-500">{t("noTickets")}</p>
          ) : (
            <ul className="space-y-4">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="rounded-lg border border-gray-100 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-gray-800">{ticket.subject}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        ticket.status === "closed"
                          ? "bg-gray-200 text-gray-700"
                          : ticket.status === "answered"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{ticket.message}</p>
                  {ticket.replies?.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                      <p className="text-xs font-semibold uppercase text-purple-600">
                        Replies
                      </p>
                      {ticket.replies.map((reply, i) => (
                        <div
                          key={i}
                          className={`rounded-lg p-3 text-sm ${
                            reply.from === "admin"
                              ? "bg-purple-50 border-l-4 border-purple-500"
                              : "bg-gray-50"
                          }`}
                        >
                          <p className="font-semibold text-gray-800">
                            {reply.from === "admin" ? t("supportTeam") : t("you")}
                          </p>
                          <p className="mt-1 text-gray-600">{reply.message}</p>
                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(reply.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-6 text-center">
          <Link href="/" className="text-sm font-semibold text-purple-100 hover:text-white">
            ← {tAdmin("goHome")}
          </Link>
        </p>
      </div>
    </main>
  );
}
