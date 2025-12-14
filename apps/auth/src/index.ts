import { logger } from "@bogeychan/elysia-logger";
import { cors } from "@elysiajs/cors";
import Elysia from "elysia";

import { auth } from "@hebo/shared-api/lib/auth";
import { corsConfig } from "@hebo/shared-api/middlewares/cors-config";

const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";
const PORT = Number(process.env.PORT ?? 3000);

const createAuth = () =>
  new Elysia()
    .use(logger({ level: LOG_LEVEL }))
    .get("/", () => "🐵 Hebo Auth says hello!")
    .use(cors(corsConfig))
    .group("/v1", (app) => app.mount(auth.handler));

if (import.meta.main) {
  const app = createAuth().listen(PORT);
  console.log(`🐵 Hebo Auth running at ${app.server!.url}`);
}

export type Auth = ReturnType<typeof createAuth>;
