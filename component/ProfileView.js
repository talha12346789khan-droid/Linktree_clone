"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { ToastContainer } from "react-toastify";
import LinkIconComponent from "@/component/LinkIcon";
import ProfileReviews from "@/component/ProfileReviews";

export default function ProfileView({
  profile,
  initialReviews,
  initialSummary,
}) {
  const { handle, picture, links, userId } = profile;
  const trackingRef = useRef(false);

  const openTrackedLink = useCallback(
    async (index, fallbackUrl) => {
      if (trackingRef.current) return;
      trackingRef.current = true;

      // Open a tab synchronously on click (required so popup blockers allow it).
      // After the POST returns, point that tab at the real URL.
      let tab = null;
      try {
        tab = window.open("about:blank", "_blank");
      } catch {
        tab = null;
      }

      try {
        const res = await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ h: handle, i: index }),
        });

        const data = await res.json().catch(() => ({}));
        const url =
          data.success && typeof data.url === "string" ? data.url : fallbackUrl;

        if (!url) return;

        if (tab && !tab.closed) {
          tab.location.replace(url);
        } else {
          const second = window.open(url, "_blank", "noopener,noreferrer");
          if (!second) {
            window.location.assign(url);
          }
        }
      } catch {
        if (tab && !tab.closed) {
          try {
            tab.close();
          } catch {
            /* ignore */
          }
        }
        if (fallbackUrl) {
          const w = window.open(fallbackUrl, "_blank", "noopener,noreferrer");
          if (!w) window.location.assign(fallbackUrl);
        }
      } finally {
        trackingRef.current = false;
      }
    },
    [handle]
  );

  return (
    <main className="flex flex-1 flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-4 md:p-6">
      <ToastContainer />
      <div className="mx-auto mb-6 w-full max-w-md mt-50 md:mb-10">
        <div className="rounded-lg bg-white p-6 shadow-2xl text-center">
          {picture && (
            <img
              className="mx-auto h-32 w-32 rounded-full border-4 border-purple-200 object-cover shadow-lg md:h-40 md:w-40"
              src={picture}
              alt={`${handle} profile`}
            />
          )}
          <h1 className="mt-4 text-2xl font-bold text-gray-800">@{handle}</h1>
          <p className="mt-1 text-sm text-purple-600">Link in bio</p>
        </div>

        <div className="mt-6 w-full space-y-3">
          {links?.length > 0 ? (
            links.map((linkItem, index) => (
              <button
                key={index}
                type="button"
                onClick={() => openTrackedLink(index, linkItem.url)}
                className="block w-full cursor-pointer text-left"
              >
                <div className="flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl md:py-4 md:text-base">
                  <span className="flex-shrink-0">
                    <LinkIconComponent linkName={linkItem.name} />
                  </span>
                  <span>{linkItem.name}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-lg bg-white/90 py-6 text-center text-gray-600 shadow-lg">
              No links added yet
            </div>
          )}
        </div>

        <div className="mt-6">
          <ProfileReviews
            handle={handle}
            ownerUserId={userId}
            initialReviews={initialReviews}
            initialSummary={initialSummary}
          />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/support"
            className="text-sm font-semibold text-purple-100 underline-offset-2 hover:text-white hover:underline"
          >
            Need help? Contact customer support →
          </Link>
        </div>
      </div>
    </main>
  );
}
