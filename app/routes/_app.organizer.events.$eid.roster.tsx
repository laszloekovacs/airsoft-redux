import { eq } from "drizzle-orm"
import expectOne from "~/functions/expectone"
import { user } from "~/schema/auth-schema"
import { eventTable, factionsTable, registrationTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app.organizer.events.$eid.roster"

// return faction information and registrations. registrations should be joined by ids. null means unasigned
export async function loader({ params }: Route.LoaderArgs) {
	// get the relevant event
	const events = await db
		.select()
		.from(eventTable)
		.where(eq(eventTable.id, Number(params.eid)))

	const event = expectOne(events)

	// fetch the registrations relevant to this event, joined with users
	const registrations = await db
		.select()
		.from(registrationTable)
		.where(eq(registrationTable.eventId, Number(params.eid)))
		.leftJoin(user, eq(user.id, registrationTable.userId))

	// faction information.
	const factions = await db
		.select()
		.from(factionsTable)
		.where(eq(factionsTable.eventId, Number(params.eid)))

	// TODO: possibly await with promise.all

	return { registrations, event, factions }
}

// list all applicants
export default function RosterPage({ loaderData }: Route.ComponentProps) {
	const { registrations, event, factions } = loaderData

	return (
		<div>
			<h1>{event.title}</h1>

			{/* add the unasigned players */}
			<Faction faction={null} registrations={registrations} />

			<ul>
				{factions.map((f) => (
					<li key={f.id}>
						<Faction faction={f} registrations={registrations} />
					</li>
				))}
			</ul>
		</div>
	)
}

type FactionProps = {
	faction: typeof factionsTable.$inferSelect | null
	registrations: Array<{
		registration: typeof registrationTable.$inferSelect
		user: typeof user.$inferSelect | null
	}>
}

const Faction = ({ faction, registrations }: FactionProps) => {
	// filter out players belonging to this faction

	const players = registrations.filter(
		(pre) => pre.registration.factionId == faction?.id,
	)

	return (
		<div>
			<h2>{faction?.name ?? "kispadosok"}</h2>

			<ul>
				{players.map((p) => (
					<li key={p.registration.id}>
						<p>{p.user?.name}</p>
					</li>
				))}
			</ul>
		</div>
	)
}
