import {date, integer, pgTable, text, uuid} from "drizzle-orm/pg-core"
import { user } from "./auth-schema"

export const loggingTable = pgTable("loggin", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	message: text().notNull(),
})

export const organizerApplicationsTable = pgTable("organizer_applications", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text().references(() => user.id, { onDelete: "set null"}),
	message: text().notNull(),
	createdAt: date().defaultNow().notNull(),
})
export type OrganizerApplicationsSelect = typeof organizerApplicationsTable.$inferSelect


export const EventTable = pgTable("event", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text().references(()=> user.id, {onDelete: "set null"}),
	title: text().notNull(),
	createdAt: date().defaultNow().notNull()
})
export type EventTableInsert = typeof EventTable.$inferInsert
export type EventTableSelect = typeof EventTable.$inferSelect