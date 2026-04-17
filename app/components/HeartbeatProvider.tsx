import { useEffect, useRef } from "react"

const DELAY = 10_000
const ENDPOINT_URL = "/api/presence/"

// send a request to the heartbeat endpoint in an interval
export const HeartbeatProvider = ({
	userId,
	children,
}: {
	userId: string | null
	children: React.ReactNode
}) => {
	const intervalRef = useRef<number | null>(null)

	useEffect(() => {
		if (userId != null) {
			intervalRef.current = window.setInterval(() => {
				fetch(ENDPOINT_URL + userId, {
					method: "post",
				})
			}, DELAY)
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}
	}, [userId])

	return <>{children}</>
}
