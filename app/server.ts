// server.ts

//import { serveStatic } from "@hono/node-server/serve-static"
import { Hono } from "hono"
import { createHonoServer } from "react-router-hono-server/bun"
//import { pipeline } from "@huggingface/transformers"

const app = new Hono()
/*
const classifier = await pipeline(
	"sentiment-analysis",
	"Xenova/distilbert-base-uncased-finetuned-sst-2-english",
)

app.get("/generate", async (c) => {
	const verdict = await classifier("im tired of these errors")

	return c.json({
		verdict,
	})
})
	*/
// Public assets (these should usually come early)

//app.use('/public/*', serveStatic({ root: './public' }))

// run queue scripts at start
import "~/services/queue.server"
import "~/services/redis.server"

import { searchRoute } from "./api/search"
import { eventTable } from "./schema/schema"
import { db } from "./services/drizzle.server"
import { createEventSchema, indexEvent } from "./services/search.server"

app.get("/schema", async (c) => {
	await createEventSchema()

	return c.text("ran schema creation")
})

app.get("/ingest", async (c) => {
	const [event] = await db.select().from(eventTable)

	await indexEvent(event)

	return c.text("ingested")
})

app.route("/endpoint", searchRoute)

// First, create the React Router server (adds asset serving + SSR catch-all `*`)
const server = await createHonoServer({ app })

export default server
