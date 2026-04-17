import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router"
import { airsoft } from "~/services"

export async function loader({ request }: LoaderFunctionArgs) {
	return airsoft.auth.handler(request)
}

export async function action({ request }: ActionFunctionArgs) {
	return airsoft.auth.handler(request)
}
