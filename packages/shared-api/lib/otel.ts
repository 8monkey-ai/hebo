import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import {
  PrismaInstrumentation,
  registerInstrumentations,
} from "@prisma/instrumentation";

import { betterStackConfig } from "./betterstack";

import type { ElysiaOpenTelemetryOptions } from "@elysiajs/opentelemetry";

const getTraceExporterConfig = () => {
  if (!betterStackConfig) {
    console.warn("⚠️ OpenTelemetry Trace Exporter not configured. Skipping...");
    return;
  }

  return {
    url: new URL("/v1/traces", betterStackConfig.endpoint).toString(),
    headers: { Authorization: `Bearer ${betterStackConfig.sourceToken}` },
    compression: CompressionAlgorithm.GZIP,
  };
};

const traceExporterConfig = getTraceExporterConfig();

registerInstrumentations({
  instrumentations: [new PrismaInstrumentation()],
});

export const getOtelConfig = (
  serviceName: string,
): ElysiaOpenTelemetryOptions => ({
  serviceName,
  spanProcessors: traceExporterConfig
    ? [new BatchSpanProcessor(new OTLPTraceExporter(traceExporterConfig))]
    : undefined,
});
