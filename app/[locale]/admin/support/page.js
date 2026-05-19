"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function AdminSupportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/support/admin");
      const data = await res.json();
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      if (data.success) {
        setTickets(data.tickets);
        if (!selectedId && data.tickets.length > 0) {
          setSelectedId(data.tickets[0].id);
        }
      }
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin/support");
      return;
    }
    if (status === "authenticated") loadTickets();
  }, [status, router]);

  const selected = tickets.find((t) => t.id === selectedId);

  const sendReply = async (e) => {
    e.preventDefault();
    if (!selectedId || !replyText.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/support/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedId,
          message: replyText,
          status: "answered",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Reply sent");
        setReplyText("");
        loadTickets();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const closeTicket = async () => {
    if (!selectedId || !replyText.trim()) {
      toast.error("Add a closing message in the reply box");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/support/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedId,
          message: replyText,
          status: "closed",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Ticket closed");
        setReplyText("");
        loadTickets();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to close ticket");
    } finally {
      setSending(false);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600">
        <p className="text-lg text-white">Loading...</p>
      </main>
    );
  }

  if (forbidden) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Access denied</h1>
        <p className="mt-2 max-w-md text-purple-100">
          This page is only for the site admin. Set your email in{" "}
          <code className="rounded bg-white/20 px-1">ADMIN_EMAIL</code> in
          .env.local
        </p>
        <Link href="/" className="mt-6 text-white underline">
          Go home
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-4 md:p-6">
      <ToastContainer />
      <div className="mx-auto mb-6 w-full max-w-5xl mt-50 md:mb-10">
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Admin — Customer Support
          </h1>
          <p className="mt-1 text-sm text-purple-100">
            Signed in as {session?.user?.email}
          </p>
        </div>

        {loading ? (
          <p className="text-white">Loading tickets...</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2 rounded-lg bg-white p-4 shadow-2xl max-h-[70vh] overflow-y-auto">
              <h2 className="mb-3 font-bold text-gray-800">
                Tickets ({tickets.length})
              </h2>
              {tickets.length === 0 ? (
                <p className="text-sm text-gray-500">No tickets yet.</p>
              ) : (
                <ul className="space-y-2">
                  {tickets.map((t) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(t.id)}
                        className={`w-full rounded-lg border p-3 text-left text-sm transition ${
                          selectedId === t.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <p className="font-semibold text-gray-800 truncate">
                          {t.subject}
                        </p>
                        <p className="text-xs text-gray-500">{t.userEmail}</p>
                        <span
                          className={`mt-1 inline-block rounded px-1.5 text-xs ${
                            t.status === "open"
                              ? "bg-yellow-100 text-yellow-800"
                              : t.status === "answered"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {t.status}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="lg:col-span-3 rounded-lg bg-white p-6 shadow-2xl">
              {selected ? (
                <>
                  <h2 className="text-xl font-bold text-gray-800">
                    {selected.subject}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    From {selected.userName} ({selected.userEmail})
                  </p>
                  <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                    {selected.message}
                  </div>

                  {selected.replies?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selected.replies.map((reply, i) => (
                        <div
                          key={i}
                          className={`rounded-lg p-3 text-sm ${
                            reply.from === "admin"
                              ? "bg-purple-50 border-l-4 border-purple-500"
                              : "bg-gray-50"
                          }`}
                        >
                          <p className="font-semibold">
                            {reply.from === "admin" ? "You (Admin)" : "Customer"}
                          </p>
                          <p className="mt-1 text-gray-600">{reply.message}</p>
                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(reply.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {selected.status !== "closed" && (
                    <form onSubmit={sendReply} className="mt-6 space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Your reply
                      </label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Type your reply to the customer..."
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="submit"
                          disabled={sending}
                          className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
                        >
                          {sending ? "Sending..." : "Send reply"}
                        </button>
                        <button
                          type="button"
                          onClick={closeTicket}
                          disabled={sending}
                          className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Reply & close
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <p className="text-gray-500">Select a ticket to view details.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
