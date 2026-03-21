import { eq } from "drizzle-orm"
import { EventTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app.event.$id"

export async function loader({ params }: Route.LoaderArgs) {
	const events = await db
		.select()
		.from(EventTable)
		.where(eq(EventTable.id, Number(params.id)))

	if (events.length != 1) {
		throw new Error("nincs ilyen esemeny")
	}

	return { event: events[0] }
}

export default function EventDetailsPage({ loaderData }: Route.ComponentProps) {
	const { event } = loaderData

	return (
		<div>
			<h1>Event</h1>
			<pre>{JSON.stringify(event)}</pre>
		</div>
	)
}
