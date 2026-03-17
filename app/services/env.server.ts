import { z } from "zod"

const defaultConnectionString = "postgresql://admin:5435@localhost:5432/airsoft"

const envSchema = z.object({
	NODE_ENV: z
		.enum(["developement", "test", "production"])
		.default("developement"),
	DATABASE_URL: z.string().default(defaultConnectionString),
})

const _env = envSchema.parse(process.env)

export const env = _env
