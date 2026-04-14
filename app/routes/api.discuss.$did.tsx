import { eq } from "drizzle-orm"
import { commentTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/api.discuss.$did"

// load comments, the parameter is the discussion table id
export async function loader({ params }: Route.LoaderArgs) {
	const { did } = params

	if (Number.isNaN(did)) {
		return { comments: null }
	}

	// find the relevant comments, return it
	const comments = await db
		.select()
		.from(commentTable)
		.where(eq(commentTable.discussionId, Number(did)))

	return { comments }
}
