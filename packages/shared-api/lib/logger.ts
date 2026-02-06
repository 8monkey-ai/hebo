import { trace } from "@opentelemetry/api";

import { logLevel } from "../env";
import { getSecret } from "../utils/secrets";

const getBetterStackConfig = async () => {
  const [endpoint, sourceToken] = await Promise.all([
    getSecret("BetterStackEndpoint", false),
    getSecret("BetterStackSourceToken", false),
  ]);

  if (!endpoint || !sourceToken) return;

  return {
    url: new URL("/v1/logs", endpoint).toString(),
    sourceToken,
  };
};

const betterStackConfig = await getBetterStackConfig();

// Manually inject trace context because @opentelemetry/instrumentation-pino
// requires --experimental-loader for ESM which Bun doesn't support.
// See: https://github.com/open-telemetry/opentelemetry-js-contrib/issues/1955
const customProps = () => {
  const span = trace.getActiveSpan();
  if (!span) return {};

  const spanContext = span.spanContext();
  return {
    trace_id: spanContext.traceId,
    span_id: spanContext.spanId,
    trace_flags: spanContext.traceFlags.toString(16).padStart(2, "0"),
  };
};

export const getLoggerOptions = (serviceName: string) => {
  if (betterStackConfig) {
    return {
      level: logLevel,
      customProps,
      transport: {
        target: "pino-opentelemetry-transport",
        options: {
          resourceAttributes: { "service.name": serviceName },
          logRecordProcessorOptions: {
            exporterOptions: {
              protobufExporterOptions: {
                url: betterStackConfig.url,
                headers: {
                  Authorization: `Bearer ${betterStackConfig.sourceToken}`,
                },
              },
            },
          },
        },
      },
    };
  }

  return { level: logLevel, customProps };
};
