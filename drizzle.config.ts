import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: "ep-calm-bar-a11tfwdl-pooler.ap-southeast-1.aws.neon.tech",
    port: 5432,
    user: "neondb_owner",
    password: "npg_DRzBQgpJ73MN",
    database: "neondb",
    ssl: "require",
  },
});
