
import {
	useLoaderData,
} from "@remix-run/react"
import * as React from "react"


import stylesheet from "~/routes/transaction.direct.css"





export const handle = {
	metaTitle: "Payment Not Found",
}

export function links () {
	return [
		stylesheet
	].map( styles => ({ rel: "stylesheet", type: "text/css", href: styles }) )
}

export async function loader ( { request, params, context } ) {
	const { session } = context

	if ( !session || !session.institute )
		return { }

	const institute = {
		name: session.institute?.doc.name || "",
		logoURL: session.institute?.doc.name.toLowerCase().replace( /\s+/g, "-" ) + "-logo.png"
	}

	return { institute }
}



export default function () {

	const { institute } = useLoaderData()

	return <div className="view">
		<div className="header">
			{ institute ? <img src={`/media/logos/${institute.logoURL}`} alt="Institute logo" /> : null }
		</div>
		<div className="main-content">
			<div style={ { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "var(--space-100)" } }>
				<div className="h4">This page does not exist.</div>
			</div>
		</div>
		<div className="footer">
			<img src="/media/logos/bursar-powered-by.svg" alt="Powered by Bursar" />
		</div>
	</div>

}
