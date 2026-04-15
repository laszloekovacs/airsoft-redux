import { notificationTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import { getPublishing } from "~/services/redis.server"

// records notification to database
export const sendNotification = async ({
	userId,
	content,
}: {
	userId: string
	content: string
}) => {
	// record it into the database
	await db.insert(notificationTable).values({
		userId,
		content: JSON.stringify(content),
	})

	// also try to deliver if he's online by publishing to redis
	// sse endpoint is subscribed to this
	// TODO: target specific user
	const redis = getPublishing()

	await redis.publish(`notification`, content)
	console.log("notification send called")
	// possibly send a push notification too
}
