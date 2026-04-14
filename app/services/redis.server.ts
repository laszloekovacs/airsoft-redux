import { createClient } from "redis"
import { env } from "~/services/env.server"

export const redis = createClient({
	url: env.REDIS_CONNECTION_STRING,
})

redis.on("error", (err) => console.log("Redis client error: ", err))

await redis.connect()

export const getReddis = () => {
	return redis.duplicate()
}

console.log("redis client started")
