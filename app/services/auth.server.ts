import type { BetterAuthPlugin } from "better-auth"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { username } from "better-auth/plugins/username"
import * as authSchema from "~/schema/auth-schema"
import * as schema from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import { env } from "./env.server"
import { log } from "./pino.server"

const claimsPlugin = () => {
	return {
		id: "claims-plugin",
		schema: {
			user: {
				fields: {
					claims: {
						type: "string[]",
					},
				},
			},
		},
	} satisfies BetterAuthPlugin
}

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
		requireEmailVerification: false,
	},

	plugins: [
		claimsPlugin(),

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

export type SessionData = typeof auth.$Infer.Session

log.info("better auth api created")
