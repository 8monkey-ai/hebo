// Used in a request hot path; string checks avoid per-request URL allocation.
export function isRootPathUrl(url: string): boolean {
  // Elysia passes Request.url as an absolute URL.
  const schemeIdx = url.indexOf("://");
  const slash = url.indexOf("/", schemeIdx === -1 ? 0 : schemeIdx + 3);
  if (slash === -1) return true;

  const next = slash + 1;
  if (next >= url.length) return true;

  const c = url.codePointAt(next);
  return c === 63 /* ? */ || c === 35 /* # */;
}
