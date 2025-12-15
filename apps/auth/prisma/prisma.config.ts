export default {
  schema: "./schema.prisma",
  migrations: {
    path: "./migrations",
  },
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:password@localhost:5432/local",
  },
};
