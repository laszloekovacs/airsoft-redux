import { auth } from "./auth.server"
import { db } from "./drizzle.server"
import { env } from "./env.server"
import { log } from "./pino.server"
import { redisNamespace } from "./redis.server"
import { storage } from "./storage.server"

export const airsoft = {
	db,
	env,
	auth,
	log,
	storage,
	...redisNamespace,
}

// TODO: export wokers from here too
