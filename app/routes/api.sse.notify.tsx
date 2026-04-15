import { getSubscipton } from "~/services/redis.server"
import type { Route } from "./+types/api.sse.notify"

export const loader = async ({ request }: Route.LoaderArgs) => {
	const stream = new ReadableStream({
		async start(controller) {
			console.log("sse endpoint connected")
			const subscription = getSubscipton()

			// TODO: investigate if encoding is correct
			subscription.subscribe("notification", (message) => {
				controller.enqueue(message)
			})
		},
	})

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	})
}
