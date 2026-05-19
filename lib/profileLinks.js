/** Normalize link objects for API / DB */
export function normalizeLink(link) {
  return {
    name: (link?.name || "").trim(),
    url: (link?.url || "").trim(),
    enabled: link?.enabled !== false,
  };
}

export function normalizeLinks(links) {
  if (!Array.isArray(links)) return [];
  return links.map(normalizeLink);
}

/** Links shown on public profile (enabled only), with original index for analytics */
export function getVisibleLinks(links) {
  return normalizeLinks(links)
    .map((link, originalIndex) => ({ ...link, originalIndex }))
    .filter((link) => link.enabled && link.name && link.url);
}

/** Links to save: keep rows that have name or url; drop completely empty trailing rows */
export function linksForSave(links) {
  return normalizeLinks(links).filter((l) => l.name || l.url);
}

export function emptyLink() {
  return { name: "", url: "", enabled: true };
}
