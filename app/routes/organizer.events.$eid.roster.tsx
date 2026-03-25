import type { RegistrationSelectType } from "~/schema/schema"
import type { Route } from "./+types/organizer.events.$eid.roster"

export async function loader({ params }: Route.LoaderArgs) {
	const factions: Array<{ id: "string"; name: string }> = [
		{
			id: "string",
			name: "alpha",
		},
		{
			id: "string",
			name: "bravo",
		},
	]

	return { factions }
}

// list all applicants
export default function RosterPage({ loaderData }: Route.ComponentProps) {
	const { factions } = loaderData

	//const roster = factions.map()

	return (
		<div>
			<h1>Csapatok</h1>

			<ul>
				{factions.map((f) => (
					<li key={f.id}>{f.name}</li>
				))}
			</ul>
		</div>
	)
}

const Roster = ({ roster }: { roster: RegistrationSelectType[] }) => {
	const list = roster.map((i) => (
		<li key={i.id}>
			<div>{i.userId}</div>
		</li>
	))

	return (
		<div>
			<p>list of players</p>
			<div>
				<ul>{list}</ul>
			</div>
		</div>
	)
}
