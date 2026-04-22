import { pino } from "pino"

export const log = pino({
	transport: {
		target: "pino-pretty",
	},
})

log.info("logging with pino started")
