import { Outlet } from "react-router"
import { auth } from "~/services/auth.server"
import type { Route } from "./+types/organizer"

export async function loader({ request }: Route.LoaderArgs) {
    // route guard
    const permission = await auth.api.userHasPermission({
        body: {
            role: "user",
            permissions: {
                event: ["apply"],
            },
        },
    })

    if (!permission.success) {
        throw new Error("permission denied")
    }

    const authResult = await auth.api.getSession({
        headers: request.headers,
    })

    if (!authResult) {
        throw new Error("session data unavailable")
    }

    return { user: authResult.user }
}

// layout, organizer role guard
export default function OrganizerPage({ loaderData }: Route.ComponentProps) {
    const { user } = loaderData

    return (
        <div>
            <Outlet context={user} />
        </div>
    )
}
