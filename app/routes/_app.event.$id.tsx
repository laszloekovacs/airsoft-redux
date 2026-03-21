import {
	getCollectionProps,
	getFormProps,
	getInputProps,
	useForm,
} from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { eq } from "drizzle-orm"
import { useFetcher } from "react-router"
import z from "zod"
import { EventTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app.event.$id"

export async function loader({ params }: Route.LoaderArgs) {
	const events = await db
		.select()
		.from(EventTable)
		.where(eq(EventTable.id, Number(params.id)))

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
	const lastResult = fetcher.data

	const [form, fields] = useForm({
		lastResult,
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

export async function action({ request }: Route.ActionArgs) {
	console.log("ello")
}
