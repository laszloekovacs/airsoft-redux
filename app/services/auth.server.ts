import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { username } from "better-auth/plugins"
import * as authSchema from "~/schema/auth-schema"
import * as schema from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import { env } from "./env.server"

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
			...authSchema,
		},
	}),

	emailAndPassword: {
		enabled: true,
	},

	plugins: [
		username({
			usernameValidator: (username) => {
				if (username == "admin") {
					return false
				}
				return true
			},
		}),
	],
})
