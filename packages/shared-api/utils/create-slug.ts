import cryptoRandomString from "crypto-random-string";
import slugify from "slugify";

export const createSlug = (input: string, suffixLength: number = 0): string => {
  const base = slugify(input, { lower: true, strict: true, trim: true });

  if (!suffixLength) return base;

  const suffix = cryptoRandomString({
    length: suffixLength,
    // eslint-disable-next-line no-secrets/no-secrets
    characters: "abcdefghijklmnopqrstuvwxyz0123456789",
  });

  return base ? `${base}-${suffix}` : suffix;
};

export const createOrgSlug = (name: string | null, email: string): string => {
  if (!name) return createSlug(email.split("@")[0].slice(0, 6), 6);
  const parts = name.trim().split(/\s+/);
  const base =
    parts.length > 1
      ? parts[0].slice(0, 3) + parts.at(-1)!.slice(0, 3)
      : name.slice(0, 6);
  return createSlug(base, 6);
};
