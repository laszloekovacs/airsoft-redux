import { redirect } from "react-router"
import { auth } from "~/services/auth.server"

export async function requireAuth(request: Request) {
	const session = await auth.api.getSession(request)

	if (!session) throw redirect("/login")

	return session
}

export async function haveClaims(claims: string[], ...required: string[]) {
	return required.every((claim) => claims.includes(claim))
}
