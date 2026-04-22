import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { eq, sql } from "drizzle-orm"
import { useFetcher } from "react-router"
import z from "zod"
import expectOne from "~/functions/expectone"
import { eventTable } from "~/schema/schema"
import { airsoft } from "~/services"
import type { Route } from "./+types/_app.organizer.events.$eid.tags"

const schema = z.object({
	tag: z.string(),
	intent: z.enum(["addTag", "removeTag"]),
})

export const loader = async ({ params }: Route.LoaderArgs) => {
	const event = expectOne(
		await airsoft.db
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
		shouldRevalidate: "onSubmit",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema })
		},
	})

	const { event } = loaderData

	return (
		<div>
			<h2>kereső tag-ek</h2>

			<SearchTags tags={event.tags} />

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
		console.log("failed to parse", submission)
		return submission.reply()
	}

	console.log(submission)

	if (submission.value.intent === "addTag") {
		await airsoft.db
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
			.returning()

		return submission.reply({ resetForm: true })
	}

	if (submission.value.intent == "removeTag") {
		await airsoft.db
			.update(eventTable)
			.set({
				tags: sql`array_remove(${eventTable.tags}, ${submission.value.tag})`,
			})
			.where(eq(eventTable.id, Number(params.eid)))
			.returning()
	}

	return submission.reply()
}

const SearchTags = ({ tags }: { tags: string[] }) => {
	const fetcher = useFetcher()
	const [form] = useForm({
		lastResult: fetcher.data,
		constraint: getZodConstraint(schema),
	})

	return (
		<ul className="flex flex-row gap-4 ">
			{tags.map((item) => (
				<li key={item}>
					<p className="bg-border">{item}</p>
					{/* remove form with intent button and eventid */}
					<fetcher.Form method="post" {...getFormProps(form)}>
						<input type="hidden" name="tag" value={item} />

						<button type="submit" name="intent" value="removeTag">
							<span>remove</span>
						</button>
					</fetcher.Form>
				</li>
			))}
		</ul>
	)
}
