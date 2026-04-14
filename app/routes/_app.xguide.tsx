import { useEffect, useRef } from "react"
import type { Route } from "./+types/xguide"

export function useSharedWorker(onMessage: (data: string) => void, id: string) {
	const workerRef = useRef<SharedWorker>(null)

	useEffect(() => {
		const worker = new SharedWorker("/shared-worker.js")
		workerRef.current = worker

		worker.port.onmessage = (event) => {
			onMessage?.(event.data)
		}

		worker.port.start()

		return () => {
			worker.port.close()
		}
	}, [onMessage])

	const send = (msg: string) => {
		workerRef.current?.port.postMessage({ msg, id })
	}

	return { send }
}

export default function StyleGuide({ loaderData }: Route.ComponentProps) {
	const { send } = useSharedWorker((msg) => {
		console.log("recieved:", msg)
	}, "mike")

	return (
		<div>
			<button className="border" type="submit" onClick={() => send("echo")}>
				send
			</button>
		</div>
	)
}
