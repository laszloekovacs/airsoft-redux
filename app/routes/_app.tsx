import { Outlet } from "react-router"
import { PageHeader } from "~/components/header"
import { HeaderLinks } from "~/components/headerlinks"
import { HeartbeatProvider } from "~/components/HeartbeatProvider"
import { SessionInfo } from "~/components/ui/sessioninfo"
import { auth } from "~/services/auth.server"
import type { Route } from "./+types/_app"

export async function loader({ request }: Route.ActionArgs) {
	const sessionData = await auth.api.getSession(request)

	return { sessionData }
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
	const { sessionData } = loaderData

	const isAdmin = sessionData?.user?.role == "admin"
	const isOrganizer = isAdmin || sessionData?.user?.role == "organizer"

	return (
		<HeartbeatProvider userId={sessionData?.user.id ?? null}>
			<div className="flex flex-col px-4 py-6 min-h-screen items-center">
				<div className="flex flex-row w-full max-w-xl justify-between items-baseline">
					<PageHeader />
					<HeaderLinks isAdmin={isAdmin} isOrganizer={isOrganizer} />
					<SessionInfo session={sessionData} />
				</div>
				<div className="w-full max-w-xl">
					<Outlet />
				</div>
			</div>
		</HeartbeatProvider>
	)
}
