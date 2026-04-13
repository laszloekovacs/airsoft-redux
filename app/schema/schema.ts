import { sql } from "drizzle-orm"
import { date, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core"
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

export const eventTable = pgTable("event", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text().references(() => user.id, { onDelete: "set null" }),
	title: text().notNull(),

	// string array for filter and search
	tags: text().array().notNull().default(sql`ARRAY[]::text[]`),

	createdAt: date().defaultNow().notNull(),
	deletedAt: date(),
})

// players registered up to the event
export const registrationTable = pgTable("registration", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text().references(() => user.id, { onDelete: "set null" }),
	eventId: integer().references(() => eventTable.id, { onDelete: "cascade" }),
	message: text(),
	createdAt: date().defaultNow().notNull(),
	// name of faction, null or empty means unasigned
	faction: text(),
})
