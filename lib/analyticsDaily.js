/** UTC date key YYYY-MM-DD for daily analytics buckets */
export function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function parseRange(searchParams) {
  const raw = Number(searchParams.get("range"));
  if (raw === 30) return 30;
  return 7;
}

/** Last N calendar days in UTC, oldest first */
export function getDateKeysForRange(days) {
  const keys = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    d.setUTCDate(d.getUTCDate() - i);
    keys.push(getDateKey(d));
  }
  return keys;
}

export function formatChartLabel(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function buildViewsByDay(daily, days) {
  const keys = getDateKeysForRange(days);
  return keys.map((date) => ({
    date,
    label: formatChartLabel(date),
    count: daily?.[date]?.views || 0,
  }));
}

export function buildClicksByDay(daily, days) {
  const keys = getDateKeysForRange(days);
  return keys.map((date) => {
    const clickMap = daily?.[date]?.clicks || {};
    const count = Object.values(clickMap).reduce(
      (sum, n) => sum + (Number(n) || 0),
      0
    );
    return { date, label: formatChartLabel(date), count };
  });
}

export function sumViewsInRange(daily, days) {
  return buildViewsByDay(daily, days).reduce((s, d) => s + d.count, 0);
}

export function sumClicksInRange(daily, days) {
  return buildClicksByDay(daily, days).reduce((s, d) => s + d.count, 0);
}

/** Lifetime clicks per link index for bar chart */
export function buildClicksByLink(links, linkClicks) {
  return (links || []).map((link, index) => ({
    index,
    name: link.name?.trim() || `Link ${index + 1}`,
    clicks: linkClicks[String(index)] || linkClicks[index] || 0,
  }));
}

export function dailyViewIncFields(dateKey = getDateKey()) {
  return {
    "analytics.profileViews": 1,
    [`analytics.daily.${dateKey}.views`]: 1,
  };
}

export function dailyClickIncFields(linkIndex, dateKey = getDateKey()) {
  return {
    [`analytics.linkClicks.${linkIndex}`]: 1,
    [`analytics.daily.${dateKey}.clicks.${linkIndex}`]: 1,
  };
}
