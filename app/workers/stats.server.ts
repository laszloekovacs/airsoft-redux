import { Queue, Worker } from "bunqueue/client"

type TaskData = {
	message: string
}

// both should be embedded: true
// the name of the queue and the worker establises the connection between the 2
const queue = new Queue<TaskData>("test", { embedded: true })
const worker = new Worker<TaskData>(
	"test",
	async (job) => {
		console.log("processing:", job.data)

		return { success: true }
	},
	{ embedded: true },
)

worker.on("completed", (job, result) => {
	console.log(`Job ${job.id} completed: ${result}`)
})

// call this in a loader or action
export const scheduleJob = async () => {
	await queue.add("working", { message: "bunqueue is working" })
}
