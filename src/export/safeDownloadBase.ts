/** Sanitize document title for use as a download filename (no path separators). */
export function safeDownloadBase(title: string, fallback: string): string {
  const s = title
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return s || fallback;
}
