import { eq } from "drizzle-orm"
import { user } from "~/schema/auth-schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/profile.$username"

export async function loader({ params }: Route.LoaderArgs) {
    // todo: only people with account should be able to see users

    const queryResult = await db
        .select()
        .from(user)
        .where(eq(user.username, params.username))

    return queryResult
}

// user public profile
export default function UserProfilePage({ loaderData }: Route.ComponentProps) {
    if (!loaderData) return <p>nincs ilyen profil</p>

    return (
        <div>
            <p>user profile</p>
            {loaderData && (
                <div>
                    <pre>{JSON.stringify(loaderData)}</pre>
                </div>
            )}
        </div>
    )
}
