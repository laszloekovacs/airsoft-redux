import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { Form, redirect } from "react-router"
import z from "zod"
import expectOne from "~/functions/expectone"
import requireSession from "~/functions/requiresession"
import { eventTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/organizer.events.new"

const schema = z.object({
	title: z
		.string({ error: "kotelezo kitolteni" })
		.min(5, { error: "a nev tul rovid" }),
})

export default function NewEventForm({ actionData }: Route.ComponentProps) {
	const lastResult = actionData

	const [form, fields] = useForm({
		lastResult,
		constraint: getZodConstraint(schema),
		shouldValidate: "onBlur",
		shouldRevalidate: "onBlur",
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema,
			})
		},
	})

	return (
		<div>
			<Form method="post" {...getFormProps(form)}>
				<label htmlFor={fields.title.id}>esemeny neve</label>
				<input {...getInputProps(fields.title, { type: "text" })} />
				<p id={fields.title.errorId}>{fields.title.errors}</p>

				<button type="submit">letrehoz</button>
			</Form>
		</div>
	)
}

export async function action({ request }: Route.ActionArgs) {
	const { user } = await requireSession(request)

	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema })

	if (submission.status != "success") {
		return submission.reply()
	}

	// create an event in the database with a provided name
	const result = await db
		.insert(eventTable)
		.values({
			title: submission.value.title,
			userId: user.id,
		})
		.returning()

	expectOne(result, {
		notFound() {
			throw new Error("nem sikerult az esemenyt letrehozni!")
		},
	})

	return redirect(`/organizer/events/${result[0].id}`)
}
