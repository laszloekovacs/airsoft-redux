import { parseWithZod } from "@conform-to/zod/v4"
import { eq, inArray } from "drizzle-orm"
import { useState } from "react"
import { useFetcher } from "react-router"
import z from "zod"
import { requireRole } from "~/functions/auth-guard.server"
import expectOne from "~/functions/expectone"
import { user } from "~/schema/auth-schema"
import { eventTable, factionsTable, registrationTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app.organizer.events.$eid.roster"

// TODO: only the owner should be able to edit his own roster
const assignmentSchema = z.object({
	selected: z.number().array(),
	factionId: z.number(),
	intent: z.enum(["assign"]),
})

type Assignment = z.infer<typeof assignmentSchema>

export async function action({ params, request }: Route.ActionArgs) {
	const { user } = await requireRole(request, "organizer")
	// TODO: check if this is the users event

	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema: assignmentSchema })

	console.log(submission)
	if (submission.status != "success") {
		return submission.reply()
	}

	// check for intent of assign, modify registrations
	if (submission.value.intent == "assign") {
		// modify registration's factionId to the submitted value
		// where the registration's id is in the submitted list

		const updatedRows = await db
			.update(registrationTable)
			.set({
				factionId: submission.value.factionId,
			})
			.where(inArray(registrationTable.id, submission.value.selected))
			.returning()

		console.log(updatedRows)
	}

	return submission.reply()
}

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
	// might want to use fetchers to indicate loading instead of passing the same one?
	const fetcher = useFetcher()

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
					fetcher={fetcher}
				/>
			))}
		</div>
	)
}

// TODO: FactionHeading component with assign button and count
const FactionHeading = ({
	fetcher,
	selected,
	factionId,
}: {
	fetcher: ReturnType<typeof useFetcher>
	selected: Set<number>
	factionId: number
}) => {
	const isSelecting = !!selected.size

	const payload: Assignment = {
		selected: Array.from(selected),
		factionId: factionId,
		intent: "assign",
	}

	const onReasign = async () => {
		await fetcher.submit(payload, {
			method: "post",
			encType: "multipart/form-data",
		})
	}

	return (
		<div className="px-2 flex flex-row gap-4">
			<p>fejléc</p>
			{isSelecting && <p>selecting</p>}
			<button type="button" disabled={!isSelecting} onClick={() => onReasign()}>
				hozzáad
			</button>
		</div>
	)
}

type FactionProps = {
	faction: typeof factionsTable.$inferSelect
	registrations: Array<{
		registration: typeof registrationTable.$inferSelect
		user: typeof user.$inferSelect | null
	}>
	selected: Set<number>
	onToggle: (id: number) => void
	fetcher: ReturnType<typeof useFetcher>
}

const Faction = ({
	faction,
	registrations,
	selected,
	onToggle,
	fetcher,
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
			<FactionHeading
				factionId={faction.id}
				fetcher={fetcher}
				selected={selected}
			/>
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

type RegistrationListItemProp = {
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
}: RegistrationListItemProp) => {
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
