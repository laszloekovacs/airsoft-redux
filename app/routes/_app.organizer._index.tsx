import { eq } from "drizzle-orm"
import { Link } from "react-router"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table"
import { requireSession } from "~/functions/auth-guard.server"
import { eventTable } from "~/schema/schema"
import { ar } from "~/services"
import type { Route } from "./+types/_app.organizer._index"

export async function loader({ request }: Route.LoaderArgs) {
	const { user } = await requireSession(request)

	// list users organized events
	const events = await ar.db
		.select()
		.from(eventTable)
		.where(eq(eventTable.userId, user.id))

	return { events }
}

export default function OrganizerPage({ loaderData }: Route.ComponentProps) {
	const { events } = loaderData

	return (
		<div>
			<Link to="/organizer/events/new" className="underline underline-offset-4">
				uj esemeny
			</Link>
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
			<TableHeader>
				<TableRow>
					<TableHead>esemeny neve</TableHead>
				</TableRow>
			</TableHeader>
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
