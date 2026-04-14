import { requireAuth } from "~/functions/auth-guard.server"
import type { Route } from "./+types/api.sse"

export const loader = async ({ request }: Route.LoaderArgs) => {
	const user = await requireAuth(request)

	const stream = new ReadableStream({
		async start(controller) {},
	})

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	})
}
