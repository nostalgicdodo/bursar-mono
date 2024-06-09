
import {
	redirect,
} from "@remix-run/node"
import {
	useLoaderData,
	useFetcher,
} from "@remix-run/react"
import * as React from "react"






export function loader ( { request, context } ) {
	console.log( context )
	return context
	// return null
}

export default function View () {
	const loaderData = useLoaderData()
	const fetcher = useFetcher()
	React.useEffect( function () {
		console.log( loaderData )
		fetcher.submit( { json: "who" }, {
			method: "post",
			action: "/porst",
		} )
	}, [ ] )

	React.useEffect( function () {
		console.log( fetcher )
	}, [ fetcher ] )

	return null
}
