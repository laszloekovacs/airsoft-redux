export default function StyleGuide() {
	return (
		<div className="max-w-sm">
			<label htmlFor="email" className="input-label">
				Email Address
			</label>
			<input
				type="email"
				id="email"
				className="input-field"
				placeholder="you@example.com"
			/>

			<button type="submit" className="btn btn-primary">
				hello
			</button>
			<button type="submit" className="btn btn-secondary">
				hello
			</button>
		</div>
	)
}
