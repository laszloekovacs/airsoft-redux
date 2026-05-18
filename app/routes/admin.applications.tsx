import React, { Suspense } from "react"
import { organizerApplicationsTable } from "~/schema/schema"
import { ar } from "~/services"
import type { Route } from "./+types/admin.applications"

export async function loader(_args: Route.LoaderArgs) {
	// load applications
	const applicationsPromise = ar.db
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
	listPromise: Promise<(typeof organizerApplicationsTable.$inferSelect)[]>
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
