import { useEffect, useRef } from "react"

export function useEventSource<T = MessageEvent>(
	url: string,
	callback: (event: T) => void,
) {
	const eventStreamRef = useRef<EventSource | null>(null)

	useEffect(() => {
		const es = new EventSource(url)
		eventStreamRef.current = es

		const handler = (e: MessageEvent) => callback(e as T)
		es.addEventListener("message", handler)

		return () => {
			es.removeEventListener("message", handler)
			es.close()
		}
	}, [url, callback])

	return eventStreamRef
}
