import { PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import Pool from "pg-pool";
import { env } from "./src/env.js";

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: env.DATABASE_URL,
	}),
});

export default defineConfig({
	dialect,
	migrations: {
		migrationFolder: "./src/migrations",
	},
	seeds: {
		seedFolder: "./src/seeds",
	},
});
