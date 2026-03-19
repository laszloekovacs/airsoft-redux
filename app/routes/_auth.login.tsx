import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { isAPIError } from "better-auth/api"
import { Form, Link, useNavigation } from "react-router"
import z from "zod"
import { auth } from "~/services/auth.server"
import { logger } from "~/services/pino.server"
import type { Route } from "./+types/_auth.login"

const schema = z.object({
    email: z.email(),
    password: z.string(),
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
        shouldRevalidate: "onInput",
    })

    return (
        <div>
            <h1>login page</h1>

            <Form method="post" {...getFormProps(form)}>
                <div>
                    <label htmlFor={fields.email.id}>email</label>
                    <input {...getInputProps(fields.email, { type: "email" })} />
                    <div className="bg-red-500"> {fields.email.errors}</div>
                </div>
                <div>
                    <label htmlFor={fields.password.id}>jelszo</label>
                    <input {...getInputProps(fields.password, { type: "password" })} />
                    <div className="bg-red-500"> {fields.password.errors}</div>
                </div>

                <button
                    type="submit"
                    name="intent"
                    value="login"
                    disabled={isSubmitting}
                >
                    belepes
                </button>
            </Form>

            <div>{form.errors && <p className="bg-amber-500">{form.errors}</p>}</div>

            <p>
                meg nincs fiokod?
                <span>
                    <Link to="/register">regisztralj!</Link>
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
        return auth.api.signInEmail({
            body: {
                email: submission.value.email,
                password: submission.value.password,
                rememberMe: true,
                callbackURL: "/",
            },
            asResponse: true,
        })
    } catch (error) {
        logger.error(error)

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
