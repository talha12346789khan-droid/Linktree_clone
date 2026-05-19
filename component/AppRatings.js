"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import { StarDisplay, StarInput } from "@/component/StarRating";

export default function AppRatings() {
  const { status } = useSession();
  const [ratings, setRatings] = useState([]);
  const [summary, setSummary] = useState({
    count: 0,
    average: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadRatings = async () => {
    try {
      const res = await fetch("/api/app-ratings");
      const data = await res.json();
      if (data.success) {
        setRatings(data.ratings);
        setSummary(data.summary);
      }
    } catch {
      toast.error("Could not load ratings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRatings();
  }, []);

  const submitRating = async (e) => {
    e.preventDefault();
    if (status !== "authenticated") {
      signIn(undefined, { callbackUrl: "/" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/app-ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setComment("");
        await loadRatings();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRating = async (itemId) => {
    if (!window.confirm("Remove your rating and review? This cannot be undone.")) {
      return;
    }
    setDeletingId(itemId);
    try {
      const res = await fetch("/api/app-ratings", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        await loadRatings();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to delete rating");
    } finally {
      setDeletingId(null);
    }
  };

  const total = summary.count || 1;

  return (
    <section className="border-t border-cyan-900/10 bg-[#d2e823] px-4 py-12 md:py-16">
      <ToastContainer />
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-cyan-900 md:text-4xl">
            Rate our app
          </h2>
          <p className="mt-2 text-cyan-800/90 md:text-lg">
            Share your experience with LinkTree Clone. Everyone can see ratings
            here.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-xl bg-white p-6 shadow-lg lg:col-span-2">
            {loading ? (
              <p className="text-gray-500">Loading ratings...</p>
            ) : summary.count > 0 ? (
              <>
                <p className="text-5xl font-bold text-cyan-900">
                  {summary.average}
                </p>
                <StarDisplay rating={summary.average} size="lg" />
                <p className="mt-2 text-sm text-gray-600">
                  Based on {summary.count} rating
                  {summary.count !== 1 ? "s" : ""}
                </p>
                <div className="mt-6 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = summary.distribution[stars] || 0;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={stars} className="flex items-center gap-2 text-sm">
                        <span className="w-8 text-gray-600">{stars}★</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-gray-500">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-gray-500">
                No ratings yet. Be the first to rate the app!
              </p>
            )}
          </div>

          <div className="space-y-6 lg:col-span-3">
            <form
              onSubmit={submitRating}
              className="rounded-xl bg-white p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-800">
                Your rating
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                One rating per account. You can update or remove yours anytime.
              </p>
              {status === "authenticated" ? (
                <>
                  <div className="mt-4">
                    <StarInput
                      value={rating}
                      onChange={setRating}
                      disabled={submitting}
                    />
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="What do you like about LinkTree Clone? (min 10 characters)"
                    className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    disabled={submitting}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-4 w-full rounded-full bg-slate-700 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60 sm:w-auto sm:px-8"
                  >
                    {submitting ? "Submitting..." : "Submit rating"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => signIn(undefined, { callbackUrl: "/" })}
                  className="mt-4 rounded-full bg-slate-700 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800"
                >
                  Sign in to rate
                </button>
              )}
            </form>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-800">
                What users are saying
              </h3>
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : ratings.length === 0 ? (
                <p className="text-sm text-gray-500">No reviews yet.</p>
              ) : (
                <ul className="max-h-80 space-y-4 overflow-y-auto">
                  {ratings.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-lg border border-gray-100 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {item.userName}
                          </span>
                          <StarDisplay rating={item.rating} size="sm" />
                        </div>
                        {item.isMine && (
                          <button
                            type="button"
                            onClick={() => deleteRating(item.id)}
                            disabled={deletingId === item.id}
                            className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {item.comment}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
