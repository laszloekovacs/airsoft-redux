import { createClient } from "redis"
import { env } from "~/services/env.server"
import { log } from "./pino.server"

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

const createRedisClient = (url: string) => {
	const client = createClient({ url })

	client.on("error", (err) => {
		log.error({ err }, "Redis client error")
	})

	return client
}

export const redisNamespace = {
	redis: createRedisClient(env.REDIS_CONNECTION_STRING),
	pub: createRedisClient(env.REDIS_CONNECTION_STRING),
	sub: createRedisClient(env.REDIS_CONNECTION_STRING),
}

log.info("redis clients started")
