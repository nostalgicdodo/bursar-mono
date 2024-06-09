
import type { MetaFunction } from "@remix-run/node"

import CircularLoadingIndicator from "@/ui/react/components/loading-indictors/circular-loading-indicator.tsx"

export const meta: MetaFunction = () => {
	return [
		{ title: "Payment Confirmation | KMAT | bursar" },
	]
}

export default function () {
	return <div className="pt-200">
		<div className="container">
			<InstituteLogo className="mx-auto max-w-400" />
			<PageHeading className="mt-100 font-serif" />
			<Main className="mt-100 mx-auto" />
		</div>
		<div className="mt-100"></div>
	</div>
}

function InstituteLogo ( { className = "" } ) {
	return <img
		src="/media/logos/test-greendale-community-college.png"
		alt="Institute Logo"
		className={ className }
	/>
}

function PageHeading ( { className = "" } ) {
	return <h1 className={ `h3 text-center text-indigo-3 ${ className }` }>Session Expired</h1>
}

function Main ( { className = "" } ) {
	return <section className={ `flex justify-between items-center _column md:c-8 lg:c-6 bg-light border border-purple-2 p-50 rounded-50 ${ className }` }>
		<div>
			<div className="h4 font-bold font-serif text-purple-2">The payment session has timed out.</div>
			<div className="mt-50 p text-neutral-7" style={{ maxWidth: "25ch" }}>
				We are redirecting you back...
				<br />
				<br />
				Do not <i>refresh</i> this page, hit the <i>back button</i>, or <i>close</i> this window.
			</div>
		</div>
		<CircularLoadingIndicator className="w-350 pr-100 [&>span]:h3 [&>span:before]:border-transparent text-purple-2" />
	</section>
}
