import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { and, eq } from "drizzle-orm"
import { useFetcher } from "react-router"
import z from "zod"
import { eventTable, registrationTable } from "~/schema/schema"
import { auth } from "~/services/auth.server"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app.event.$id"

export async function loader({ params, request }: Route.LoaderArgs) {
	const session = await auth.api.getSession(request)

	if (!session) throw new Response("nem engedélyezett", { status: 401 })

	const { user } = session

	const events = await db
		.select()
		.from(eventTable)
		.where(eq(eventTable.id, Number(params.id)))
		.limit(1)

	if (events.length != 1) {
		throw new Response("nincs ilyen esemény", { status: 404 })
	}

	const event = events[0]

	// check if user has a registration for this event
	const registrations = await db
		.select()
		.from(registrationTable)
		.where(
			and(
				eq(registrationTable.eventId, event.id),
				eq(registrationTable.userId, session.user.id),
			),
		)

	// might want to use some information from this like "signed up at", dont convert to bool
	const registration = registrations[0] ?? null

	return { event, registration }
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
				<label htmlFor={fields.message.id}>uzenet</label>
				<input {...getInputProps(fields.message, { type: "text" })} />
				<input {...getInputProps(fields.intent, { type: "hidden" })} />
				<button type="submit">jelentkezek</button>
			</fetcher.Form>
		</div>
	)
}

export async function action({ request, params }: Route.ActionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema })

	if (submission.status != "success") {
		return submission.reply()
	}

	const session = await auth.api.getSession(request)
	if (!session) throw new Response("nem engedélyezett", { status: 401 })

	try {
		// insert player into the roster
		// look out for reinsertion
		const result = await db
			.insert(registrationTable)
			.values({
				userId: session.user.id,
				eventId: Number(params.id),
				message: submission.value.message ?? null,
			})
			.onConflictDoNothing({
				target: [registrationTable.userId, registrationTable.eventId],
			})
			.returning({ id: registrationTable.id })

		// the page gets revalidated, so loader should indicate success and doesnt need to
		// return any data trough comform
		return submission.reply()
	} catch (err) {
		console.log(err)
		return submission.reply({ formErrors: ["sikertelen jelentkezés"] })
	}
}
