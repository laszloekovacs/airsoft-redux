import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { eq } from "drizzle-orm"
import { useFetcher } from "react-router"
import z from "zod"
import { requireClaim } from "~/functions/auth-guard.server"
import expectOne from "~/functions/expectone"
import { user } from "~/schema/auth-schema"
import { eventTable, registrationTable } from "~/schema/schema"
import { airsoft } from "~/services"
import type { Route } from "./+types/_app.organizer.events.$eid.roster"

const assignmentSchema = z.object({
	regId: z.coerce.number(),
	faction: z.string().nullable().optional(),
	intent: z.enum(["assignToFaction"]),
})

export async function action({ params, request }: Route.ActionArgs) {
	const { user } = await requireClaim(request, "organizer")
	// TODO: check if this is the users event

	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema: assignmentSchema })

	if (submission.status != "success") {
		return submission.reply()
	}

	// check for intent of assign, modify registrations
	if (submission.value.intent == "assignToFaction") {
		// TODO: use registration id not user id
		await airsoft.db
			.update(registrationTable)
			.set({ faction: submission.value.faction ?? null })
			.where(eq(registrationTable.id, submission.value.regId))
	}

	return submission.reply()
}

export async function loader({ params }: Route.LoaderArgs) {
	// get the relevant event
	const events = await airsoft.db
		.select()
		.from(eventTable)
		.where(eq(eventTable.id, Number(params.eid)))
	const event = expectOne(events)

	// fetch the registrations relevant to this event
	// join with user info
	const registrations = await airsoft.db
		.select()
		.from(registrationTable)
		.where(eq(registrationTable.eventId, Number(params.eid)))
		.orderBy(registrationTable.faction)
		.leftJoin(user, eq(registrationTable.userId, user.id))

	// TODO: possibly await with promise.all
	return { registrations, event }
}

// list all applicants
export default function RosterPage({ loaderData }: Route.ComponentProps) {
	const { registrations, event } = loaderData

	return (
		<div>
			<h1>{event.title}</h1>

			<Registrations registrations={registrations} />
		</div>
	)
}

type RowType = {
	user: typeof user.$inferSelect | null
	registration: typeof registrationTable.$inferSelect
}

const Registrations = ({ registrations }: { registrations: RowType[] }) => {
	// gather existing factions
	const factions = [
		...new Set(
			registrations.map((r) => r.registration.faction).filter(Boolean),
		),
	] as string[]

	return (
		<div>
			<span>Eseményre regisztráltak</span>
			<ul>
				{registrations.map((r) => (
					<li key={r.registration.id}>
						<RegistrationsRow reg={r} factions={factions} />
					</li>
				))}
			</ul>
		</div>
	)
}

const RegistrationsRow = ({ reg }: { reg: RowType; factions: string[] }) => {
	const fetcher = useFetcher()

	const [form, field] = useForm({
		lastResult: fetcher.data,
		constraint: getZodConstraint(assignmentSchema),
		defaultValue: {
			regId: reg.registration.id,
			faction: reg.registration.faction,
			intent: "assignToFaction",
		},
	})

	return (
		<div>
			{fetcher?.data && <p>frissítve</p>}
			<p>{reg.user?.username || "classified"}</p>

			<fetcher.Form method="POST" {...getFormProps(form)}>
				<div className="flex flex-row gap-4 max-w-sm">
					<input {...getInputProps(field.regId, { type: "hidden" })} />
					<input {...getInputProps(field.intent, { type: "hidden" })} />

					<input
						className="input-field"
						{...getInputProps(field.faction, { type: "text" })}
					/>

					<button className="btn btn-primary" type="submit">
						<span>módosít</span>
					</button>
				</div>
			</fetcher.Form>
		</div>
	)
}
