import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin as adminPlugin } from "better-auth/plugins/admin"
import { username } from "better-auth/plugins/username"
import * as authSchema from "~/schema/auth-schema"
import * as schema from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import { env } from "./env.server"
import { ac, admin, organizer, user } from "./permissions.server"

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
		adminPlugin({
			ac,
			roles: {
				admin,
				user,
				organizer,
			},
			defaultRole: "user",
		}),

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
