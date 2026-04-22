import { Form } from "react-router"
import { useEventSource } from "~/functions/useEventSource"
import { sendNotification } from "~/functions/send-notification.server"
import { auth } from "~/services/auth.server"
import type { Route } from "./+types/_app.xguide"

export const loader = async ({ request }: Route.LoaderArgs) => {
	const sessionData = await auth.api.getSession(request)

	const userId = sessionData?.user.id

	return { userId }
}

export default function TestingPage({ loaderData }: Route.ComponentProps) {
	const { userId } = loaderData

	const source = useEventSource("/api/sse/notify", (e) => {
		const data = JSON.parse(e.data)
		console.log(data)
	})

	return (
		<div>
			<div>
				<Form method="post">
					<button type="submit">send</button>
					<pre>{JSON.stringify(source)}</pre>
				</Form>
			</div>
		</div>
	)
}

export const action = async ({ request }: Route.ActionArgs) => {
	const sessionData = await auth.api.getSession(request)

	const userId = sessionData?.user.id
	console.log("action called")
	await sendNotification({
		userId: userId ?? "1",
		content: JSON.stringify({ message: "hello world" }),
	})

	return {}
}
