import type { SessionData } from "~/services/auth.server"

// user accound display
export const SessionInfo = ({ session }: { session: SessionData | null }) => {
	if (!session) return <div>no session</div>

	const { user } = session

	return (
		<div>
			<p>{user.username}</p>
		</div>
	)
}
