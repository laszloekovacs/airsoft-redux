import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { username } from "better-auth/plugins"
import { db } from "~/services/drizzle.server"

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
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
