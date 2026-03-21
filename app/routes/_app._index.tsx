import { Link } from "react-router"
import { EventTable, type EventTableSelect } from "~/schema/schema"
import type { SessionData } from "~/services/auth.server"
import { auth } from "~/services/auth.server"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app._index"

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "Airsoft Naptar" },
		{ name: "description", content: "Magyarorszag legnagyobb airsoft oldala" },
	]
}

export async function loader({ request }: Route.LoaderArgs) {
	// session data
	const session = await auth.api.getSession(request)

	// fetch new events
	const events = await db.select().from(EventTable).limit(10)

	return { session, events }
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { events, session } = loaderData

	return (
		<div>
			<div>
				<h1>Airsoft naptar</h1>
				<SessionInfo session={session} />
			</div>
			<EventList events={events} />
		</div>
	)
}

// user accound display
const SessionInfo = ({ session }: { session: SessionData | null }) => {
	if (!session) return <div>no session</div>

	const { user } = session

	return (
		<div>
			<p>{user.username}</p>
		</div>
	)
}

// list events
const EventList = ({ events }: { events?: EventTableSelect[] }) => {
	if (!events || events?.length == 0) {
		return <div>nincs aktualis esemeny</div>
	}

	const list = events?.map((item) => (
		<li key={item.id}>
			<Link to={`/event/${item.id}`}>
				<p>{item.title}</p>
			</Link>
		</li>
	))

	return (
		<div>
			<p>Esmenyek</p>
			<ul>{list}</ul>
		</div>
	)
}
