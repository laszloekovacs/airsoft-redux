import { eq } from "drizzle-orm"
import { type RegistrationSelectType, registrationTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/organizer.events.$eid.roster"

export async function loader({ params }: Route.LoaderArgs) {
	// load roster
	const roster = await db
		.select()
		.from(registrationTable)
		.where(eq(registrationTable.eventId, Number(params.eid)))

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

const Roster = ({ roster }: { roster: RegistrationSelectType[] }) => {
	const list = roster.map((i) => (
		<li key={i.id}>
			<div>{i.userId}</div>
		</li>
	))

	return (
		<div>
			<p>list of players</p>
			<div>
				<ul>{list}</ul>
			</div>
		</div>
	)
}
