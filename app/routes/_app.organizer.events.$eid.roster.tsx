import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { eq } from "drizzle-orm"
import { useActionData, useFetcher } from "react-router"
import z from "zod"
import { requireRole } from "~/functions/auth-guard.server"
import expectOne from "~/functions/expectone"
import { user } from "~/schema/auth-schema"
import { eventTable, registrationTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app.organizer.events.$eid.roster"

const assignmentSchema = z.object({
	userId: z.string(),
	faction: z.string().nullable().optional(),
	intent: z.enum(["assignToFaction"]),
})

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
	if (submission.value.intent == "assignToFaction") {
		console.log("reassign")

		await db
			.update(registrationTable)
			.set({ faction: submission.value.faction ?? null })
			.where(eq(registrationTable.userId, submission.value.userId ?? null))
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
			<span>Eseményre regisztráltak</span>
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
	const actionData = useActionData<typeof action>()
	const fetcher = useFetcher()

	const [form, field] = useForm({
		lastResult: actionData,
		constraint: getZodConstraint(assignmentSchema),
		defaultValue: {
			userId: reg.registration.userId,
			faction: reg.registration.faction,
			intent: "assignToFaction",
		},
	})

	return (
		<div>
			{actionData?.status == "success" && <p>frissítve</p>}
			<p>{reg.user?.username || "classified"}</p>

			<fetcher.Form method="POST" {...getFormProps(form)}>
				<input {...getInputProps(field.userId, { type: "hidden" })} />
				<input
					className="input-field"
					{...getInputProps(field.faction, { type: "text" })}
				/>
				<button
					className="btn btn-primary"
					type="submit"
					value="assignToFaction"
					name="intent"
				>
					<span>módosít</span>
				</button>
			</fetcher.Form>
		</div>
	)
}
