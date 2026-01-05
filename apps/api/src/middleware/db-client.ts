import { Elysia } from "elysia";

import { createDbClient } from "~api/lib/db/client";

interface DbClientContext {
  organizationId: string;
  userId: string;
}

// Note: Must be used after authService to ensure userId is set
export const dbClient = new Elysia({
  name: "db-client",
})
  .resolve(function resolveDbClient(ctx) {
    return {
      dbClient: createDbClient(
        (ctx as unknown as DbClientContext).organizationId,
        (ctx as unknown as DbClientContext).userId,
      ),
    };
  })
  .as("scoped");

export { type createDbClient } from "~api/lib/db/client";
