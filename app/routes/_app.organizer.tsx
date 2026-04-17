import { Outlet } from "react-router"
import requireSession from "~/functions/requiresession"
import { airsoft } from "~/services"
import type { Route } from "./+types/_app.organizer"

export async function loader({ request }: Route.LoaderArgs) {
	// route guard
	const permission = await airsoft.auth.api.userHasPermission({
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
		<div className="flex flex-col min-h-svh p-6 md:p-10">
			<div className="w-full max-w-md">
				<h1 className="text-2xl mb-4">Szervező oldal</h1>
				<Outlet context={user} />
			</div>
		</div>
	)
}
