import { Outlet } from "react-router"
import { PageHeader } from "~/components/header"

export default function AppLayout() {
	return (
		<div className="flex flex-col px-4 py-6 min-h-screen">
			<PageHeader />
			<Outlet />
		</div>
	)
}
