import { Outlet } from "react-router";
import { auth } from "~/services/auth.server";
import type { Route } from "./+types/organizer"


export async function loader({ request }: Route.LoaderArgs) {
    // route guard
    const permission = await auth.api.userHasPermission({
        body: {
            role: "user",
            permissions: {
            }
        }
    })

    if (!permission.success) {
        throw new Error("permission denied")
    }

    return {}
}


// layout, organizer role guard
export default function OrganizerPage() {

    return (
        <div>
            <Outlet />
        </div>
    )
}