import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { Form, Link, useNavigation } from "react-router"
import z from "zod"
import type { Route } from "./+types/session.login"

const schema = z.object({
    username: z.string(),
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
                    <label htmlFor={fields.username.id}>felhasználó nev</label>
                    <input {...getInputProps(fields.username, { type: "text" })} />
                    <div className="bg-red-500"> {fields.username.errors}</div>
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
                    <Link to="/session/signup">regisztralj</Link>
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

    return submission.reply()
}
