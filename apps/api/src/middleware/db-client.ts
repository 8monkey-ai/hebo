import { Elysia } from "elysia";

import { createDbClient } from "~api/lib/db/client";

// Note: Must be used after authService to ensure userId and organizationId are set
export const dbClient = new Elysia({
  name: "db-client",
})
  .resolve(function resolveDbClient(ctx) {
    const { organizationId, userId } = ctx as unknown as {
      organizationId: string;
      userId: string;
    };
    return {
      dbClient: createDbClient(organizationId, userId),
    };
  })
  .as("scoped");

export { type createDbClient } from "~api/lib/db/client";
