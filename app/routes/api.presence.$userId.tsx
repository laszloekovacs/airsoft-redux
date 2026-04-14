import { getReddis } from "~/services/redis.server"
import type { Route } from "./+types/api.presence.$userId"

// post your id here to refresh your online status
// can be easily duped, however its not a security concern
export const action = async ({ params, request }: Route.ActionArgs) => {
	const { userId } = params

	// check if there's data included
	const body = await request.text()
	console.log(`body:${body}`)
	const redis = getReddis()

	// check if he's going offline
	if (body == "offline") {
		await redis.del(`presence:${userId}`)
	} else {
		// store users id in redis as presence:$id, expire it after x seconds
		await redis.set(`presence:${userId}`, "1", {
			expiration: { type: "EX", value: 60 },
		})
	}

	return new Response("ok", { status: 200 })
}
