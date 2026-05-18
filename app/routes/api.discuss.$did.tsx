import { parseWithZod } from "@conform-to/zod/v4"
import { eq } from "drizzle-orm"
import { z } from "zod/v4"
import { commentTable } from "~/schema/schema"
import { ar } from "~/services"
import type { Route } from "./+types/api.discuss.$did"

// load comments, the parameter is the discussion table id
export async function loader({ params }: Route.LoaderArgs) {
	const { did } = params

	if (Number.isNaN(did)) {
		return { comments: null }
	}

	// find the relevant comments, return it
	const comments = await ar.db
		.select()
		.from(commentTable)
		.where(eq(commentTable.discussionId, Number(did)))

	return { comments }
}

export async function action({ params, request }: Route.ActionArgs) {
	const { did } = params

	if (Number.isNaN(did)) {
		throw new Error("wrong param")
	}

	// conform
	const schema = z.object({
		message: z.string(),
	})

	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema })

	if (submission.status != "success") {
		return submission.reply()
	}

	// insert new comment
	await ar.db.insert(commentTable).values({
		discussionId: Number(did),
		message: submission.value.message,
		userId: null,
	})

	return submission
}
