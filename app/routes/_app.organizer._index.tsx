import { eq } from "drizzle-orm"
import { Link } from "react-router"
import requireSession from "~/functions/requiresession"
import { eventTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app.organizer._index"
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table"

export async function loader({ request }: Route.LoaderArgs) {
	const { user } = await requireSession(request)

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
			<h2 className="font-bold text-2xl mb-4">Általad szervezett események</h2>
			<OrganizersEventList events={events} />
		</div>
	)
}

const OrganizersEventList = ({
	events,
}: {
	events: (typeof eventTable.$inferSelect)[]
}) => {
	if (events.length == 0) {
		return <p>nincs általad szervezett esemény</p>
	}

	return (
		<Table>
			<TableBody>
				{events?.map((i) => (
					<TableRow key={i.id}>
						<TableCell>
							<Link to={`events/${i.id}`}>{i.title}</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
