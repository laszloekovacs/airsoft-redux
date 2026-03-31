import { Outlet } from "react-router"
import { PageHeader } from "~/components/header"
import requireSession from "~/functions/requiresession"
import { auth } from "~/services/auth.server"
import type { Route } from "./+types/_app.organizer"

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

	const { user } = await requireSession(request)

	return { user }
}

// layout, organizer role guard
export default function OrganizerPage({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData

	return (
		<div>
			<h1 className="text-body text-2xl mb-4">Szervező oldal</h1>
			<Outlet context={user} />
		</div>
	)
}
