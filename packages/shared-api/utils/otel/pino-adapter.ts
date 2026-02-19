import { otelLogLevels, otelSeverityByLevel } from "./log-levels";

import type { Logger } from "@opentelemetry/api-logs";

const serializeError = (
  err: unknown,
  _seen?: WeakSet<object>,
): Record<string, unknown> => {
  if (!(err instanceof Error)) return { message: String(err) };

  const seen = _seen ?? new WeakSet();
  if (seen.has(err))
    return { name: err.name, message: err.message, circular: true };
  seen.add(err);

  const out: Record<string, unknown> = {};

  for (const k of Object.getOwnPropertyNames(err)) {
    if (k.startsWith("_")) continue;

    let val: unknown;
    try {
      val = (err as any)[k];
    } catch {
      val = "[Unreadable]";
    }

    if (typeof val === "bigint") val = `${val}n`;

    out[String(k)] = val instanceof Error ? serializeError(val, seen) : val;
  }

  return out;
};

type LogLevel = (typeof otelLogLevels)[number];
const getOtelSeverityNumber = (level: LogLevel) => otelSeverityByLevel[level];

const asBody = (value: unknown) =>
  value as NonNullable<Parameters<Logger["emit"]>[0]["body"]>;

const createLogHandler = (
  otelLogger: Logger,
): ((level: LogLevel, ...args: unknown[]) => void) => {
  return (level: LogLevel, ...args: unknown[]) => {
    const severityNumber = getOtelSeverityNumber(level);

    const first = args[0];
    const second = args[1];
    const msg =
      typeof second === "string" && second.length > 0 ? second : undefined;
    let logRecord: Parameters<Logger["emit"]>[0];

    if (typeof first === "string") {
      logRecord = {
        severityNumber,
        body: first,
      };
    } else if (first instanceof Error) {
      logRecord = {
        severityNumber,
        body: asBody({
          ...(msg ? { msg } : {}),
          ...serializeError(first),
        }),
        attributes: { "error.type": first.name },
      };
    } else if (typeof first === "object" && first !== null) {
      const obj = first as Record<string, unknown>;
      const err = obj.err;
      const hasError = err instanceof Error;
      let body = msg ? { msg, ...obj } : obj;
      const attributes = hasError ? { "error.type": err.name } : undefined;

      if (hasError) {
        const rest = { ...obj };
        delete rest.err;
        body = {
          ...(msg ? { msg } : {}),
          ...rest,
          err: serializeError(err),
        };
      }

      logRecord = {
        severityNumber,
        body: asBody(body),
        ...(attributes ? { attributes } : {}),
      };
    } else {
      logRecord = {
        severityNumber,
        body: first === undefined ? "service log" : String(first),
      };
    }
    otelLogger.emit(logRecord);
  };
};

export const createPinoCompatibleOtelLogger = (otelLogger: Logger) => {
  const log = createLogHandler(otelLogger);
  const handlers = {} as Record<LogLevel, (...args: unknown[]) => void>;

  for (const level of otelLogLevels) {
    handlers[level] = (...args: unknown[]) => log(level, ...args);
  }

  return handlers;
};
