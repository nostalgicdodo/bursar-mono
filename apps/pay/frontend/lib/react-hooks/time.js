
import * as React from "react"

export function useTimeHasElapsed ( seconds ) {
	seconds = seconds || 1
	const milliseconds = seconds * 1000

	const [ timeHasElapsed, setTimeHasElapsed ] = React.useState( false )

	React.useEffect( function () {
		let timeoutId = setTimeout( function onTimeout () {
			setTimeHasElapsed( true )
		}, milliseconds )

		return function () {
			clearTimeout( timeoutId )
		}
	}, [ ] )

	return timeHasElapsed
}
