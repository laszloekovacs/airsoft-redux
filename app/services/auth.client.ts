import { usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
//import { env } from "~/services/env.server"

export const authClient = createAuthClient({
	baseURL: "http://localhost:3000", //env.BETTER_AUTH_URL,
	plugins: [usernameClient()],
})
