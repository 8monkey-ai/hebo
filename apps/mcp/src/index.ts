import { logger } from "@bogeychan/elysia-logger";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import Elysia from "elysia";

import { getGrafanaCloudOtelpConfig } from "@hebo/shared-api/utils/otel";

import { countLetterTool } from "./aikit/count-letter.js";
import { createMcpHandler } from "./aikit/mcp-transport.js";
import hello from "./hello.txt";

const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";
const PORT = Number(process.env.PORT ?? 3003);
const otelConfig = await getGrafanaCloudOtelpConfig();

const mcpServer = new McpServer({ name: "hebo-mcp", version: "0.0.1" });
mcpServer.registerTool(
  countLetterTool.name,
  countLetterTool.config,
  countLetterTool.handler,
);

const createMcp = () =>
  new Elysia()
    .use(
      opentelemetry({
        serviceName: "hebo-mcp",
        spanProcessors: [
          new BatchSpanProcessor(new OTLPTraceExporter(otelConfig)),
        ],
      }),
    )
    .use(logger({ level: LOG_LEVEL }))
    .get("/", () => hello)
    .group("/aikit", (app) =>
      app.post("/", async ({ request, body }) =>
        createMcpHandler(mcpServer)(request, body),
      ),
    );

if (import.meta.main) {
  const mcp = createMcp().listen(PORT);
  console.log(`🐵 Hebo MCP running at ${mcp.server!.url}`);
}

export type Mcp = ReturnType<typeof createMcp>;
