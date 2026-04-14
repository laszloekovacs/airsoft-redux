import { getSubscipton } from "~/services/redis.server"
import type { Route } from "./+types/api.presence.stream"

export const loader = async ({ request }: Route.LoaderArgs) => {
	const stream = new ReadableStream({
		// start streaming
		async start(controller) {
			// watch redis changes and register a callback on change
			// we need to trigger this at the presence ping endpoint
			const subscription = getSubscipton()
			subscription.subscribe("presence", (message) => {})
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
