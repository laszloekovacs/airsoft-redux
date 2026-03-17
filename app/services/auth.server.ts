import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { createAccessControl } from "better-auth/plugins"
import { db } from "~/services/drizzle.server"

const statement = {
	adminPanel: ["access"],
} as const

const ac = createAccessControl(statement)

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	plugins: [],
})
