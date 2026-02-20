import { parseLogLevel } from "./utils/otel/log-levels";

export const authUrl = process.env.AUTH_URL ?? "http://localhost:3000";
export const isProduction = process.env.NODE_ENV === "production";
export const logLevel = parseLogLevel(
  process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
);
