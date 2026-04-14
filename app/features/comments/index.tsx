/** biome-ignore-all lint/correctness/useExhaustiveDependencies: fetcher mutates every time */
import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint } from "@conform-to/zod/v4"
import { useEffect } from "react"
import { useFetcher } from "react-router"
import { number, z } from "zod/v4"
import type { action, loader } from "~/routes/api.discuss.$did"

export const CommentSection = ({
	discussionId,
}: {
	discussionId: number | null
}) => {
	const fetcher = useFetcher<typeof loader>()

	useEffect(() => {
		fetcher.load(`/api/discuss/${discussionId}`)
	}, [discussionId])

	// fetching state
	if (fetcher.state == "loading") {
		return <div>loading</div>
	}

	return (
		<div>
			<span>{discussionId && <CommentForm discussionId={discussionId} />}</span>
			<span>{JSON.stringify(fetcher.data)}</span>
		</div>
	)
}

const schema = z.object({
	message: z.string("ures komment"),
})

const CommentForm = ({ discussionId }: { discussionId: number }) => {
	const fetcher = useFetcher<typeof action>()

	const [form, field] = useForm({
		lastResult: fetcher?.data,
		constraint: getZodConstraint(schema),
	})

	return (
		<div>
			<fetcher.Form
				method="post"
				{...getFormProps(form)}
				action={`/api/discuss/${discussionId}`}
			>
				<input {...getInputProps(field.message, { type: "text" })} />
				<button type="submit">komment</button>
			</fetcher.Form>
		</div>
	)
}
