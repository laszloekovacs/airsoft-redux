import { Outlet } from "react-router"
import { PageHeader } from "~/components/header"
import requireSession from "~/functions/requiresession"
import type { Route } from "./+types/account"

export async function loader({ request }: Route.LoaderArgs) {
	const { session, user } = await requireSession(request)

	return { session, user }
}

export default function AccountPage({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData

	return (
		<div className="flex flex-col min-h-screen px-6 py-6">
			<PageHeader />
			<h1>Felhasználó fiók</h1>

			<h2>{user.username}</h2>
			<p>{user.email}</p>

			<img
				src={user.image ?? "https://picsum.photos/150/150"}
				alt={`${user.name} profilképe`}
				width={150}
			/>

			<Outlet />
		</div>
	)
}
