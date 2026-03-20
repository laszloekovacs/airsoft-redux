import { drizzle } from "drizzle-orm/node-postgres"
import { reset, seed } from "drizzle-seed"
import { user } from "~/schema/auth-schema"
import { env } from "~/services/env.server"

async function main() {
	console.log("seeding...")
	const db = drizzle(env.DATABASE_URL)
	await reset(db, { user })
	await seed(db, { user }).refine((f) => ({
		user: {
			columns: {
				role: f.valuesFromArray({
					values: ["user", "organizer", "admin"],
				}),
			},
		},
	}))

	console.log("database seeded")
}

main()
