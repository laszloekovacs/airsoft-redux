import { createClient } from "redis"
import { env } from "~/services/env.server"

const redis = createClient({
	url: env.REDIS_CONNECTION_STRING,
})

const subscription = createClient({
	url: env.REDIS_CONNECTION_STRING,
})

const publishing = createClient({
	url: env.REDIS_CONNECTION_STRING,
})

redis.on("error", (err) => console.log("Redis client error: ", err))
subscription.on("error", (err) => console.log("Redis sub client error: ", err))
publishing.on("error", (err) => console.log("Redis pub client error: ", err))

await redis.connect()
await subscription.connect()
await publishing.connect()

export const getRedis = () => redis
export const getSubscipton = () => subscription
export const getPublishing = () => publishing

console.log("redis clients started")
