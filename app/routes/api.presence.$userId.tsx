import { getReddis } from "~/services/redis.server"
import type { Route } from "./+types/api.presence.$userId"

// post your id here to refresh your online status
// can be easily duped, however its not a security concern
export const action = async ({ params }: Route.ActionArgs) => {
	const { userId } = params

	const redis = getReddis()

	// store users id in redis as presence:$id, expire it after x seconds
	await redis.set(`presence:${userId}`, "1", {
		expiration: { type: "EX", value: 60 },
	})

	console.log(userId, "present!")
	return new Response("ok", { status: 200 })
}
