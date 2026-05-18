import { redirect } from "react-router"
import { auth } from "~/services/auth.server"

export async function requireSession(request: Request, redirectTo = "/login") {
	const session = await auth.api.getSession(request)
	if (!session) {
		throw redirect(redirectTo)
	}

	return session
}

export async function hasClaims(claims: string[], ...required: string[]) {
	return required.every((claim) => claims.includes(claim))
}
