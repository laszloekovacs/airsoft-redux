import { getSubscipton } from "~/services/redis.server"
import type { Route } from "./+types/api.sse.notify"

export const loader = async ({ request }: Route.LoaderArgs) => {
	const stream = new ReadableStream({
		async start(controller) {
			console.log("sse endpoint connected")

			const subscription = getSubscipton()

			subscription.subscribe("notification", (message) => {
				const payload = `data: ${message}\n\n`
				controller.enqueue(new TextEncoder().encode(payload))
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
