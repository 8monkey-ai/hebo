// Used in a request hot path; string checks avoid per-request URL allocation.
export function isRootPathUrl(url: string): boolean {
  const schemeIdx = url.indexOf("://");
  const pathStart = url.indexOf("/", schemeIdx === -1 ? 0 : schemeIdx + 3);

  // No explicit path means root.
  if (pathStart === -1) return true;

  const nextIdx = pathStart + 1;
  const nextChar = url.codePointAt(nextIdx);

  // Root when path is "/" and followed by end, query, or hash.
  return (
    nextIdx >= url.length || nextChar === 63 /* ? */ || nextChar === 35 /* # */
  );
}
