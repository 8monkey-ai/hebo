import { Elysia } from "elysia";

import { isProduction, logLevel } from "../env";
import { createOtelLogger } from "../lib/otel";
import { createServiceLogger } from "../utils/otel/logger-factory";
import { getPathnameFromUrl } from "../utils/url";

export type ServiceLogger = ReturnType<typeof createServiceLogger>;

const getRequestMeta = (request: Request) => ({
  method: request.method,
  path: getPathnameFromUrl(request.url),
});

export const logger = (
  serviceName: string,
  logger = createServiceLogger(createOtelLogger(serviceName, logLevel)),
) => {
  const app = new Elysia({ name: "hebo-logging" }).decorate("logger", logger);

  if (!isProduction) {
    app.onRequest(({ request }) => {
      logger.info(getRequestMeta(request), "request:incoming");
    });
  }

  return app
    .onError(({ request, error, set }) => {
      logger.error(
        {
          ...getRequestMeta(request),
          status: typeof set.status === "number" ? set.status : 500,
          err: error,
        },
        "request:error",
      );
    })
    .as("scoped");
};
