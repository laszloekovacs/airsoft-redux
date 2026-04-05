import { parseWithZod } from "@conform-to/zod/v4"
import { eq } from "drizzle-orm"
import { requireRole } from "~/functions/auth-guard.server"
import expectOne from "~/functions/expectone"
import { eventTable, registrationTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app.organizer.events.$eid.roster"
import z from "zod"
import { user } from "~/schema/auth-schema"

const assignmentSchema = z.object({
	userId: z.number().int(),
	faction: z.string(),
	intent: z.enum(["assign"]),
})

export async function action({ params, request }: Route.ActionArgs) {
	const { user } = await requireRole(request, "organizer")
	// TODO: check if this is the users event

	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema: assignmentSchema })

	if (submission.status != "success") {
		return submission.reply()
	}

	// check for intent of assign, modify registrations
	if (submission.value.intent == "assign") {
		console.log("reassign")
	}

	return submission.reply()
}

export async function loader({ params }: Route.LoaderArgs) {
	// get the relevant event
	const events = await db
		.select()
		.from(eventTable)
		.where(eq(eventTable.id, Number(params.eid)))
	const event = expectOne(events)

	// fetch the registrations relevant to this event
	// join with user info
	const registrations = await db
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
	user: typeof user.$inferInsert | null
	registration: typeof registrationTable.$inferSelect
}

const Registrations = ({ registrations }: { registrations: RowType[] }) => {
	return (
		<div>
			<span>Esemenyre regisztraltak</span>
			<ul>
				{registrations.map((r) => (
					<li key={r.registration.id}>
						<RegistrationsRow reg={r} />
					</li>
				))}
			</ul>
		</div>
	)
}

const RegistrationsRow = ({ reg }: { reg: RowType }) => {
	return (
		<div>
			<p>{reg.user?.username || "classified"}</p>
			<p>{reg.registration.faction}</p>
		</div>
	)
}
