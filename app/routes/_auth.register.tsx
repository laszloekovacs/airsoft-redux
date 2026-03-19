import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { isAPIError } from "better-auth/api"
import { Form, Link, useNavigation } from "react-router"
import { z } from "zod"
import { auth } from "~/services/auth.server"
import { logger } from "~/services/pino.server"
import type { Route } from "./+types/_auth.register"

const schema = z.object({
    email: z.email(),
    password: z.string().min(8, {
        message: "Jelszó túl rövid, legalább 8 karakter kell hogy legyen",
    }),
    username: z
        .string()
        .min(4, { message: "túl rövid felhasználó név, legalább 4 karakter" }),
    intent: z.enum(["signup"]),
})

export default function SignupPage({ actionData }: Route.ComponentProps) {
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
        shouldRevalidate: "onInput",
    })

    return (
        <div>
            <h1>Signup page</h1>

            <Form method="post" {...getFormProps(form)}>
                <div>
                    <label htmlFor={fields.email.id}>Email</label>
                    <input {...getInputProps(fields.email, { type: "email" })} />
                    <div className="bg-red-400">{fields.email.errors}</div>
                </div>

                <div>
                    <label htmlFor={fields.password.id}>Jelszó</label>
                    <input {...getInputProps(fields.password, { type: "password" })} />
                    <div className="bg-red-400">{fields.password.errors}</div>
                </div>

                <div>
                    <label htmlFor={fields.username.id}>név</label>
                    <input {...getInputProps(fields.username, { type: "text" })} />
                    <div className="bg-red-400">{fields.username.errors}</div>
                </div>

                <button
                    type="submit"
                    name="intent"
                    value="signup"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "létrehozás..." : "Regisztrálok"}
                </button>

                <div>
                    {form.errors && <p className="bg-amber-500">{form.errors}</p>}
                </div>
            </Form>

            <p>
                már van fiókod?{" "}
                <span>
                    <Link to="/login">jelentkezz be</Link>
                </span>
            </p>
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
        return auth.api.signUpEmail({
            body: {
                username: submission.value.username,
                name: submission.value.username,
                email: submission.value.email,
                password: submission.value.password,
                callbackURL: "/"
            },
            asResponse: true,
        })
    } catch (error) {
        logger.error(error)

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
