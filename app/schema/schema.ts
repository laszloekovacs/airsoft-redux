import { sql } from "drizzle-orm"
import {
	boolean,
	date,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core"
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

	discussion: integer().references(() => discussionTable.id, {
		onDelete: "set null",
	}),
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

// holds the comment section, other tables and comments have references to this
export const discussionTable = pgTable("discussion", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	active: boolean().default(true),
})

// holds a comment by user
export const commentTable = pgTable("comment", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	discussionId: integer().references(() => discussionTable.id, {
		onDelete: "cascade",
	}),
	userId: text().references(() => user.id, { onDelete: "set null" }),
	message: text(),
	createdAt: timestamp().defaultNow().notNull(),
})

// alerts sent to the user
export const notificationTable = pgTable("notifications", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	// the user recieving the message
	userId: text().references(() => user.id, { onDelete: "cascade" }),
	content: text(),
	createdAt: timestamp().defaultNow().notNull(),
})
