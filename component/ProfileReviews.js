"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { StarDisplay, StarInput } from "@/component/StarRating";

export default function ProfileReviews({
  handle,
  ownerUserId,
  initialReviews,
  initialSummary,
  theme,
}) {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [summary, setSummary] = useState(initialSummary);
  const [isProfileOwner, setIsProfileOwner] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [reportingId, setReportingId] = useState(null);

  const isOwner = session?.user?.id && session.user.id === ownerUserId;
  const accent = theme?.reviewsAccent || "text-purple-700";

  useEffect(() => {
    if (isOwner) setIsProfileOwner(true);
  }, [isOwner]);

  const loadReviews = async () => {
    const res = await fetch(`/api/reviews?handle=${encodeURIComponent(handle)}`);
    const data = await res.json();
    if (data.success) {
      setReviews(data.reviews);
      setSummary(data.summary);
      setIsProfileOwner(!!data.isProfileOwner);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (status !== "authenticated") {
      signIn(undefined, { callbackUrl: `/${handle}` });
      return;
    }
    if (isOwner) {
      toast.error("You cannot review your own profile");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setComment("");
        await loadReviews();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId, asOwner = false) => {
    const msg = asOwner
      ? "Remove this review from your profile?"
      : "Delete your review? This cannot be undone.";
    if (!window.confirm(msg)) return;

    setDeletingId(reviewId);
    try {
      const url = `/api/reviews?handle=${encodeURIComponent(handle)}&reviewId=${encodeURIComponent(reviewId)}`;
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        await loadReviews();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const reportReview = async (reviewId) => {
    if (status !== "authenticated") {
      signIn(undefined, { callbackUrl: `/${handle}` });
      return;
    }
    const reason =
      window.prompt("Why are you reporting this review? (spam, harassment, etc.)") ||
      "spam";
    if (!reason.trim()) return;

    setReportingId(reviewId);
    try {
      const res = await fetch("/api/reviews/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, reviewId, reason }),
      });
      const data = await res.json();
      if (data.success) toast.success(data.message);
      else toast.error(data.message);
    } catch {
      toast.error("Failed to submit report");
    } finally {
      setReportingId(null);
    }
  };

  const canModerate = isOwner || isProfileOwner;

  return (
    <div className="w-full rounded-lg bg-white p-5 shadow-2xl md:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-800">Reviews</h2>
        {summary.count > 0 ? (
          <div className="flex items-center gap-2">
            <StarDisplay rating={summary.average} size="lg" />
            <span className={`text-sm font-semibold ${accent}`}>
              {summary.average} ({summary.count} review
              {summary.count !== 1 ? "s" : ""})
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">No reviews yet</span>
        )}
      </div>

      {!isOwner && (
        <form
          onSubmit={submitReview}
          className="mb-6 rounded-lg border border-purple-100 bg-purple-50/50 p-4"
        >
          <p className="mb-2 text-sm font-semibold text-gray-700">Leave a review</p>
          {status === "authenticated" ? (
            <>
              <StarInput value={rating} onChange={setRating} disabled={submitting} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience (min 10 characters)..."
                rows={3}
                className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting}
                className="mt-3 w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-2.5 text-sm font-bold text-white transition hover:shadow-lg disabled:opacity-60 sm:w-auto sm:px-6"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => signIn(undefined, { callbackUrl: `/${handle}` })}
              className="mt-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-bold text-white"
            >
              Sign in to review
            </button>
          )}
        </form>
      )}

      {isOwner && (
        <p className="mb-4 text-sm text-gray-500">
          You can remove spam reviews from your profile or wait for admin action on
          reports.
        </p>
      )}

      <ul className="space-y-4">
        {reviews.length === 0 ? (
          <li className="py-4 text-center text-sm text-gray-500">
            Be the first to leave a review!
          </li>
        ) : (
          reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-lg border border-gray-100 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">
                    {review.userName}
                  </span>
                  <StarDisplay rating={review.rating} size="sm" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {(review.isMine || canModerate) && (
                    <button
                      type="button"
                      onClick={() =>
                        deleteReview(review.id, canModerate && !review.isMine)
                      }
                      disabled={deletingId === review.id}
                      className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === review.id ? "..." : "Delete"}
                    </button>
                  )}
                  {!review.isMine && !isOwner && status === "authenticated" && (
                    <button
                      type="button"
                      onClick={() => reportReview(review.id)}
                      disabled={reportingId === review.id}
                      className="shrink-0 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-50"
                    >
                      {reportingId === review.id ? "..." : "Report"}
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
