
import * as React from "react"

export const handle = {
	inheritRootLayout: false
}

export default function () {
	React.useLayoutEffect( function () {
		window.close()
	}, [ ] )

	return null
}
