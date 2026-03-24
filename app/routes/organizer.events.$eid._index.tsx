import { and, eq } from "drizzle-orm"
import { Link } from "react-router"
import expectOne from "~/functions/expectone"
import requireSession from "~/functions/requiresession"
import { eventTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/organizer.events.$eid._index"

export async function loader({ params, request }: Route.LoaderArgs) {
	const { user } = await requireSession(request)

	const events = await db
		.select()
		.from(eventTable)
		.where(
			and(
				eq(eventTable.id, Number(params.eid)),
				eq(eventTable.userId, user.id),
			),
		)

	const event = expectOne(events)

	return { event }
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
