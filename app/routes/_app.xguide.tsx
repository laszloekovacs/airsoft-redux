import { Cap } from "~/components/cap"
import { airsoft } from "~/services"
import { auth } from "~/services/auth.server"
import type { Route } from "./+types/_app.xguide"

export const loader = async ({ request }: Route.LoaderArgs) => {
	const sessionData = await auth.api.getSession(request)

	const userId = sessionData?.user.id

	return { userId }
}

export default function TestingPage({ loaderData }: Route.ComponentProps) {

	return <Cap endpoint={airsoft.env.CAP_CONNECTION_STRING} apikey={airsoft.env.CAP_APIKEY} />
}
