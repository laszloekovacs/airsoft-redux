import { drizzle } from "drizzle-orm/bun-sql"
import { env } from "~/services/env.server"

const db = drizzle(env.DATABASE_URL)

try {
	await db.execute("SELECT 1")
	console.error("connected to db")
} catch (error) {
	console.error("db connection failed")

	if (error instanceof Error) {
		console.error(`Message: ${error.message}`)
	}

	// kill process if cant connect to db
	process.exit(1)
}

export { db }
