import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { and, asc, eq } from "drizzle-orm"
import { useFetcher } from "react-router"
import z from "zod"
import expectOne from "~/functions/expectone"
import requireSession from "~/functions/requiresession"
import { eventTable, factionsTable, registrationTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app.event.$id"

export async function loader({ params, request }: Route.LoaderArgs) {
	const { user } = await requireSession(request)

	const events = await db
		.select()
		.from(eventTable)
		.where(eq(eventTable.id, Number(params.id)))
		.limit(1)

	const event = expectOne(events)

	// check if user has a registration for this event
	const [registration] = await db
		.select()
		.from(registrationTable)
		.where(
			and(
				eq(registrationTable.eventId, event.id),
				eq(registrationTable.userId, user.id),
			),
		)

	return { event, registration: registration ?? null }
}

export default function EventDetailsPage({ loaderData }: Route.ComponentProps) {
	const { event, registration } = loaderData

	const isRegistered = !!registration

	return (
		<div>
			<h1>Event</h1>
			<pre>{JSON.stringify(event)}</pre>

			<ApplicationForm isRegistered={isRegistered} />
		</div>
	)
}

const schema = z.object({
	message: z.string(),
	intent: z.enum(["apply"]).default("apply"),
})

const ApplicationForm = ({ isRegistered }: { isRegistered: boolean }) => {
	const fetcher = useFetcher()

	const [form, fields] = useForm({
		lastResult: fetcher.data,
		constraint: getZodConstraint(schema),
	})

	if (isRegistered) {
		return (
			<div>
				<span>Már jelentkeztél erre az eseményre</span>
			</div>
		)
	}

	return (
		<div>
			<fetcher.Form method="post" {...getFormProps(form)}>
				<label htmlFor={fields.message.id}>Üzenet</label>
				<input {...getInputProps(fields.message, { type: "text" })} />
				<input {...getInputProps(fields.intent, { type: "hidden" })} />
				<button type="submit">jelentkezek</button>
			</fetcher.Form>
		</div>
	)
}

export async function action({ request, params }: Route.ActionArgs) {
	const { user } = await requireSession(request)
	const submission = parseWithZod(await request.formData(), { schema })

	if (submission.status != "success") {
		return submission.reply()
	}

	try {
		// insert player into the roster
		// TODO: transaction

		// find the index of the default (0) faction in the event
		const [faction] = await db
			.select()
			.from(factionsTable)
			.where(
				and(
					eq(factionsTable.eventId, Number(params.id)),
					eq(factionsTable.order, 0),
				),
			)

		// the page gets revalidated, so loader should indicate success and doesnt need to
		// return any data trough comform, onConflictDoNothing will skip insertion
		await db
			.insert(registrationTable)
			.values({
				userId: user.id,
				eventId: Number(params.id),
				message: submission.value.message ?? null,
				factionId: faction.id,
			})
			.onConflictDoNothing()

		return submission.reply()
	} catch (err) {
		console.log(err)
		return submission.reply({ formErrors: ["sikertelen jelentkezés"] })
	}
}
