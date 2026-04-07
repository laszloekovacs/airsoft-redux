import { createClient } from "redis"
import { env } from "~/services/env.server"

const client = createClient({
	url: env.REDIS_CONNECTION_STRING,
})

client.on("error", (err) => console.log("Redis client error: ", err))

await client.connect()

console.log("redis client started")
