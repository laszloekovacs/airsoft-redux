import { Link } from "react-router"

export const PageHeader = () => {
	return (
		<div className="flex flex-row py-2 text-2xl">
			<Link
				className="text-emerald-900 hover:text-emerald-500 transition-colors"
				to="/"
			>
				Airsoft
			</Link>
		</div>
	)
}
