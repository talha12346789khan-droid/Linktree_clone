"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCallback, useRef } from "react";
import { ToastContainer } from "react-toastify";
import LinkIconComponent from "@/component/LinkIcon";
import ProfileReviews from "@/component/ProfileReviews";
import { getVisibleLinks } from "@/lib/profileLinks";
import { getTemplateById } from "@/lib/templates";

export default function ProfileView({
  profile,
  initialReviews,
  initialSummary,
}) {
  const t = useTranslations("profile");
  const { handle, picture, links, userId, description, templateId } = profile;
  const theme = getTemplateById(templateId);
  const visibleLinks = getVisibleLinks(links || []);
  const trackingRef = useRef(false);

  const openTrackedLink = useCallback(
    async (originalIndex, fallbackUrl) => {
      if (trackingRef.current) return;
      trackingRef.current = true;

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
          body: JSON.stringify({ h: handle, i: originalIndex }),
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
    <main className={`flex flex-1 flex-col p-4 md:p-6 ${theme.page}`}>
      <ToastContainer />
      <div className="mx-auto mb-6 w-full max-w-md mt-50 md:mb-10">
        <div
          className={`rounded-lg p-6 shadow-2xl text-center border ${theme.card}`}
        >
          {picture && (
            <img
              className={`mx-auto h-32 w-32 rounded-full border-4 object-cover shadow-lg md:h-40 md:w-40 ${theme.avatarBorder}`}
              src={picture}
              alt={`${handle} profile`}
            />
          )}
          <h1 className={`mt-4 text-2xl font-bold ${theme.cardTitle}`}>
            @{handle}
          </h1>
          {description ? (
            <p className={`mt-3 text-sm leading-relaxed ${theme.bio}`}>
              {description}
            </p>
          ) : (
            <p className={`mt-1 text-sm ${theme.cardSub}`}>{t("linkInBio")}</p>
          )}
        </div>

        <div className="mt-6 w-full space-y-3">
          {visibleLinks.length > 0 ? (
            visibleLinks.map((linkItem) => (
              <button
                key={linkItem.originalIndex}
                type="button"
                onClick={() =>
                  openTrackedLink(linkItem.originalIndex, linkItem.url)
                }
                className="block w-full cursor-pointer text-left"
              >
                <div
                  className={`flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3.5 text-sm font-semibold shadow-lg transition md:py-4 md:text-base ${theme.button}`}
                >
                  <span className="flex-shrink-0">
                    <LinkIconComponent linkName={linkItem.name} />
                  </span>
                  <span>{linkItem.name}</span>
                </div>
              </button>
            ))
          ) : (
            <div
              className={`rounded-lg py-6 text-center shadow-lg ${theme.card}`}
            >
              <p className={theme.bio}>{t("noLinks")}</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <ProfileReviews
            handle={handle}
            ownerUserId={userId}
            initialReviews={initialReviews}
            initialSummary={initialSummary}
            theme={theme}
          />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/support"
            className="text-sm font-semibold text-white/90 underline-offset-2 hover:text-white hover:underline"
          >
            {t("needHelp")}
          </Link>
        </div>
      </div>
    </main>
  );
}
