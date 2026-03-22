import { eq } from "drizzle-orm"
import { Link } from "react-router"
import { eventTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/organizer.events.$eid._index"

export async function loader({ params }: Route.LoaderArgs) {
	const event = await db
		.select()
		.from(eventTable)
		.where(eq(eventTable.id, Number(params.eid)))

	if (event.length != 1) {
		throw new Error("nincs ilyen esemeny!")
	}

	return { event: event[0] }
}

export default function EventSummary({ loaderData }: Route.ComponentProps) {
	const { event } = loaderData

	return (
		<div>
			<h1>Esemeny osszefoglalo oldal</h1>

			<h2>{event.title}</h2>

			<Link to={`/organizer/events/${event.id}/roster`}>reszletek</Link>
		</div>
	)
}
