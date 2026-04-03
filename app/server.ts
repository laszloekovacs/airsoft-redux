// server.ts

//import { serveStatic } from "@hono/node-server/serve-static"
import { Hono } from "hono"
import { createHonoServer } from "react-router-hono-server/bun"

const app = new Hono()

app.get("/health", (c) =>
	c.json({
		status: "ok",
	}),
)
// Public assets (these should usually come early)

//app.use('/public/*', serveStatic({ root: './public' }))

// First, create the React Router server (adds asset serving + SSR catch-all `*`)
const server = await createHonoServer({ app })

// might want to start queues here

export default server
