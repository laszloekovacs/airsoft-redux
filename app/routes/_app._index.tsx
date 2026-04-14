import { Link } from "react-router"
import { eventTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app._index"

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "Airsoft Naptar" },
		{ name: "description", content: "Magyarorszag legnagyobb airsoft oldala" },
	]
}

export async function loader() {
	// fetch new events
	const events = await db.select().from(eventTable).limit(10)

	return { events }
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { events } = loaderData

	return (
		<div>
			<EventList events={events} />
		</div>
	)
}

// list events
const EventList = ({
	events,
}: {
	events?: (typeof eventTable.$inferSelect)[]
}) => {
	if (!events || events?.length == 0) {
		return <div>nincs aktualis esemeny</div>
	}

	const list = events?.map((item) => (
		<li key={item.id}>
			<div className="mb-6">
				<Link to={`/event/${item.id}`}>
					<p>{item.title}</p>
					<img src="https://picsum.photos/400/200" alt="event" />
				</Link>
			</div>
		</li>
	))

	return (
		<div>
			<p>Esmenyek</p>
			<ul>{list}</ul>
		</div>
	)
}
