
import { redirect } from "@remix-run/node"
import {
	useLoaderData,
	useNavigate,
} from "@remix-run/react"
import * as React from "react"


import stylesheet from "~/routes/order.pay.css"





export async function loader ( { context } ) {
	return null
}

export const handle = {
	metaTitle: "Here, There, Everywhere",
}

export function links () {
	return [
		stylesheet,
	].map( styles => ({ rel: "stylesheet", type: "text/css", href: styles }) )
}





export default function () {

	const navigate = useNavigate()

	return <div>
		here there everywhere
		<button onClick={ () => navigate( 1 ) }>forward</button>
	</div>

}
