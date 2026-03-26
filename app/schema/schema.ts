import { date, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { user } from "./auth-schema"

export const loggingTable = pgTable("loggin", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	message: text().notNull(),
})

export const statusEnum = pgEnum("status", ["pending", "accepted", "rejected"])

export const organizerApplicationsTable = pgTable("organizer_applications", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text().references(() => user.id, { onDelete: "set null" }),
	message: text().notNull(),
	createdAt: date().defaultNow().notNull(),
	status: statusEnum().notNull().default("pending"),
	rejectionReason: text(),
})
export type OrganizerApplicationsSelect =
	typeof organizerApplicationsTable.$inferSelect

export const eventTable = pgTable("event", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text().references(() => user.id, { onDelete: "set null" }),
	title: text().notNull(),
	createdAt: date().defaultNow().notNull(),
})
export type EventTableInsert = typeof eventTable.$inferInsert
export type EventTableSelect = typeof eventTable.$inferSelect

// players registered up to the event
export const registrationTable = pgTable("registration", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text().references(() => user.id, { onDelete: "set null" }),
	eventId: integer().references(() => eventTable.id, { onDelete: "set null" }),
	message: text(),
	createdAt: date().defaultNow().notNull(),
	factionId: integer().references(()=> factionsTable.id, {onDelete: "set null"})
})

export type RegistrationInsertType = typeof registrationTable.$inferInsert
export type RegistrationSelectType = typeof registrationTable.$inferSelect

// factions per event 
export const factionsTable = pgTable("factions", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	eventId: integer().references(()=> eventTable.id, {onDelete: "cascade"}),
	name: text().notNull().unique()
})