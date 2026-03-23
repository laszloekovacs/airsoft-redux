import { eq } from "drizzle-orm"
import { Link } from "react-router"
import { type EventTableSelect, eventTable } from "~/schema/schema"
import { auth } from "~/services/auth.server"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/organizer._index"

export async function loader({ request }: Route.LoaderArgs) {
	const authCookie = await auth.api.getSession(request)

	if (!authCookie) {
		throw new Error("nincs hozzáférésed")
	}

	const { user } = authCookie
	// list users organized events
	const events = await db
		.select()
		.from(eventTable)
		.where(eq(eventTable.userId, user.id))

	return { events }
}

export default function OrganizerPage({ loaderData }: Route.ComponentProps) {
	const { events } = loaderData

	return (
		<div>
			<p>eseményeid</p>
			<OrganizersEventList events={events} />
		</div>
	)
}

const OrganizersEventList = ({ events }: { events: EventTableSelect[] }) => {
	if (events.length == 0) {
		return <p>nincs általad szervezett esemény</p>
	}

	return (
		<ul>
			{events?.map((i) => (
				<li key={i.id}>
					<Link to={`events/${i.id}`}>{i.title}</Link>
				</li>
			))}
		</ul>
	)
}
