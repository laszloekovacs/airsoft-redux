import { createClient } from "redis"
import { env } from "~/services/env.server"

const redis = createClient({
	url: env.REDIS_CONNECTION_STRING,
})

redis.on("error", (err) => console.log("Redis client error: ", err))
await redis.connect()

const subscription = redis.duplicate()

export const getReddis = () => redis
export const getSubscipton = () => subscription

console.log("redis client started")
