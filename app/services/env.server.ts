import { z } from "zod"

const defaultConnectionString = "postgres://postgres:5435@localhost/airsoft"
const defaultAuthSecret = "dummy_secret_dummy_secret_dummy_secret"
const defaultAuthUrl = "http://localhost:3000"

const envSchema = z.object({
	NODE_ENV: z
		.enum(["developement", "test", "production"])
		.default("developement"),
	DATABASE_URL: z.string().default(defaultConnectionString),
	BETTER_AUTH_SECRET: z.string().default(defaultAuthSecret),
	BETTER_AUTH_URL: z.string().default(defaultAuthUrl),
})

const _env = envSchema.parse(process.env)

export const env = _env
