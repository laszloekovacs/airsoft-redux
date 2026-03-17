import { z } from "zod"

const defaultConnectionString = "postgres://postgres:5435@localhost/airsoft"

const envSchema = z.object({
	NODE_ENV: z
		.enum(["developement", "test", "production"])
		.default("developement"),
	DATABASE_URL: z.string().default(defaultConnectionString),
})

const _env = envSchema.parse(process.env)

export const env = _env
