import { SeverityNumber } from "@opentelemetry/api-logs";

export const otelSeverityByLevel = {
  trace: SeverityNumber.TRACE,
  debug: SeverityNumber.DEBUG,
  info: SeverityNumber.INFO,
  warn: SeverityNumber.WARN,
  error: SeverityNumber.ERROR,
} as const satisfies Record<string, SeverityNumber>;

export const parseLogLevel = (raw: string): LogLevel => {
  if (!(raw in otelSeverityByLevel)) {
    throw new Error(
      `Unsupported LOG_LEVEL "${raw}". Must be one of: ${Object.keys(otelSeverityByLevel).join(", ")}`,
    );
  }
  return raw as LogLevel;
};

export type LogLevel = keyof typeof otelSeverityByLevel;
