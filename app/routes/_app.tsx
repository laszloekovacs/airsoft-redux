import { Outlet } from "react-router"
import { HeartbeatProvider } from "~/components/HeartbeatProvider"
import { PageHeader } from "~/components/header"
import { HeaderLinks } from "~/components/headerlinks"
import { SessionInfo } from "~/components/ui/sessioninfo"
import { airsoft } from "~/services"
import type { Route } from "./+types/_app"

export async function loader({ request }: Route.ActionArgs) {
	const sessionData = await airsoft.auth.api.getSession(request)
	return { sessionData }
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
	const { sessionData } = loaderData

	const isAdmin = !!sessionData?.user?.claims.includes("admin")
	const isOrganizer = isAdmin || !!sessionData?.user?.claims.includes("organizer")

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
