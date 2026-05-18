import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router"
import { ar } from "~/services"

export async function loader({ request }: LoaderFunctionArgs) {
	return ar.auth.handler(request)
}

export async function action({ request }: ActionFunctionArgs) {
	return ar.auth.handler(request)
}
