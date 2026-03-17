import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["developement", "test", "production"])
		.default("developement"),
});

const _env = envSchema.parse(process.env);

export const env = _env;
