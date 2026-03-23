const links = [
	["home", "/"],
	["login", "/login"],
	["register", "/register"],
	["account", "/account"],
	["admin", "/admin"],
	["organizer", "/organizer"],
]

export function DeveloperFooter() {
	return (
		<footer>
			<ul>
				{links.map(([label, href]) => (
					<li key={href}>
						<a href={href}>{label}</a>
					</li>
				))}
			</ul>
		</footer>
	)
}
