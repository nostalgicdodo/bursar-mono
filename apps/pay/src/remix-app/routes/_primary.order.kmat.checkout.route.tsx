
import type { MetaFunction } from "@remix-run/node"

import { useState } from "react"
import { Link } from "@remix-run/react"
import { ClientOnly } from "remix-utils/client-only"

import CircularLoadingIndicator from "@/ui/react/components/loading-indictors/circular-loading-indicator.tsx"
import ButtonPrimary from "@/ui/react/components/buttons/button-primary"
import CountDownBar from "@/ui/react/components/countdown-bar"
import { BursarLogo } from "@/this/ui/components/bursar-logo"
import { ClientLogo } from "@/this/ui/components/client-logo"
import { SiteFooter2 } from "@/this/ui/components/site-footer-2"
import ButtonLess from "@/ui/react/components/buttons/button-less"


const paymentProviders = [
	{
		name: "Google Pay",
		logoPath: "google-pay.svg",
	},
	{
		name: "PhonePe",
		logoPath: "phone-pe.svg",
	},
	{
		name: "PayTM",
		logoPath: "pay-tm.svg",
	},
]

export const meta: MetaFunction = () => {
	return [
		{ title: "Payment | KMAT | bursar" },
	]
}

export default function () {
	const [ sessionExpiresOn, ] = useState( () => Date.now() + ( 15 * 60 * 1000 ) )

	return <div className="container py-200">
		<div className="mx-auto md:c-8 lg:c-6">
			<ClientLogo name="Greendale Community College logo" logoURL="/media/logos/test-greendale-community-college.png" className="w-250 mx-auto max-w-300 md:max-w-400" />
			<PageHeading className="mt-100 font-serif" />
			<OrderInfo className="mt-100 _text-center" />
			<ClientOnly>
				{ () => <CountDownBar expiresOn={ sessionExpiresOn } message={ "Time remaining to make payment:" } endMessage={ "The session has expired." } onExpiry={ () => {} } className="mt-100 px-25" /> }
			</ClientOnly>
			<PaymentCTASection className="mt-100" />
			{/* <PaymentSessionTimedOut className="mt-100 mx-auto" /> */}
			{/* <SiteFooter2 className="mt-75" /> */}
		</div>
		<div className="mt-100"></div>
	</div>
}

// function InstituteLogo ( { className = "" } ) {
// 	return <img
// 		src="/media/logos/test-greendale-community-college.png"
// 		alt="Institute Logo"
// 		className={ className }
// 	/>
// }

function PageHeading ( { className = "" } ) {
	return <h1 className={ `h3 text-center text-indigo-3 ${ className }` }>Payment Confirmation</h1>
}

function OrderInfo ( { className = "" } ) {
	return <section className={ `rounded-50 border border-purple-2 overflow-hidden ${ className }` }>
		{/* <div className="column md:c-8 lg:c-6 rounded-50 border border-purple-2 overflow-hidden"> */}
			<div className="md:flex max-md:text-center">
				<div className="md:c-7 p-50">
					<div className="h4 font-serif text-indigo-3">Test Master</div>
					<div className="mt-25 label font-bold text-indigo-1">ID: test-ANIDEYUNJD</div>
					<div className="mt-25 label font-bold text-indigo-3">
						<span>TEST Greendale Community College</span>
					</div>
				</div>
				<div className="max-md:mt-25 md:c-5 md:flex flex-col justify-center items-center bg-purple-1 max-md:border-t md:border-l border-purple-2 py-50 px-100">
					<div className="label text-purple-2">Fee Amount Due</div>
					<div className="h5 font-bold text-purple-3">₹1/- </div>
				</div>
			</div>
		{/* </div> */}
	</section>
}

function PaymentCTASection ( { className = "" } ) {
	return <section className={ `p-50 border border-purple-2 bg-light rounded-50 ${ className }` }>
		<h2 className="h4 font-serif font-bold text-purple-2">
			Make Payment
		</h2>
		<div>
			<p className="mt-50 h6 text-neutral-7">Select payment provider</p>
			<ul className="mt-25 flex flex-wrap gap-25">
				{ paymentProviders.map( ( { name, logoPath }, i ) => <li key={ i }>
					<Link>
						<figure className="p-25 border border-purple-2 rounded-25 hover:bg-purple-1">
							<img src={ `/media/logos/payment-providers/${ logoPath }` } alt="" className="h-75" />
							<figcaption className="sr-only">{ name }</figcaption>
						</figure>
					</Link>
				</li> ) }
			</ul>
		</div>
		<div className="mt-100 flex items-center gap-25">
			<hr className="grow border border-purple-2 rounded-25" />
			<p className="h5 uppercase">or</p>
			<hr className="grow border border-purple-2 rounded-25" />
		</div>
		<div className="mt-75">
			<p className="mt-50 h6 text-neutral-7 text-center -mb-75">Scan QR code</p>
			<figure>
				<img src="/media/other/qr-code-to-wikipedia.svg" alt="" className="mx-auto" />
			</figure>
		</div>
	</section>
}

function PaymentSessionTimedOut ( { className = "" } ) {
	return <section className={ `flex justify-between items-center bg-light border border-purple-2 p-50 rounded-50 ${ className }` }>
		<div>
			<div className="h4 font-bold font-serif text-purple-2">The payment session has timed out.</div>
			<div className="mt-50 p text-neutral-7" style={{ maxWidth: "25ch" }}>
				We are redirecting you back...
				<br />
				<br />
				Do not <i>refresh</i> this page, hit the <i>back button</i>, or <i>close</i> this window.
			</div>
		</div>
		{/* <CircularLoadingIndicator className="w-350 pr-100 [&>span]:h3 [&>span:before]:border-transparent text-purple-2" /> */}
	</section>
}





/**
 |
 | REMOVE
 |
 |
 */
function PaymentCTASection__OldVersion ( { className = "" } ) {
	return <section className={ `p-50 border border-purple-2 bg-light rounded-50 ${ className }` }>
		{/* <div className="column md:c-8 lg:c-6 p-50 border border-purple-2 bg-light rounded-50 text-left"> */}
			<div className="h4 font-serif font-bold text-purple-2">Pay Full Amount, Now</div>
			<div className="mt-75 flex justify-between">
				<div className="c-5">
					<div className="small font-bold text-purple-2">Total Fee Amount</div>
					<div className="h5 font-bold text-purple-3">₹1/-</div>
				</div>
				<div className="c-6 md:c-4">
					<ButtonPrimary size="small" removeClasses={[ "h-max" ]} className="w-full h-full">Make payment</ButtonPrimary>
				</div>
			</div>
		{/* </div> */}
	</section>
}
