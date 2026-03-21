import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { eq } from "drizzle-orm"
import { redirect, useFetcher } from "react-router"
import z from "zod"
import { eventRoster, eventTable } from "~/schema/schema"
import { auth } from "~/services/auth.server"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app.event.$id"

export async function loader({ params }: Route.LoaderArgs) {
	const events = await db
		.select()
		.from(eventTable)
		.where(eq(eventTable.id, Number(params.id)))

	if (events.length != 1) {
		throw new Error("nincs ilyen esemeny")
	}

	return { event: events[0] }
}

export default function EventDetailsPage({ loaderData }: Route.ComponentProps) {
	const { event } = loaderData

	return (
		<div>
			<h1>Event</h1>
			<pre>{JSON.stringify(event)}</pre>

			<div>
				<ApplicationForm />
			</div>
		</div>
	)
}

const schema = z.object({
	message: z.string(),
	intent: z.enum(["apply"]).default("apply"),
})

// props should be event id and userid

const ApplicationForm = () => {
	const fetcher = useFetcher()

	const [form, fields] = useForm({
		lastResult: fetcher.data,
		constraint: getZodConstraint(schema),
		shouldRevalidate: "onBlur",
		shouldValidate: "onBlur",
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema,
			})
		},
	})

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

	try {
		// get user id
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		console.log(session?.user.id)

		if (!session) throw new Error("user required")

		console.log("jelentkeztel")

		// insert player into the roster
		// look out for reinsertion
		const result = await db
			.insert(eventRoster)
			.values({
				userId: session.user.id,
				eventId: Number(params.id),
				message: submission.value.message ?? null,
			})
			.returning({ id: eventRoster.id })

		return redirect("/")
		//		return submission.reply
	} catch (_) {
		return submission.reply({ formErrors: ["sikertelen jelentkezes"] })
	}
}
