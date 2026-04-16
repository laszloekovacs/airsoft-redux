import { auth } from "./auth.server"
import { db } from "./drizzle.server"
import { env } from "./env.server"
import { log } from "./pino.server"
import { redisNs } from "./redis.server"
import { storage } from "./storage.server"

export const airsoft = {
	db,
	env,
	auth,
	log,
	storage,
	redis: redisNs,
}

// TODO: export wokers from here too
