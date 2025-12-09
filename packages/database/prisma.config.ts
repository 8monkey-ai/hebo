import { defineConfig } from "prisma/config";

import { getConnectionString } from "./src/connection";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getConnectionString(),
  },
});
