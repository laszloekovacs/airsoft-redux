import { Outlet } from "react-router"
import { PageHeader } from "~/components/header"
import { HeaderLinks } from "~/components/headerlinks"
import { auth } from "~/services/auth.server"
import type { Route } from "./+types/_app"
import { SessionInfo } from "~/components/ui/sessioninfo"

export async function loader({ request }: Route.ActionArgs) {
	const sessionData = await auth.api.getSession(request)

	return { sessionData }
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
	const { sessionData } = loaderData

	const isAdmin = sessionData?.user?.role == "admin"
	const isOrganizer = isAdmin || sessionData?.user?.role == "organizer"

	return (
		<div className="flex flex-col px-4 py-6 min-h-screen">
			<div>
				<PageHeader />
				<SessionInfo session={sessionData} />
				<HeaderLinks isAdmin={isAdmin} isOrganizer={isOrganizer} />
				<Outlet />
			</div>
		</div>
	)
}
