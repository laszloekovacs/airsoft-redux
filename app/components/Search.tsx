import { useFetcher } from "react-router"

export default function SearchContainer() {
	const fetcher = useFetcher()

	return (
		<div className="border p-4">
			<fetcher.Form action="/endpoint/search" method="post">
				<input className="border p-0.5" name="query" />
				<button type="submit">küldés</button>
			</fetcher.Form>
			<p>{fetcher.state}</p>
			<div>{fetcher?.data && <p>{fetcher.data}</p>}</div>
		</div>
	)
}
