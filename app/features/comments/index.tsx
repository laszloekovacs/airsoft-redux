/** biome-ignore-all lint/correctness/useExhaustiveDependencies: fetcher mutates every time */
import { useEffect } from "react"
import { useFetcher } from "react-router"
import type { loader } from "~/routes/api.discuss.$did"

export const CommentSection = ({
	discussionId,
}: {
	discussionId: number | null
}) => {
	const fetcher = useFetcher<typeof loader>()

	useEffect(() => {
		fetcher.load(`/api/discuss/${discussionId}`)
	}, [discussionId])

	if (fetcher.state == "loading") {
		return <div>loading</div>
	}

	return <div>{JSON.stringify(fetcher.data)}</div>
}
