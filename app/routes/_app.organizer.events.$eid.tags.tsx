import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { useFetcher } from "react-router"
import z from "zod"
import { eventTable } from "~/schema/schema"
import { db } from "~/services/drizzle.server"
import type { Route } from "./+types/_app.organizer.events.$eid.tags"
import { eq, sql } from "drizzle-orm"
import expectOne from "~/functions/expectone"

const schema = z.object({
	tag: z.string(),
	intent: z.enum(["addTag", "removeTag"]),
})

export const loader = async ({ params }: Route.LoaderArgs) => {
	const event = expectOne(
		await db
			.select()
			.from(eventTable)
			.where(eq(eventTable.id, Number(params.eid))),
	)

	return { event }
}

export default function TagsPage({ loaderData }: Route.ComponentProps) {
	const fetcher = useFetcher()
	const [form, field] = useForm({
		lastResult: fetcher.data,
		constraint: getZodConstraint(schema),
	})

	const { event } = loaderData

	// TODO: on success clear form

	return (
		<div>
			<h2>kereső tag-ek</h2>

			<ul className="flex flex-row gap-4 ">
				{event.tags.map((item) => (
					<li key={item}>
						<p className="bg-border">{item}</p>
						{/* remove form with intent button and eventid */}
					</li>
				))}
			</ul>

			<fetcher.Form method="post" {...getFormProps(form)}>
				<input
					className="input-field"
					{...getInputProps(field.tag, { type: "text" })}
				/>

				<button
					className="btn btn-primary"
					type="submit"
					name="intent"
					value="addTag"
				>
					<span>hozzáad</span>
				</button>
			</fetcher.Form>
		</div>
	)
}

export const action = async ({ params, request }: Route.ActionArgs) => {
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema })

	if (submission.status != "success") {
		return submission.reply()
	}

	if (submission.value.intent === "addTag") {
		await db
			.update(eventTable)
			.set({
				tags: sql`
                CASE WHEN ${submission.value.tag} = ANY(${eventTable.tags})
                THEN ${eventTable.tags}
                ELSE array_append(${eventTable.tags}, ${submission.value.tag})
                END
            `,
			})
			.where(eq(eventTable.id, Number(params.eid)))
	}

	if (submission.value.intent == "removeTag") {
		await db
			.update(eventTable)
			.set({
				tags: sql`array_remove(${eventTable.tags}, ${submission.value.tag})`,
			})
			.where(eq(eventTable.id, Number(params.eid)))
	}

	return submission.reply()
}
