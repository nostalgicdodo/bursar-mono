
import { redirect } from "@remix-run/node"
import {
	useLoaderData,
} from "@remix-run/react"
import * as React from "react"

import { useHTTP } from "@ui/hooks/http"
import { LoadingIndicator } from "@ui/components/loading-indicator"

import stylesheet from "~/routes/order.pay.css"





export async function loader ( { context } ) {
	const { session } = context

	if ( !session.transaction || session.transaction.doc.status.toLowerCase() !== "initiated" )
		return redirect( "/404" )

	// if ( session.transaction.doc.pgInitiationDetails )
	// 	return "redirect pg initialization URL"

	// On reloading the child, close the child

	const institute = {
		name: session.institute.doc.name,
		logoURL: session.institute.doc.name.toLowerCase().replace( /\s+/g, "-" ) + ".png"
	}

	return {
		institute,
	}
}

export const handle = {
	metaTitle: "Payment",
}

export function links () {
	return [
		stylesheet,
	].map( styles => ({ rel: "stylesheet", type: "text/css", href: styles }) )
}





export default function () {
	const { institute } = useLoaderData()
	const http = useHTTP()
	const [ iframeLoaded, setIframeLoaded ] = React.useState( false )


	/*
	 |
	 | Prompt before unloading
	 |
	 |
	 */
	// React.useEffect( function () {
	// 	function promptBeforeUnloading ( event ) {
	// 		event.preventDefault()
	// 		return "Are you sure? You might have to make the payment again from the start."
	// 	}
	// 	window.addEventListener( "beforeunload", promptBeforeUnloading, { capture: true } )
	// 	window.onbeforeunload = () => false
	// 	return () => {
	// 		window.onbeforeunload = null
	// 		window.removeEventListener( "beforeunload", promptBeforeUnloading, { capture: true } )
	// 	}
	// }, [ ] )

	http.get( "/api/v1/transactions/juspay_initiate_transaction" )

	return <>
		<div className="view">
			<div className="header">
				<img src={`/media/logos/${institute.logoURL}`} alt="Institute logo" />
			</div>
			<div className="main-content">
				<div className={ [ "loading-indicator-container" + (iframeLoaded ? " fade-out" : "") ] }>
					<LoadingIndicator />
				</div>
				<div className={ [ "iframe-container" + (iframeLoaded ? " fade-in" : "") ] }>
					{ http.data ? <iframe src={ http.data.transactionURL } onLoad={ () => setIframeLoaded( true ) } /> : null }
				</div>
			</div>
			<div className="footer small">
				<img src="/media/logos/bursar-powered-by.svg" alt="Powered by Bursar" />
			</div>
			<div className="footer medium">
				<img className="institute-logo" src={`/media/logos/${institute.logoURL}`} alt="Institute logo" />
				<span className="vd"></span>
				<img className="bursar-logo" src="/media/logos/bursar-powered-by.svg" alt="Powered by Bursar" />
			</div>
		</div>
		{/* <div className="fixed-view">
			<div className="logos">
				<div className="logos-container">
					<img className="institute-logo" src={`/media/logos/${institute.logoURL}`} alt="Institute logo" />
					<img className="bursar-logo" src="/media/logos/bursar-powered-by.svg" alt="Powered by Bursar" />
				</div>
			</div>
		</div> */}
	</>
}
