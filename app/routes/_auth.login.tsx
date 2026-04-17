import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { isAPIError } from "better-auth/api"
import { Form, Link, redirect, useNavigation } from "react-router"
import z from "zod"
import { Button } from "~/components/ui/button"
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { airsoft } from "~/services"
import type { Route } from "./+types/_auth.login"

const schema = z.object({
	email: z.email().nonempty(),
	password: z.string().nonempty(),
})

export default function LoginPage({ actionData }: Route.ComponentProps) {
	const lastResult = actionData
	const navigation = useNavigation()
	const isSubmitting = navigation.state != "idle"

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema,
			})
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onSubmit",
	})

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm">
				<h1 className="text-2xl font-bold">Bejelentkezes</h1>

				<Form method="post" {...getFormProps(form)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={fields.email.id} className="font-bold">
								email
							</FieldLabel>
							<Input {...getInputProps(fields.email, { type: "email" })} />
							<FieldError>{fields.email.errors}</FieldError>
						</Field>
						<Field>
							<FieldLabel htmlFor={fields.password.id} className="font-bold">
								jelszo
							</FieldLabel>
							<Input
								{...getInputProps(fields.password, { type: "password" })}
							/>
							<FieldError> {fields.password.errors}</FieldError>
						</Field>
						<Field>
							<Button
								type="submit"
								name="intent"
								value="login"
								disabled={isSubmitting}
							>
								belepes
							</Button>
						</Field>
					</FieldGroup>
				</Form>

				<div>
					{form.errors && <p className="bg-amber-500">{form.errors}</p>}
				</div>

				<FieldDescription className="text-center">
					<span>meg nincs fiokod?</span>

					<Link to="/register" className="underline underline-offset-4">
						regisztralj!
					</Link>
				</FieldDescription>
			</div>
		</div>
	)
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema })

	if (submission.status != "success") {
		return submission.reply()
	}

	try {
		const authResponse = await airsoft.auth.api.signInEmail({
			body: {
				email: submission.value.email,
				password: submission.value.password,
				rememberMe: true,
			},
			headers: request.headers,
			asResponse: true,
		})

		if (!authResponse.ok) {
			return submission.reply({
				formErrors: ["Helytelen email vagy jelszó"],
			})
		}

		// pass the response manually, rr7 would serialize the response
		const setCookie = authResponse.headers.get("set-cookie")
		return redirect("/", {
			headers: {
				...(setCookie ? { "set-cookie": setCookie } : {}),
			},
		})
	} catch (error) {
		airsoft.log.error(error)

		if (isAPIError(error)) {
			return submission.reply({
				formErrors: [`${error.message}`],
			})
		}

		return submission.reply({
			formErrors: ["ismeretlen hiba"],
		})
	}
}
