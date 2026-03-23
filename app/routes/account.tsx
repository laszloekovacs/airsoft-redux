import { Outlet, redirect } from "react-router"
import { PageHeader } from "~/components/header"
import { auth } from "~/services/auth.server"
import type { Route } from "./+types/account"

export async function loader({ request }: Route.LoaderArgs) {
	const data = await auth.api.getSession(request)

	if (!data) {
		throw redirect("/login")
	}

	return { session: data.session, user: data.user }
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
