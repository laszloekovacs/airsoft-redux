import { redirect } from "react-router"
import { auth } from "~/services/auth.server"
import type { Route } from "./+types/account"

export async function loader({ request }: Route.LoaderArgs) {
    const data = await auth.api.getSession(request)

    if (!data) {
        throw redirect("login")
    }

    return { session: data.session, user: data.user }
}

export default function AccountPage({ loaderData }: Route.ComponentProps) {
    const { user } = loaderData

    return (
        <div>
            <h1>Felhasznalo fiok</h1>

            <p>{user.email}</p>
            <p>{user.name}</p>
        </div>
    )
}
