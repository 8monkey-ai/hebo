import { PrismaPg } from "@prisma/adapter-pg";
import { Resource } from "sst";

import { PrismaClient } from "./src/generated/prisma/client";

export const getConnectionString = () => {
  try {
    // @ts-expect-error: HeboDatabase may not be defined
    const db = Resource.HeboDatabase;
    return `postgresql://${db.username}:${db.password}@${db.host}:${db.port}/${db.database}?sslmode=verify-full`;
  } catch {
    // FUTURE: keep in sync with dev:infra:up script once updated
    return "postgresql://postgres:password@localhost:5432/local";
  }
};

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: getConnectionString(), max: 25 }),
});
