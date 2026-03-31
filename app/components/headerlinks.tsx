import { NavLink } from "react-router"

type LinkProps = {
	isOrganizer: boolean
	isAdmin: boolean
}

export const HeaderLinks = ({ isOrganizer, isAdmin }: LinkProps) => {
	return (
		<div className="flex flex-row gap-8 py-6">
			<NavLink to="/">home</NavLink>
			<NavLink to="/account">profil</NavLink>
			{isOrganizer && <NavLink to="/organizer">szervező</NavLink>}
			{isAdmin && <NavLink to="/admin">admin</NavLink>}
		</div>
	)
}
