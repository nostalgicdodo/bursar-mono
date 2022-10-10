
import { redirect } from "@remix-run/node"
import {
	useLoaderData,
} from "@remix-run/react"
import * as React from "react"

import { useHTTP } from "@ui/hooks/http"
import { LoadingIndicator } from "@ui/components/loading-indicator"

import stylesheet from "~/routes/transaction.direct.css"





// export async function loader () { return null }
export async function loader ( { context } ) {
	const { session } = context

	if ( !session.transaction || session.transaction.doc.status !== "initiated" )
		return redirect( "/404" )

	const institute = {
		name: session.institute.doc.name,
		logoURL: session.institute.doc.name.toLowerCase().replace( /\s+/g, "-" ) + ".png"
	}

	return {
		institute,
	}
}

export const handle = {
	metaTitle: "Transaction",
}

export function links () {
	return [
		stylesheet
	].map( styles => ({ rel: "stylesheet", type: "text/css", href: styles }) )
}





export default function () {
	const { institute } = useLoaderData()
	const http = useHTTP()
	const [ iframeLoaded, setIframeLoaded ] = React.useState( false )

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
