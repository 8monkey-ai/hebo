export const authBaseUrl = process.env.AUTH_BASE_URL ?? `http://localhost:3001`;
export const isAuthEnabled = Boolean(process.env.AUTH_BASE_URL);
export const trustedOrigins = (process.env.AUTH_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean) ?? ["http://localhost:5173", "http://127.0.0.1:5173"];
