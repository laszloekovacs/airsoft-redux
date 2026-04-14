/** biome-ignore-all lint/correctness/useExhaustiveDependencies: fetcher mutates every time */
import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint } from "@conform-to/zod/v4"
import { useEffect } from "react"
import { useFetcher } from "react-router"
import { z } from "zod/v4"
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

			{fetcher?.data?.comments?.map((item) => (
				<li key={item.id}>
					<Comment
						createdAt={item.createdAt}
						message={item.message ?? ""}
						userId={item.userId ?? ""}
					/>
				</li>
			))}
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

const Comment = ({
	createdAt,
	message,
	userId,
}: {
	createdAt: Date
	message: string
	userId: string
}) => {
	return (
		<div>
			<p>{userId}</p>
			<p>{createdAt.toDateString()}</p>
			<p>{message}</p>
		</div>
	)
}
