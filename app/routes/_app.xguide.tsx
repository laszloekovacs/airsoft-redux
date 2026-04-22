import { Cap } from "~/components/cap"
import { airsoft } from "~/services"
import { auth } from "~/services/auth.server"
import type { Route } from "./+types/_app.xguide"

export const loader = async ({ request }: Route.LoaderArgs) => {
	const sessionData = await auth.api.getSession(request)

	return { env: airsoft.env }
}

export default function TestingPage({ loaderData }: Route.ComponentProps) {

	return <Cap endpoint={loaderData.env.CAP_CONNECTION_STRING} />
}
