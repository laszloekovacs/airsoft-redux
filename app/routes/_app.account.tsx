import { Outlet } from "react-router"
import requireSession from "~/functions/requiresession"
import type { Route } from "./+types/_app.account"

export async function loader({ request }: Route.LoaderArgs) {
	const { session, user } = await requireSession(request)

	return { session, user }
}

export default function AccountPage({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData

	return (
		<div>
			<h1 className="text-2xl font-bold">Felhasználó fiók</h1>

			<div className="mb-6">
				<p>
					<span>felhasznalo nev: </span>
					<span>{user.username}</span>
				</p>
				<p>
					<span>bejelentkezo email: </span>
					<span>{user.email}</span>
				</p>
			</div>

			<img
				src={user.image ?? "https://picsum.photos/150/150"}
				alt={`${user.name} profilképe`}
				width={150}
			/>

			<Outlet />
		</div>
	)
}
