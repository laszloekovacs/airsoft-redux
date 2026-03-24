import { eq } from "drizzle-orm"
import expectOne from "~/functions/expectone"
import requireSession from "~/functions/requiresession"
import { user } from "~/schema/auth-schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/profile.$username"

export async function loader({ params, request }: Route.LoaderArgs) {
	await requireSession(request)

	const queryResult = await db
		.select()
		.from(user)
		.where(eq(user.username, params.username))

	const profile = expectOne(queryResult)

	return { profile }
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
