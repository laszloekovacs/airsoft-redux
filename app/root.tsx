import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "react-router"

import type { Route } from "./+types/root"
import "./app.css"
import { DeveloperFooter } from "./components/developerfooter"
import { env } from "./services/env.server"

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
]

const UmamiTrackingScript = ({
	src,
	web_id,
}: {
	src: string
	web_id: string
}) => {
	return <script defer src={src} data-website-id={web_id}></script>
}

// this still gets executed and useLoaderData points to this
export const loader = () => {
	const umami = {
		umami_url: env.UMAMI_URL,
		umami_id: env.UMAMI_ID
	}

	return umami
}

export function Layout({ children }: { children: React.ReactNode }) {
	const {umami_url, umami_id} = useLoaderData<typeof loader>()
	
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<DeveloperFooter />
				<ScrollRestoration />
				<Scripts />
				<UmamiTrackingScript src={umami_url} web_id={umami_id} />
			</body>
		</html>
	)
}


export default function App() {
	return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!"
	let details = "An unexpected error occurred."
	let stack: string | undefined

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error"
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details
	} else if (error && error instanceof Error) {
		details = error.message
		stack = error.stack
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	)
}
