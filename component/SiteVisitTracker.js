"use client";

import { useEffect } from "react";

/** Count one site visit per browser session on the homepage */
export default function SiteVisitTracker() {
  useEffect(() => {
    const key = "bittree_site_visit_recorded";
    if (typeof window !== "undefined" && sessionStorage.getItem(key)) {
      return;
    }
    fetch("/api/site/visit", { method: "POST" })
      .then(() => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(key, "1");
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
