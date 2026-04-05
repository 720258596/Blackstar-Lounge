import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasources: {
    db: {
      adapter: "postgresql",       // specify the adapter
      url: process.env.DATABASE_URL!, // pass your Render database URL here
    },
  },
});