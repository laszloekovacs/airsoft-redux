import {redirect} from "react-router"
import { auth} from "~/services/auth.server"


type Role = "user" | "organizer" | "admin"

export async function requireAuth(request: Request) {
    const session = await auth.api.getSession(request)

    if(!session) throw redirect("/login")
        
    return session
}


export async function requireRole(request: Request, ...roles: Role[]) {
    const session = await requireAuth(request)

    if(!roles.includes(session.user.role as Role)) {
        throw redirect("/unauthorized")
    }

    return session
}