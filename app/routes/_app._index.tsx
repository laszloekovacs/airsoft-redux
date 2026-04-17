import { asc, gt } from "drizzle-orm"
import { Link } from "react-router"
import { eventTable } from "~/schema/schema"
import { airsoft } from "~/services"
import type { Route } from "./+types/_app._index"

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "Airsoft Naptar" },
		{ name: "description", content: "Magyarorszag legnagyobb airsoft oldala" },
	]
}

const LIMIT = 6

export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url)
	const cursor = Number(url.searchParams.get("cursor"))

	const events = await airsoft.db
		.select()
		.from(eventTable)
		.where(cursor ? gt(eventTable.id, cursor) : undefined)
		.orderBy(asc(eventTable.id))
		.limit(LIMIT)

	const hasMore = events.length == LIMIT
	const items = hasMore ? events.slice(0, LIMIT - 1) : events
	const nextCursor = hasMore ? items[items.length - 1].id : null

	return { events: items, hasMore, nextCursor }
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { events, nextCursor } = loaderData

	return (
		<div>
			<EventList events={events} nextCursor={nextCursor} />
		</div>
	)
}

// list events
const EventList = ({
	events,
	nextCursor,
}: {
	events?: (typeof eventTable.$inferSelect)[]
	nextCursor: number | null
}) => {
	if (!events || events.length == 0) {
		return <div>nincs aktuális esemény</div>
	}

	return (
		<div>
			<p>Események</p>

			<ul>
				{events.map((item) => (
					<li key={item.id} className="mb-6">
						<Link to={`/event/${item.id}`}>
							<p>{item.title}</p>
							<img src="https://picsum.photos/400/300" alt="event" />
						</Link>
					</li>
				))}
			</ul>
			{nextCursor && <Link to={`?cursor=${nextCursor}`}>Következő oldal</Link>}
		</div>
	)
}
