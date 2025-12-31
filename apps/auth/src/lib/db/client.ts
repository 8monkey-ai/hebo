import { createPrismaAdapter } from "@hebo/shared-api/lib/db/connection";

import { PrismaClient } from "~auth/generated/prisma/client";

export const prisma = new PrismaClient({
  adapter: createPrismaAdapter("auth"),
});
