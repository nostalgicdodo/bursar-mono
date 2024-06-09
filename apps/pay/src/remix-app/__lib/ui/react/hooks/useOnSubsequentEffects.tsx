
import * as React from "react"

import useHasBeenMountedBefore from "./useHasBeenMountedBefore"

export default function useOnSubsequentEffects ( fn, dependencies ) {
	const mountedBefore = useHasBeenMountedBefore()
	React.useEffect( function () {
		if ( ! mountedBefore ) {
			return
		}

		fn()
	}, dependencies )
}

// export default function useOnSubsequentEffects ( fn, dependencies ) {
// 	const renderedAtLeastOnce = React.useRef( false )
// 	React.useEffect( function () {
// 		if ( ! renderedAtLeastOnce.current ) {
// 			renderedAtLeastOnce.current = true
// 			return
// 		}

// 		fn()

// 		return () => {
// 			renderedAtLeastOnce.current = false
// 		}
// 	}, dependencies )
// }
