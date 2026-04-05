import Typesense from "typesense"
import { env } from "~/services/env.server"

console.log("starting typesense client")

const client = new Typesense.Client({
	nodes: [{ host: env.TYPESENSE_HOST, port: 80, protocol: "https" }],
	apiKey: env.TYPESENSE_APIKEY,
})

// schemas for searchable content
const eventSchema = {
	name: "events",
	fields: [
		{ name: "id", type: "int32" },
		{ name: "title", type: "string" },
		{ name: "tags", type: "string" },
	],
	default_sorting_field: "title",
}

// create collections in case they dont exist yet
if (!client.collections("events").exists()) {
	await client.collections().create(eventSchema)
	console.log("creating collection")
}
