
import * as React from "react"

export default function useHasBeenMountedBefore () {
	const mounted = React.useRef( false )
	React.useEffect( function () {
		if ( ! mounted.current ) {
			mounted.current = true
		}
		return () => {
			mounted.current = false
		}
	}, [ ] )
	return mounted.current
}
