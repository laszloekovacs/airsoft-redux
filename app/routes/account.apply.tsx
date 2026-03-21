import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { Form, redirect } from "react-router"
import { z } from "zod"
import { organizerApplicationsTable } from "~/schema/schema"
import { auth } from "~/services/auth.server"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/account.apply"

const schema = z.object({
	message: z.string({ error: "kotelezo kitolteni a mezot" }),
	intent: z.enum(["applyAsOrganizer"]),
})

// TODO: handle already applied, accepted, rejected
export default function ApplicationForm({ actionData }: Route.ComponentProps) {
	const lastResult = actionData

	const [form, fields] = useForm({
		lastResult,
		constraint: getZodConstraint(schema),
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema,
			})
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onBlur",
	})

	return (
		<div>
			<h1>jelentkezz szervezonek</h1>
			<p>szervezokent tudsz esemenyeket letrehozni.</p>

			<Form method="post" {...getFormProps(form)}>
				<label htmlFor={fields.message.id}>uzenet</label>
				<input {...getInputProps(fields.message, { type: "text" })} />
				<div id={fields.message.errorId}>{fields.message.errors}</div>
				<button type="submit" name="intent" value="applyAsOrganizer">
					jelentkezem
				</button>
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

	// get the current users id
	const sessionData = await auth.api.getSession(request)
	if (!sessionData) {
		throw Error("Auth error")
	}

	//  create application in the database
	const { user } = sessionData
	const result = createOrganizerApplication(user.id, submission.value.message)

	if (!result) {
		throw new Error("belso hiba: sikertelen jelentkezes")
	}

	return redirect("/account")
}

async function createOrganizerApplication(
	userId: string,
	message: string,
): Promise<string | null> {
	const result = await db
		.insert(organizerApplicationsTable)
		.values({
			message,
			userId,
		})
		.returning({ id: organizerApplicationsTable.id })

	if (result.length == 0) {
		return null
	}

	return result[0].id.toString()
}
