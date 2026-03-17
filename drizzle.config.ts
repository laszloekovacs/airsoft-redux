import { defineConfig } from "drizzle-kit"
import { env } from "~/services/env.server"

export default defineConfig({
	out: "./drizzle",
	schema: "./app/schema/*",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
})
