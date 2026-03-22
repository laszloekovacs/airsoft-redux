import { eq } from "drizzle-orm"
import { type EventRosterSelectType, eventRoster } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/organizer.events.$eid.roster"

export async function loader({ params }: Route.LoaderArgs) {
	// load roster
	const roster = await db
		.select()
		.from(eventRoster)
		.where(eq(eventRoster.eventId, Number(params.eid)))

	return { roster }
}

// list all applicants
export default function RosterPage({ loaderData }: Route.ComponentProps) {
	const { roster } = loaderData

	return (
		<div>
			<h1>Csapatok</h1>
			<Roster roster={roster} />
		</div>
	)
}

const Roster = ({ roster }: { roster: EventRosterSelectType[] }) => {
	const list = roster.map((i) => (
		<li key={i.id}>
			<div>{i.userId}</div>
		</li>
	))

	return (
		<>
			<p>list of players</p>
			<div>
				<ul>{list}</ul>
			</div>
		</>
	)
}
