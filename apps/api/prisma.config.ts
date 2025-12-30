import { defineConfig } from "prisma/config";

import { getConnectionString } from "@hebo/shared-api/lib/db/connection";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getConnectionString("api"),
  },
});
