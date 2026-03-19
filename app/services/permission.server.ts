import { createAccessControl } from "better-auth/plugins/access"

// avalilable actions that need permission
export const statement = {
	event: ["apply", "create", "update", "delete", "admin"],
} as const

export const ac = createAccessControl(statement)

export const user = ac.newRole({
	event: ["apply"],
})

export const organizer = ac.newRole({
	event: ["apply", "create", "delete", "update"],
})

export const admin = ac.newRole({
	event: ["apply", "create", "delete", "update", "admin"],
})
