import * as d from "drizzle-orm/pg-core"

export const loggingTable = d.pgTable("loggin", {
	id: d.integer().primaryKey().generatedAlwaysAsIdentity(),
	message: d.text().notNull(),
})
