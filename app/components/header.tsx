import { Link } from "react-router"

export const PageHeader = () => {
	return (
		<div className="text-2xl font-extrabold hover:text-primary transition-colors">
			<Link to="/">Airsoft</Link>
		</div>
	)
}
