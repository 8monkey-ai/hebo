import { Metadata } from "@grpc/grpc-js";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  LoggerProvider,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";

import { logLevel } from "../env";
import { betterStackConfig } from "./better-stack";
import { createPinoCompatibleOtelLogger } from "./otel-pino-adapter";

const getLogExporterConfig = () => {
  if (!betterStackConfig) {
    console.warn(
      "⚠️ OpenTelemetry Log Exporter not configured. Falling back to console exporter.",
    );
    return;
  }

  const metadata = new Metadata();
  metadata.set("Authorization", `Bearer ${betterStackConfig.sourceToken}`);

  return {
    url: betterStackConfig.endpoint,
    metadata,
    compression: CompressionAlgorithm.GZIP,
  };
};

const createOtelLogger = (serviceName: string) => {
  const logExporterConfig = getLogExporterConfig();
  const logRecordProcessor = logExporterConfig
    ? new BatchLogRecordProcessor(new OTLPLogExporter(logExporterConfig))
    : new SimpleLogRecordProcessor(new ConsoleLogRecordExporter());

  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      "service.name": serviceName,
    }),
    processors: [logRecordProcessor],
  });

  return loggerProvider.getLogger(serviceName);
};

export const createLogger = (serviceName: string) => {
  return createPinoCompatibleOtelLogger({
    serviceName,
    logLevel,
    createOtelLogger,
  });
};
