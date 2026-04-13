import { Link } from "react-router"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "~/components/ui/navigation-menu"

type LinkProps = {
	isOrganizer: boolean
	isAdmin: boolean
}

export const HeaderLinks = ({ isOrganizer, isAdmin }: LinkProps) => {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link to="/">főoldal</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link to="/account">profilod</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						{(isOrganizer || isAdmin) && (
							<Link to="/organizer">szervező oldal</Link>
						)}
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						{isAdmin && <Link to="/admin">admin</Link>}
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	)
}
