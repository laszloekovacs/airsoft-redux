import "@cap.js/widget"

export default function StyleGuide() {
	return (
		<div className="flex flex-col items-center w-full p-12">
			<div className="max-w-sm panel-border p-8">
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

			<CappedForm />
		</div>
	)
}

const CappedForm = () => {
	return (
		<div>
			<form>
				<cap-widget
					data-cap-api-endpoint="endpoint:3003/sitecode"
					onsolve={(e) => console.log("token:", e.detail.token)}
					onprogress={(e) => console.log(e.detail.progress)}
					onerror={(e) => console.error(e.detail.message)}
				/>
				<button type="submit">Submit</button>
			</form>
		</div>
	)
}
