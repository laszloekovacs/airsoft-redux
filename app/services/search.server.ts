import type { eventTable } from "~/schema/schema"
import { redis } from "./redis.server"

export async function createEventSchema() {
	try {
		await redis.ft.dropIndex("idx:events", { DD: true })
	} catch {} // silently ignore error

	await redis.ft.create(
		"idx:event",
		{
			"$.id": { type: "TAG", AS: "id" },
			"$.title": { type: "TEXT", AS: "title", WEIGHT: 3 },
		},
		{
			ON: "JSON",
			PREFIX: "event",
		},
	)
}

// create an entry in redis from an event
export async function indexEvent(event: typeof eventTable.$inferSelect) {
	await redis.json.set(`event:${event.id}`, "$", {
		id: event.id,
		name: event.title,
	})
}

export async function removeEvent(eventId: string) {
	await redis.json.del(`event:${eventId}`)
}

export async function searchEvents(query: string) {
	// TODO: filtering

	const results = await redis.ft.search("idx:events", "", {
		RETURN: ["id", "title"],
	})

	return results
}
