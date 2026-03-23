import { and, eq } from "drizzle-orm"
import { Link } from "react-router"
import { eventTable } from "~/schema/schema"
import { auth } from "~/services/auth.server"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/organizer.events.$eid._index"

export async function loader({ params, request }: Route.LoaderArgs) {
	const sessionCookie = await auth.api.getSession(request)

	if (!sessionCookie) {
		throw new Error("nincs hozzáférésed")
	}

	const { user } = sessionCookie

	const event = await db
		.select()
		.from(eventTable)
		.where(
			and(
				eq(eventTable.id, Number(params.eid)),
				eq(eventTable.userId, user.id),
			),
		)

	if (event.length != 1) {
		throw new Error("nincs ilyen esemény!")
	}

	return { event: event[0] }
}

export default function EventSummary({ loaderData }: Route.ComponentProps) {
	const { event } = loaderData

	return (
		<div>
			<h1>Esemény összefoglaló oldal</h1>

			<h2>{event.title}</h2>

			<Link to={`/organizer/events/${event.id}/roster`}>reszletek</Link>
		</div>
	)
}
