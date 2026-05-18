import { Outlet, redirect } from "react-router"
import { hasClaims, requireSession } from "~/functions/auth-guard.server"
import type { Route } from "./+types/_app.organizer"

export async function loader({ request }: Route.LoaderArgs) {

	const { user } = await requireSession(request)


	const isOrganizer = await hasClaims(user.claims, "organizer")

	if (!isOrganizer) {
		return redirect("/login")
	}

	return { user }
}

// layout, organizer role guard
export default function OrganizerPage({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData

	return (
		<div className="flex flex-col min-h-svh p-6 md:p-10">
			<div className="w-full max-w-md">
				<h1 className="text-2xl mb-4">Szervező oldal</h1>
				<Outlet context={user} />
			</div>
		</div>
	)
}
