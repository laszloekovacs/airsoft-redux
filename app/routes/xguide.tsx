import "@cap.js/widget"
import { useEffect, useState } from "react"
import SearchContainer from "~/components/Search"
import { env } from "~/services/env.server"
import type { Route } from "./+types/xguide"
import { Button } from "~/components/ui/button"

export const loader = () => {
	// get the api endpoint url from env
	return { cap_endpoint: env.CAP_CONNECTION_STRING }
}

export default function StyleGuide({ loaderData }: Route.ComponentProps) {
	return (
		<div className="flex flex-col items-center w-full p-12">
			<div className="max-w-sm panel-border p-8">
				<label htmlFor="email" className="input-label">
					Email Address
				</label>
				<input
					type="email"
					id="email"
					className="input-field"
					placeholder="you@example.com"
				/>

				<Button type="submit">hello</Button>
			</div>

			<SearchContainer />
		</div>
	)
}

//<CappedForm endpoint={loaderData.cap_endpoint} />
// TODO: lift up state from widget with callbacks
const CappedForm = ({ endpoint }: { endpoint: string }) => {
	const [isMounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!isMounted) {
		return <div>loading...</div>
	}

	// submit form to action, the token will be added to the form (?cap_token=...)
	return (
		<div>
			<form>
				<cap-widget
					data-cap-api-endpoint={endpoint}
					onsolve={(e) => console.log("token:", e.detail.token)}
					onprogress={(e) => console.log(e.detail.progress)}
					onerror={(e) => console.error(e.detail.message)}
				/>
				<button type="submit">Submit</button>
			</form>
		</div>
	)
}
