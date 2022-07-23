
import { redirect } from "@remix-run/node"
import {
	useLoaderData,
	useFetcher,
} from "@remix-run/react"
import * as React from "react"

import Transaction from "~/server/models/transaction.server"

import { useTimeHasElapsed } from "~/lib/react-hooks/time"
import LoadingIndicator from "~/components/loading-indicator"

import stylesheet from "~/routes/transaction.direct.css"





export const handle = {
	metaTitle: "Transaction Verification",
}

export function links () {
	return [
		stylesheet
	].map( styles => ({ rel: "stylesheet", type: "text/css", href: styles }) )
}



export async function loader ( { request, params, context } ) {
	const { session } = context

	if ( ! session?.transaction )
		return redirect( "/404" )

	let loaderData

	const requestURL = new URL( request.url );

	if ( requestURL.searchParams.get( "json" ) === "true" ) {
		let transaction = new Transaction()
		await transaction.findById( {
			id: session.transaction.transactionId,
			instituteId: session.institute.instituteId,
			refId: session.transaction.refId,
		} )
		transaction = transaction.doc.Item

		let redirectURL = transaction.status === "success" ? transaction.successRedirect : transaction.failureRedirect
		loaderData = {
			status: transaction.status,
			refUniqueId: transaction.refUniqueId,
			refId: transaction.refId,
			id: transaction.id,
			userId: transaction.userId,
			amount: transaction.amount,
			expiresOn: transaction.expiresOn,
			redirectURL,
		}
	}
	else {
		const institute = {
			name: session.institute.doc.name,
			logoURL: session.institute.doc.name.toLowerCase().replace( /\s+/g, "-" ) + "-logo.png"
		}
		loaderData = { institute }
	}

	return loaderData
}



export default function () {

	const { institute } = useLoaderData()
	const transactionStatusIsAvailable = useTimeHasElapsed( 9 )
	const fetcher = useFetcher()
	const itIsTimeToRedirect = useTimeHasElapsed( 15 )
	const [ readyToRedirect, setReadyToRedirect ] = React.useState( false )

	React.useEffect( function () {
		if ( !transactionStatusIsAvailable )
			return;
		fetcher.load( "/transaction/status?json=true" )
	}, [ transactionStatusIsAvailable ] )

	React.useEffect( function () {
		let mounted = true

		if ( !itIsTimeToRedirect )
			return;
		if ( !readyToRedirect ) {
			setTimeout( () => {
				if ( !mounted )
					return;
				setReadyToRedirect( true )
			}, 2500 )
		}

		return () => { mounted = false }
	}, [ itIsTimeToRedirect, readyToRedirect ] )

	const redirectMessage = <span className="h5"><br />Redirecting you back...<br />Kindly do not refresh this page/tab, hit the Back button, or close the tab/browser.</span>

	return <div className="view">
		<div className="header">
			<img src={`/media/logos/${institute.logoURL}`} alt="Institute logo" />
		</div>
		<div className="main-content">
			<div style={ { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "var(--space-100)" } }>
				{ fetcher.data ? null : <LoadingIndicator message="Verifying payment..." /> }
				<div className="text-center text-indigo-3">
					{ fetcher.data?.status === "success" ? <><span className="h4">Your payment was successful.</span>{ redirectMessage }</> : null }
					{ fetcher.data?.status === "failed" ? <><span className="h4">There was an issue with your payment.<br />Please try again later.</span>{ redirectMessage }</> : null }
				</div>
			</div>
			{ readyToRedirect ? <NavigateTo url={fetcher.data.redirectURL} method="POST" body={Object.entries( fetcher.data ).filter( ([ k, v ]) => k !== "redirectURL" )} /> : null }
		</div>
		<div className="footer">
			<img src="/media/logos/bursar-powered-by.svg" alt="Powered by Bursar" />
		</div>
	</div>

}

/*
 |
 | Helper components
 |
 |
 */
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
