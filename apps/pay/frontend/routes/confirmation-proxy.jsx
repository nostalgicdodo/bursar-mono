
/**
 |
 | Confirmation Proxy
 |
 | 1. Loads juspay's Price Breakdown screen within an iframe
 | 2. Overlays it with custom UI
 | 3. Passes through any user clicks to the underlying page
 |
 |
 */

import * as React from "react"

import modalStyles from "@ui/css/modules/modal.css"
import { LoadingIndicator, styles as loadingIndicatorStyles } from "@ui/components/loading-indicator"
import pageStyles from "~/routes/confirmation-proxy.css"









export function meta ( { data } ) {
	return {
		title: "Payment Confirmation | Powered by bursar"
	}
}

export function links () {
	return [
		modalStyles,
		loadingIndicatorStyles,
		pageStyles,
	].map( styles => ({ rel: "stylesheet", type: "text/css", href: styles }) )
}



export async function loader ( { request, params, context } ) {
	return null
}

export default function () {

	React.useEffect( function () {

	}, [ ] )

	return <div className="">
		<div className="overlay">
			<button>Confirm and Pay</button>
		</div>

		<iframe src="/juspay-confirmation"></iframe>
	</div>
}



/*
 |
 | Helper components
 |
 |
 */
function PaymentInSessionModal ( { children } ) {
	return <Modal>
		<div className="payment-in-session text-light">
			<div className="container space-200-top-bottom">
				<div className="columns small-offset-1 small-10 medium-offset-3 medium-6">
					<div className="space-75-bottom"><img className="bursar-logo" src="/media/logos/bursar-powered-by.svg" alt="Powered by Bursar" style={{ minHeight: "36px" }} /></div>
					<div className="h4 space-50-bottom">Payment is in session.</div>
					<div className="p space-25-bottom">Don’t see the secure browser window?</div>
					<div className="p space-25-bottom">If not, kindly ensure that popups are allowed (on your browser and/or anti-virus software), and then try again.</div>
					{ children }
				</div>
			</div>
		</div>
	</Modal>
}

function Modal ( { children } ) {
	return <div className="modal-container">
		{ children }
	</div>
}

// This component simply renders a (pre-filled) form and then auto-submits it.
// The purpose is to facilitate **non-GET** HTTP redirects from the _front-end_.
function NavigateTo ( { url, method, body } ) {
	const domRef = React.useRef( null )
	React.useEffect( function () {
		domRef.current.submit()
	}, [ ] )
	return <form method={method} enctype="multipart/form-data" action={url} ref={domRef} className="hidden">
		{ body.map( ([ k, v ]) => <input type="text" name={k} defaultValue={v} /> ) }
	</form>
}
