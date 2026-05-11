import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4"
import { RiAlertFill, RiCheckboxCircleFill } from "@remixicon/react"
import { and, eq } from "drizzle-orm"
import { Link, useFetcher } from "react-router"
import z from "zod"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "~/components/ui/item"
import { CommentSection } from "~/features/comments"
import { requireSession } from "~/functions/auth-guard.server"
import expectOne from "~/functions/expectone"
import { eventTable, registrationTable } from "~/schema/schema"
import { airsoft } from "~/services"
import type { Route } from "./+types/_app.event.$id"

export async function loader({ params, request }: Route.LoaderArgs) {
	// does not require auth, but should only allow logged in users to sign up
	const sessionData = await airsoft.auth.api.getSession(request)

	const events = await airsoft.db
		.select()
		.from(eventTable)
		.where(eq(eventTable.id, Number(params.id)))
		.limit(1)

	const event = expectOne(events)

	// if authed user,
	// check if user has a registration for this event, if logged in
	if (sessionData?.user != null) {
		const registrations = await airsoft.db
			.select()
			.from(registrationTable)
			.where(
				and(
					eq(registrationTable.eventId, event.id),
					eq(registrationTable.userId, sessionData.user.id),
				),
			)

		return {
			event,
			user: sessionData.user,
			registrations,
		}
	}

	return { event, user: null, registrations: [] }
}

export default function EventDetailsPage({ loaderData }: Route.ComponentProps) {
	const { event, user, registrations } = loaderData

	const isLoggedin = !!user
	const isRegistered = !!registrations.filter((r) => r.userId == user?.id)
		.length

	return (
		<div>
			<pre>{JSON.stringify(event)}</pre>

			<h1 className="font-bold text-2xl">{event.title}</h1>
			<p>
				<span>meghirdetve&nbsp;</span>
				<span>{event.createdAt}</span>
			</p>
			<div>
				<img src="https://picsum.photos/400/200" alt="event" />
			</div>

			<BadgeList badges={event.tags} />
			<ApplicationForm isRegistered={isRegistered} isLoggedin={isLoggedin} />

			<Registrations registrations={registrations} />

			<div>
				<CommentSection discussionId={event.discussion} />
			</div>
		</div>
	)
}

const schema = z.object({
	message: z.string(),
	intent: z.enum(["apply"]).default("apply"),
})

export async function action({ request, params }: Route.ActionArgs) {
	const { user } = await requireSession(request)
	const submission = parseWithZod(await request.formData(), { schema })

	if (submission.status != "success") {
		return submission.reply()
	}

	try {
		// insert player into the roster

		// the page gets revalidated, so loader should indicate success and doesnt need to
		// return any data trough comform, onConflictDoNothing will skip insertion
		await airsoft.db
			.insert(registrationTable)
			.values({
				userId: user.id,
				eventId: Number(params.id),
				message: submission.value.message ?? null,
				faction: "",
			})
			.onConflictDoNothing()

		return submission.reply()
	} catch (err) {
		console.log(err)
		return submission.reply({ formErrors: ["sikertelen jelentkezés"] })
	}
}

const ApplicationForm = ({
	isRegistered,
	isLoggedin,
}: {
	isRegistered: boolean
	isLoggedin: boolean
}) => {
	const fetcher = useFetcher()

	const [form, fields] = useForm({
		lastResult: fetcher.data,
		constraint: getZodConstraint(schema),
	})

	// TODO: event is deleted or expired

	// user is logged out, encourage registraiton
	if (!isLoggedin) {
		return (
			<div className="flex w-full max-w-md">
				<Item variant="outline">
					<ItemMedia>
						<RiAlertFill />
					</ItemMedia>
					<ItemContent>
						<ItemTitle>
							<span>
								<Link className="underline underline-offset-4" to="/register">
									Regisztralj
								</Link>
								&nbsp;ahhoz hogy jelentkezni tudj jatekra!
							</span>
						</ItemTitle>
					</ItemContent>
				</Item>
			</div>
		)
	}

	// already applied to this game
	if (isRegistered) {
		return (
			<div className="flex w-full max-w-md">
				<Item variant="outline">
					<ItemMedia>
						<RiCheckboxCircleFill />
					</ItemMedia>
					<ItemContent>
						<ItemTitle>
							<span>Mar jelentkeztel erre a jatekra!</span>
						</ItemTitle>
						<ItemDescription>
							<p>A jelentkezesed sikeressegerol a szervezo fog ertesiteni</p>
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Button variant="destructive">Visszavonom</Button>
					</ItemActions>
				</Item>
			</div>
		)
	}

	// is logged in and not registered
	return (
		<div>
			<fetcher.Form method="post" {...getFormProps(form)}>
				<label htmlFor={fields.message.id}>Üzenet</label>
				<input {...getInputProps(fields.message, { type: "text" })} />
				<input {...getInputProps(fields.intent, { type: "hidden" })} />
				<button type="submit">jelentkezek</button>
			</fetcher.Form>
		</div>
	)
}

const BadgeList = ({ badges }: { badges: string[] }) => {
	return (
		<div>
			<ul className="flex flex-row gap-2">
				{badges.map((b) => (
					<li key={b}>
						<Badge>{b}</Badge>
					</li>
				))}
			</ul>
		</div>
	)
}

const Registrations = ({
	registrations,
}: {
	registrations: (typeof registrationTable.$inferSelect)[] | null
}) => {
	if (!registrations || registrations.length == 0) {
		return <div>még nincsenek jelentkezők erre a játékra!</div>
	}

	// before grouping, fill out the null faction values, so groupby has keys to iterate on
	const result = registrations.map((r) => {
		if (!r.faction) {
			r.faction == "várólista"
		}
		return r
	})

	const factions = Object.groupBy(
		result,
		({ faction }) => faction ?? "várólista",
	)

	return <pre>{JSON.stringify(factions, null, 2)}</pre>
}
