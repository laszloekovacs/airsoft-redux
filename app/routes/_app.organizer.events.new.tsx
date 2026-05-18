import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { Form, redirect } from "react-router"
import z from "zod"
import { Button } from "~/components/ui/button"
import { FieldError, FieldGroup, FieldLabel } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { requireSession } from "~/functions/auth-guard.server"
import expectOne from "~/functions/expectone"
import { eventTable } from "~/schema/schema"
import { ar } from "~/services"
import type { Route } from "./+types/_app.organizer.events.new"

const schema = z.object({
	title: z
		.string({ error: "Az esemeny neve mezot kotelezo kitolteni!" })
		.min(5, {
			error: "az esemeny neve hosszabb kell hogy legyen 5 karakternel!",
		}),
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
			<div>
				<p>
					Itt hozhatsz letre uj esemenyt. Az esemeny reszleteit a kovetkezo
					oldalon tudod megadni. Ahhoz hogy jatekosok tudjanak jelentkezni, az
					esemenyt szerkesztes utan meg kell osztanod
				</p>
			</div>

			<Form method="post" {...getFormProps(form)}>
				<FieldGroup>
					<FieldLabel htmlFor={fields.title.id}>esemeny neve</FieldLabel>
					<Input {...getInputProps(fields.title, { type: "text" })} />
					<FieldError>
						<span id={fields.title.errorId}>{fields.title.errors}</span>
					</FieldError>
					<Button type="submit">letrehoz</Button>
				</FieldGroup>
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

	// TODO: transaction
	// create an event in the database with a provided name
	const result = await ar.db
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
