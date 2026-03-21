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


export const eventTable = pgTable("event", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text().references(()=> user.id, {onDelete: "set null"}),
	title: text().notNull(),
	createdAt: date().defaultNow().notNull()
})
export type EventTableInsert = typeof eventTable.$inferInsert
export type EventTableSelect = typeof eventTable.$inferSelect


// players applied to the event
export const eventRoster = pgTable("event_roster", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text().references(()=> user.id, {onDelete: "set null"}),
	eventId: integer().references(() => eventTable.id, {onDelete: "set null" } ),
	message: text(),
	createdAt: date().defaultNow().notNull(),
	faction: text().default("null")
})

export type EventRosterInsertType = typeof eventRoster.$inferInsert
export type EventRosterSelectType = typeof eventRoster.$inferSelect