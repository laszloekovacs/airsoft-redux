import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { Form, redirect } from "react-router"
import z from "zod"
import { EventTable } from "~/schema/schema"
import { auth } from "~/services/auth.server"
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
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema })

	if (submission.status != "success") {
		return submission.reply()
	}

	// get the users id
	const session = await auth.api.getSession(request)
	if (!session) {
		throw new Error("nincs bejelentkezve")
	}

	// create an event in the database with a provided name
	const result = await db
		.insert(EventTable)
		.values({
			title: submission.value.title,
			userId: session.user.id,
		})
		.returning()

	if (result.length == 0) {
		throw new Error("nem sikerult letrehozni az esemenyt")
	}

	return redirect(`/organizer/events/${result[0].id}`)
}
