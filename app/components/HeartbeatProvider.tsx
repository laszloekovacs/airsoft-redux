import { useEffect, useRef } from "react"

// creates a wrapper that starts the heartbeat shared worker
export const HeartbeatProvider = ({
	userId,
	children,
}: {
	userId: string | null
	children: React.ReactNode
}) => {
	const workerRef = useRef<SharedWorker>(null)

	// could be a custom hook, however, we wont be reusing it
	useEffect(() => {
		if (userId != null) {
			workerRef.current = new SharedWorker("/hearbeat-worker.js")

			// start the worker and pass the user id to it
			workerRef.current.port.start()
			workerRef.current.port.postMessage({ userId })

			// questionable choice, i think garbage collector will deal with it anyway
			window.addEventListener("beforeunload", () => {
				workerRef.current?.port.close()
			})

			return () => {
				workerRef.current?.port.close()
			}
		}
	}, [userId])

	return <>{children}</>
}
