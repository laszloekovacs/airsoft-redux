import React, { Suspense } from "react"
import {
	type OrganizerApplicationsSelect,
	organizerApplicationsTable,
} from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/admin.applications"

export async function loader(_args: Route.LoaderArgs) {
	// load applications
	const applicationsPromise = db
		.select()
		.from(organizerApplicationsTable)
		.execute()

	// stream results to frontend
	return { applicationsPromise }
}

// list applications and allow accepting rejecting apps
export default function Applications({ loaderData }: Route.ComponentProps) {
	const { applicationsPromise } = loaderData

	return (
		<div>
			<h2>Jelentkezok</h2>

			<Suspense fallback={<p>loading...</p>}>
				<ApplicaitonList listPromise={applicationsPromise} />
			</Suspense>
		</div>
	)
}

type ApplicationListProps = {
	listPromise: Promise<OrganizerApplicationsSelect[]>
}

const ApplicaitonList = ({ listPromise }: ApplicationListProps) => {
	const list = React.use(listPromise)

	return (
		<ul>
			{list?.map((item) => (
				<li key={item.id}>
					<p>{item.userId}</p>
					<p>{item.message}</p>

					<button type="button">accept</button>
				</li>
			))}
		</ul>
	)
}
