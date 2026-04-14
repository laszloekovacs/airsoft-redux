let connections = []

onconnect = function (event) {
	console.log("shared worker started")
	const port = event.ports[0]
	connections.push(port)

	port.onmessage = (e) => {
		connections.forEach((p) => p.postMessage(e.data))
		console.log("message broadcast")
	}

	port.start()
}
