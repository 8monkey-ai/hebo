import { createErrorResponse } from "@hebo-ai/gateway/endpoints";
import { Elysia } from "elysia";

import { HttpError } from "@hebo/shared-api/errors";

export const errorHandler = new Elysia({ name: "error-handler" })
  .onError(async function handleGatewayError({ error }) {
    if (error instanceof HttpError)
      return createErrorResponse(error.code, error, error.status);

    return createErrorResponse("INTERNAL_SERVER_ERROR", error, 500);
  })
  .as("scoped");
