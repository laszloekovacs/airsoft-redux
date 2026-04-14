import { requireAuth } from "~/functions/auth-guard.server"
import { getReddis } from "~/services/redis.server"
import type { Route } from "./+types/api.presence"

// post your id here to refresh your online status
export const action = async ({ request }: Route.ActionArgs) => {
	const { user } = await requireAuth(request)

	const redis = getReddis()

	// store users id in redis as presence:$id, expire it after x seconds
	await redis.set(`presence:${user.id}`, "1", {
		expiration: { type: "EX", value: 60 },
	})

	return { status: "ok" }
}
