import { Queue, Worker } from "bunqueue/client"
import type { eventTable } from "~/schema/schema"

//const DELAY_TASK_MS = 60000
const DELAY_TASK_MS = 3000

const queue = new Queue<TaskData>("search_indexing", { embedded: true })

type TaskData = {
	event: typeof eventTable.$inferSelect
}

const worker = new Worker<TaskData>(
	"search_indexing",
	async (job) => {
		const { event } = job.data

		console.log("worker recieved job with data:", event)

		return { success: true }
	},
	{
		embedded: true,
	},
)

// call this whenever event data changes
export const enqueueEventForIndexing = (
	event: typeof eventTable.$inferSelect,
) => {
	queue.add(
		"search_indexing",
		{ event },
		{
			jobId: "singleton",
			delay: DELAY_TASK_MS,
		},
	)
}
