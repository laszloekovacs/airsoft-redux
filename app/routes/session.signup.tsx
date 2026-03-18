import { getFormProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { Form } from "react-router"
import { z } from "zod"
import { auth } from "~/services/auth.server"
import { logger } from "~/services/pino.server"
import type { Route } from "./+types/session.signup"



const schema = z.object({
    email: z.email(),
    password: z.string(),
    username: z.string()
})


export default function SignupPage() {

    const [form] = useForm({
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema
            })
        }
    })


    return (
        <div>
            <h1>Signup page</h1>

            <Form method="post" {...getFormProps(form)}>

                <input type="email" name="email" id="email" />
                <input type="password" name="password" id="" />
                <input type="text" name="username" id="" />

                <button type="submit" name="intent" value="signup">regisztrálok</button>
            </Form>


        </div>
    )
}


export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    const form = schema.parse(data)

    // create the user entry in the database
    await auth.api.signUpEmail({
        body: {
            name: form.username,
            username: form.username,
            email: form.email,
            password: form.password,
            callbackURL: "/"
        }
    })

    logger.info(form)

    return form
} 