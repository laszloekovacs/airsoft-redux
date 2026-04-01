import { eq } from "drizzle-orm"
import { useState } from "react"
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

			<RegistrationContainer
				registrations={registrations}
				factions={factions}
			/>
		</div>
	)
}

type RegistrationContainerProps = {
	factions: Array<typeof factionsTable.$inferSelect>
	registrations: Array<{
		registration: typeof registrationTable.$inferSelect
		user: typeof user.$inferSelect | null
	}>
}

const RegistrationContainer = ({
	registrations,
	factions,
}: RegistrationContainerProps) => {
	const [selected, setSelected] = useState<Set<number>>(new Set())

	const toggle = (id: number) => {
		setSelected((prev) => {
			const next = new Set(prev)
			next.has(id) ? next.delete(id) : next.add(id)
			return next
		})
	}

	return (
		<div>
			{factions.map((f) => (
				<Faction
					key={f.id}
					faction={f}
					registrations={registrations}
					selected={selected}
					onToggle={toggle}
				/>
			))}
		</div>
	)
}

type FactionProps = {
	faction: typeof factionsTable.$inferSelect | null
	registrations: Array<{
		registration: typeof registrationTable.$inferSelect
		user: typeof user.$inferSelect | null
	}>
	selected: Set<number>
	onToggle: (id: number) => void
}

const Faction = ({
	faction,
	registrations,
	selected,
	onToggle,
}: FactionProps) => {
	// filter out players belonging to this faction
	const players = registrations.filter(
		(r) => r.registration.factionId == faction?.id,
	)

	// TODO: render the header only with the assign button
	if (players.length == 0) return null

	return (
		<div>
			<h2 className="text-body">{faction?.name ?? "kispadosok"}</h2>

			<ul className="border-b border-border">
				{players.map((p) => (
					<li key={p.registration.id}>
						<RegistrationListItem
							id={p.registration.id}
							username={p.user?.username ?? null}
							isChecked={selected.has(p.registration.id)}
							onToggle={onToggle}
						/>
					</li>
				))}
			</ul>
		</div>
	)
}

type ListItemProp = {
	id: number
	username: string | null
	isChecked: boolean
	onToggle: (id: number) => void
}

// list item
const RegistrationListItem = ({
	id,
	username,
	isChecked,
	onToggle,
}: ListItemProp) => {
	return (
		<div>
			<input
				type="checkbox"
				checked={isChecked}
				onChange={() => onToggle(id)}
			/>
			<span>{username ?? "ismeretlen"}</span>
		</div>
	)
}
