import { Hono } from "hono"
import { searchEvents } from "~/services/search.server"

export const searchRoute = new Hono()

searchRoute.post("/search", async (c) => {
	const formData = await c.req.formData()
	const query = (formData.get("query") as string) ?? ""

	if (!query) return c.json({ ok: true })

	const result = await searchEvents(query)
	console.log(result)

	return c.json(JSON.parse(JSON.stringify(result)))
})
