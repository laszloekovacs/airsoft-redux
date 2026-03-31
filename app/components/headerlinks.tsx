import { Link } from "react-router"

type LinkProps = {
	isOrganizer: boolean
	isAdmin: boolean
}

export const HeaderLinks = ({ isOrganizer, isAdmin }: LinkProps) => {
	return (
		<div className="flex flex-row gap-8 py-6">
			<Link to="/">home</Link>
			<Link to="/account">profil</Link>
			{isOrganizer && <Link to="/organizer">szervező</Link>}
			{isAdmin && <Link to="/admin">admin</Link>}
		</div>
	)
}
