import { redirect } from "react-router"
import { auth } from "~/services/auth.server"

export default async function requireSession(request: Request, redirectTo = "/login") {
    const session = await auth.api.getSession(request)
    if (!session) {
        throw redirect(redirectTo)
    }
}