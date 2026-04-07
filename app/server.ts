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
import {
	createEventSchema,
	indexEvent,
	searchEvents,
} from "./services/search.server"
import { db } from "./services/drizzle.server"
import { eventTable } from "./schema/schema"

app.get("/schema", async (c) => {
	await createEventSchema()

	return c.text("ran schema creation")
})

app.get("/ingest", async (c) => {
	const [event] = await db.select().from(eventTable)

	await indexEvent(event)

	return c.text("ingested")
})

app.get("/find", async (c) => {
	const sid = c.req.query("q") ?? "b"

	const result = await searchEvents(sid)
	console.log(result)

	return c.text(JSON.stringify(result, null, 2))
})

// First, create the React Router server (adds asset serving + SSR catch-all `*`)
const server = await createHonoServer({ app })

export default server
