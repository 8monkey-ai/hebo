import { SeverityNumber } from "@opentelemetry/api-logs";

export const otelSeverityByLevel = {
  trace: SeverityNumber.TRACE,
  debug: SeverityNumber.DEBUG,
  info: SeverityNumber.INFO,
  warn: SeverityNumber.WARN,
  error: SeverityNumber.ERROR,
} as const satisfies Record<string, SeverityNumber>;
