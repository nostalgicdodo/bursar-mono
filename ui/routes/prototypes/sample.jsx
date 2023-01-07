
import * as React from "react"

export const handle = {
	// inheritRootLayout: false
}



export default function () {

	React.useEffect( function () {
		console.log( "here." )
	}, [ ] )

	return <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
		Sample
	</div>
}
