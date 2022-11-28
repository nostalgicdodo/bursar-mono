
import {
	json,
} from "@remix-run/node"
import * as React from "react"
import {
	useLoaderData
} from "@remix-run/react";


import { baseLinks, fonts, stylesheets } from "~/root"



export const handle = {
	inheritRootLayout: false
}

export function links () {
	return baseLinks
}

export async function loader () {
	return json( { data: 5 } )
}

export default function () {
	// const [ isChildWindow, setIsChildWindow ] = React.useState( "TBD" )
	const [ parentWindowClosed, setParentWindowClosed ] = React.useState( false )

	React.useEffect( function () {
		if ( window.opener === null )
			window.close()

		window.opener._windowHandles = window.opener._windowHandles || { }
		window.opener._windowHandles[ window.name ] = window
	}, [ ] )

	return <div>
		<div className="p">payment is flowing.</div>
		<div className="p">Has parent window closed? { parentWindowClosed ? "Yes." : "No." }</div>
		<div className="p">Is Child Window? Dunno</div>
		<div><a href="https://example.com">Navigate elsewhere</a></div>
		<button className="button text-uppercase" onClick={ () => window.close() }>Close</button>
	</div>
}
