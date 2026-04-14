import type { Route } from "./+types/api.presence"

export const action = ({ request }: Route.ActionArgs) => {
	return { status: "ok" }
}
