export const authBaseUrl = process.env.AUTH_BASE_URL ?? `http://localhost:3001`;
export const isAuthEnabled = Boolean(process.env.AUTH_BASE_URL);
