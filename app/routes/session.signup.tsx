import { getFormProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"


import { Form } from "react-router"
import { z } from "zod"
import { authClient } from "~/services/auth.client"


const schema = z.object({
    email: z.email(),
    password: z.string(),
    username: z.string()
})


export default function SignupPage() {

    const [form, fields] = useForm({
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema
            })
        },
        onSubmit: async (event, { formData }) => {
            event.preventDefault()

            const data = Object.fromEntries(formData)
            const fields = schema.parse(data)

            await authClient.signUp.email({
                email: fields.email,
                password: fields.password,
                username: fields.username,
                name: fields.username
            })

        }
    })


    return (
        <div>
            <p>login page</p>

            <Form method="post" {...getFormProps(form)}>

                <input type="email" name="email" id="email" />
                <input type="password" name="password" id="" />
                <input type="text" name="username" id="" />

                <button type="submit" name="intent" value="signup">regisztrálok</button>
            </Form>


        </div>
    )
}