import { drizzle } from "drizzle-orm/bun-sql"
import { env } from "~/services/env.server"

export const db = drizzle(env.DATABASE_URL)
