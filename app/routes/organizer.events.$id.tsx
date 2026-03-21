import { eq } from "drizzle-orm"
import { EventTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/organizer.events.$id"

export async function loader({ params }: Route.LoaderArgs) {
	const event = await db
		.select()
		.from(EventTable)
		.where(eq(EventTable.id, Number(params.id)))

	if (event.length != 1) {
		throw new Error("nincs ilyen esemeny!")
	}

	return { event: event[0] }
}

export default function EventSummary({ loaderData }: Route.ComponentProps) {
	const { event } = loaderData

	return (
		<div>
			<h1>Esemeny osszefoglalo oldal</h1>

			<h2>{event.title}</h2>
		</div>
	)
}
