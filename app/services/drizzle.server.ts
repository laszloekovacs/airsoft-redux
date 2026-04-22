import { drizzle } from "drizzle-orm/bun-sql"
import { env } from "~/services/env.server"
import { log } from "./pino.server"

export const db = drizzle(env.DATABASE_URL)

try {
	await db.execute("SELECT 1")
	log.info("drizzle created a connection to postgres")
} catch (error) {
	log.error("drizzle db connection failed, is the connection string correct?")

	if (error instanceof Error) {
		log.error(`Message: ${error.message}`)
	}

	// kill process if cant connect to db
	process.exit(1)
}
