import { scheduleJob, testQueue } from "~/workers/stats.server"
import type { Route } from "./+types/admin.queue"

export const loader = async ({ request }: Route.LoaderArgs) => {
	const completed = await testQueue.getCompletedCount()
	const failed = await testQueue.getFailedCount()

	scheduleJob()

	return { completed, failed }
}

export default function QueueInfoPage({ loaderData }: Route.ComponentProps) {
	const { completed, failed } = loaderData

	return (
		<div>
			<h1>test queue stats</h1>

			<p>completed: {completed}</p>
			<p>failed: {failed}</p>
		</div>
	)
}
