import { airsoft } from "~/services"
import type { Route } from "./+types/api.presence.$userId"

// post your id here to refresh your online status
// can be easily duped, however its not a security concern
export const action = async ({ params }: Route.ActionArgs) => {
	const { userId } = params

	// bump up the users presence in the database
	await airsoft.redis.set(`presence:${userId}`, "1", {
		expiration: { type: "EX", value: 60 },
	})

	return new Response("ok", { status: 200 })
}
