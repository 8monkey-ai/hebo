import { logger } from "@bogeychan/elysia-logger";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { OpenAIErrorSchema } from "@hebo-ai/gateway/endpoints";
import {
  ChatCompletionsBodySchema,
  ChatCompletionsSchema,
} from "@hebo-ai/gateway/endpoints/chat-completions";
import {
  EmbeddingsBodySchema,
  EmbeddingsSchema,
} from "@hebo-ai/gateway/endpoints/embeddings";
import {
  ModelListSchema,
  ModelSchema,
} from "@hebo-ai/gateway/endpoints/models";
import Elysia from "elysia";

import { logLevel } from "@hebo/shared-api/env";
import { corsConfig } from "@hebo/shared-api/lib/cors";
import { getOtelConfig } from "@hebo/shared-api/lib/otel";
import { authService } from "@hebo/shared-api/middlewares/auth";

import { dbClient } from "~api/middleware/db-client";

import { basePath, gw } from "./gateway-config";
import { errorHandler } from "./middlewares/error-handler";

const PORT = Number(process.env.PORT ?? 3002);

// Workaround for Elysia type issue with async handlers returning Response
// See: https://github.com/elysiajs/elysia/issues/1721
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asResponse = <T extends (...args: any[]) => Promise<Response>>(
  handler: T,
) => handler as unknown as (...args: Parameters<T>) => Response;

export const createGateway = () =>
  new Elysia()
    .use(opentelemetry(getOtelConfig("hebo-gateway")))
    .use(logger({ level: logLevel }))
    // Root route ("/") is unauthenticated and unprotected for health checks.
    .get("/", () => "🐵 Hebo AI Gateway says hello!")
    .use(cors(corsConfig))
    .use(
      openapi({
        // FUTURE: document security schemes
        documentation: {
          info: {
            title: "Hebo AI Gateway",
            version: "0.1.0",
          },
        },
      }),
    )
    .use(errorHandler)
    // Public routes (no authentication required)
    .get(
      "/v1/models",
      asResponse(({ request }) => gw.routes["/models"].handler(request)),
      {
        response: {
          200: ModelListSchema,
          400: OpenAIErrorSchema,
          500: OpenAIErrorSchema,
        },
      },
    )
    .get(
      "/v1/models/:modelId",
      asResponse(({ request }) => gw.routes["/models"].handler(request)),
      {
        response: {
          200: ModelSchema,
          400: OpenAIErrorSchema,
          404: OpenAIErrorSchema,
          500: OpenAIErrorSchema,
        },
      },
    )
    .use(authService)
    .group(basePath, { isSignedIn: true }, (app) =>
      app
        .use(dbClient)
        .post(
          "/chat/completions",
          asResponse(({ request, dbClient }) =>
            gw.handler(request, { dbClient }),
          ),
          {
            parse: "none",
            body: ChatCompletionsBodySchema,
            response: {
              200: ChatCompletionsSchema,
              400: OpenAIErrorSchema,
              500: OpenAIErrorSchema,
            },
          },
        )
        .post(
          "/embeddings",
          asResponse(({ request, dbClient }) =>
            gw.handler(request, { dbClient }),
          ),
          {
            parse: "none",
            body: EmbeddingsBodySchema,
            response: {
              200: EmbeddingsSchema,
              400: OpenAIErrorSchema,
              500: OpenAIErrorSchema,
            },
          },
        ),
    );

if (import.meta.main) {
  const app = createGateway().listen(PORT);
  console.log(`🐵 Hebo Gateway running at ${app.server!.url}`);
}

export type Gateway = ReturnType<typeof createGateway>;
