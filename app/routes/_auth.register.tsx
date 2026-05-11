import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { isAPIError } from "better-auth/api"
import { useState } from "react"
import { Form, Link, redirect, useNavigation } from "react-router"
import { z } from "zod"
import { Cap } from "~/components/cap"
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
import type { Route } from "./+types/_auth.register"

const schema = z.object({
	captoken: z.string(),
	email: z.email(),
	password: z.string().min(8, {
		message: "Jelszó túl rövid, legalább 8 karakter kell hogy legyen",
	}),
	username: z
		.string()
		.min(4, { message: "túl rövid felhasználó név, legalább 4 karakter" }),
	intent: z.enum(["signup"]),
})


export const loader = () => {

	const capendpoint = airsoft.env.CAP_CONNECTION_STRING

	return { capendpoint }
}


export default function SignupPage({ actionData, loaderData }: Route.ComponentProps) {
	const lastResult = actionData
	const navigation = useNavigation()
	const [isCapSolved, setCapSolved] = useState(false)
	const isIdle = navigation.state == "idle"

	const canSubmit = (isCapSolved && isIdle)

	const handleCapSolve = (e: { detail: { token: string } }) => {
		setCapSolved(true)
		return { token: e.detail.token }
	}

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema,
			})
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<h1 className="font-bold text-2xl">Fiok letrehozasa</h1>

				<Form method="post" {...getFormProps(form)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={fields.email.id}>Email</FieldLabel>
							<Input {...getInputProps(fields.email, { type: "email" })} />
							<FieldError>{fields.email.errors}</FieldError>
						</Field>

						<Field>
							<FieldLabel htmlFor={fields.password.id}>Jelszó</FieldLabel>
							<Input
								{...getInputProps(fields.password, { type: "password" })}
							/>
							<FieldError>{fields.password.errors}</FieldError>
						</Field>

						<Field>
							<FieldLabel htmlFor={fields.username.id}>
								Felhasznalo nev
							</FieldLabel>
							<Input {...getInputProps(fields.username, { type: "text" })} />
							<FieldDescription>
								Ezen a neven fogsz szerepelni a jelentkezesekben es a
								hozzaszolasokban
							</FieldDescription>
							<FieldError>{fields.username.errors}</FieldError>
						</Field>

						<Cap endpoint={loaderData.capendpoint} onSolve={handleCapSolve} />

						<Field>
							<Button
								type="submit"
								name="intent"
								value="signup"
								disabled={!canSubmit}
							>
								{isIdle ? "Regisztrálok" : "létrehozás..."}
							</Button>
						</Field>

						<FieldError>{form.errors && <p>{form.errors}</p>}</FieldError>
					</FieldGroup>


				</Form>

				<Field>
					<span>
						<span>már van fiókod?&nbsp;</span>
						<Link className="underline underline-offset-4" to="/login">
							jelentkezz be!
						</Link>
					</span>
				</Field>
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

	console.log(submission.value)

	try {
		const authResponse = await airsoft.auth.api.signUpEmail({
			body: {
				username: submission.value.username,
				name: submission.value.username,
				email: submission.value.email,
				password: submission.value.password,
				callbackURL: "/account",
				claims: []
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
				formErrors: [`${error.message}: ${error.status}`],
			})
		}

		if (error instanceof Error) {
			return submission.reply({
				formErrors: [error.message],
			})
		}

		return submission.reply({
			formErrors: ["ismeretlen hiba"],
		})
	}
}
