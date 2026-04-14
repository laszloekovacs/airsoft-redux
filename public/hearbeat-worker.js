// keep this running if a tab is open, it will ping the presence endpoint

let ports = []
let pingInterval = null

onconnect = (event) => {
	const port = event.ports[0]
	ports.push(port)
	port.start()

	// the tab needs to send the id once, and it will keep pinging
	port.onmessage = (event) => {
		const { userId } = event.data

		// Start interval only once
		if (!pingInterval) {
			pingInterval = setInterval(() => {
				fetch(`/api/presence/${userId}`, {
					method: "POST",
					body: "online",
				})
			}, 2_000)
		}
	}

	// probably gets unloaded anyway when all tabs close anyway
	port.onclose = () => {
		ports = ports.filter((p) => p !== port)

		// If no tabs left, stop pinging
		if (ports.length === 0) {
			clearInterval(pingInterval)
			pingInterval = null

			// send an expire message
			fetch(`/api/presence/${userId}`, {
				method: "POST",
				body: "offline",
			})
		}
	}
}
