
import * as React from "react"
import useRerender from "./useRerender"

type UseTimeoutFnReturn = [
	() => boolean | null,
	() => void,
	() => void,
]

export default function useTimeout ( seconds: number = 0, fn?: Function ): UseTimeoutFnReturn {
	seconds = seconds * 1000
	const timeoutComplete = React.useRef<boolean | null>( false )
		const isTimeoutComplete = React.useCallback( () => timeoutComplete.current, [ ] )
			// ^ getter for the `timeoutComplete` ref
	const timeout = React.useRef<ReturnType<typeof setTimeout>>()
	const rerender = useRerender()
	const callback = React.useRef( fn ?? rerender )

	// Imperative function that sets the timeout
	const set = React.useCallback( () => {
		timeoutComplete.current = false
		// if ( timeout.current ) {
			clearTimeout( timeout.current )
		// }

		timeout.current = setTimeout( () => {
			timeoutComplete.current = true
			callback.current()
		}, seconds )
	}, [ seconds ] )

	// Imperative function that clears/cancel the timeout
	const clear = React.useCallback( () => {
		timeoutComplete.current = null
		// if ( timeout.current ) {
			clearTimeout( timeout.current )
		// }
	}, [ ] )

	// Update callback ref when provided function changes
	React.useEffect( () => {
		callback.current = fn ?? rerender
	}, [ fn ] )

	// Set the timeout on mount,
	// 	and re-set it whenever provided `seconds` changes
	React.useEffect( () => {
		// Set the timeout
		set()

		// Clear/cancel the timeout
		return clear
	}, [ seconds ] )

	return [
		isTimeoutComplete,
		clear,
		set
	]
}
