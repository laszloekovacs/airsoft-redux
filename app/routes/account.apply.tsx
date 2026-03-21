import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { Form, redirect } from "react-router"
import { z } from "zod"
import type { Route } from "./+types/account.apply"

const schema = z.object({
	message: z.string({ error: "kotelezo kitolteni a mezot" }),
	intent: z.enum(["applyAsOrganizer"]),
})

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
	console.log("creating account")
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema })

	if (submission.status != "success") {
		return submission.reply()
	}

	//  create applycation in the database
	// return sub reply with formErrors filled out

	throw redirect("/account")
}
