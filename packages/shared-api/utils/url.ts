export function isRootPathUrl(url: string): boolean {
  const slash = url.indexOf("/", 8);
  if (slash === -1) return true;

  const next = slash + 1;
  if (next >= url.length) return true;

  const c = url.codePointAt(next);
  return c === 63 || c === 35;
}
