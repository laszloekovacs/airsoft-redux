// npm install typesense @babel/runtime

import Typesense from "typesense"
import { env } from "~/services/env.server"

const client = new Typesense.Client({
	nodes: [{ host: env.TYPESENSE_HOST, port: 80, protocol: "http" }],
	apiKey: env.TYPESENSE_APIKEY,
})

const schema = {
	name: "books",
	fields: [
		{ name: "title", type: "string" },
		{ name: "author", type: "string" },
		{ name: "ratings", type: "int32" },
	],
	default_sorting_field: "ratings",
}

const documents = [
	{ title: "Book 1", author: "Author1", ratings: 24 },
	{ title: "Book 2", author: "Author2", ratings: 31 },
	{ title: "Book 3", author: "Author3", ratings: 30 },
]
/*
client
	.collections()
	.create(schema)
	.then(() => {
		client.collections("books").documents().import(documents)
	})
*/

client
	.collections("books")
	.documents()
	.search({
		query_by: "title,author",
		q: "boo",
	})
	.then((data) => console.log(data))
