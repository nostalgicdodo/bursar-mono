
import { useEffect, useRef, useCallback } from "react"
import useRerender from "./useRerender"
import { isAFunction } from "@/utilities/type-checking/function"
import { isAFiniteNumber } from "@/utilities/type-checking/number/identity"
import { isAnObject } from "@/utilities/type-checking/object"

type UseTimeoutFnReturn = [
	() => boolean | null,
	() => void,
	( fn?: Function ) => void,
] & {
	complete: () => boolean | null,
	clear: () => void,
	set: ( fn?: Function ) => void,
}

type UseTimeoutProps = Partial<{
	seconds: number;
	fn: Function;
	autoStart: boolean;
}>
export default function useTimeout ( props: UseTimeoutProps = { } ): UseTimeoutFnReturn {
	let { seconds, fn, autoStart } = props
	autoStart = autoStart ?? true
	let milliseconds = ( seconds || 1 ) * 1000
	const timeoutComplete = useRef<boolean | null>( null )
		const isTimeoutComplete = useCallback( () => timeoutComplete.current, [ ] )
			// ^ getter for the `timeoutComplete` ref
	const timeout = useRef<ReturnType<typeof setTimeout>>()
	const rerender = useRerender()
	const callback = useRef( fn ?? rerender )

	// Imperative function that sets the timeout
	const set = useCallback( ( fn?: Function ) => {
		timeoutComplete.current = false
		// if ( timeout.current ) {
			clearTimeout( timeout.current )
		// }

		timeout.current = setTimeout( () => {
			timeoutComplete.current = true
			if ( isAFunction( fn ) ) {
				fn()
			}
			else {
				callback.current()
			}
		}, milliseconds )
	}, [ milliseconds ] )

	// Imperative function that clears/cancel the timeout
	const clear = useCallback( () => {
		timeoutComplete.current = null
		// if ( timeout.current ) {
			clearTimeout( timeout.current )
		// }
	}, [ ] )

	// Update callback ref when provided function changes
	useEffect( () => {
		callback.current = fn ?? rerender
	}, [ fn ] )

	// Set the timeout on mount,
	// 	and re-set it whenever the computed `milliseconds` changes
	useEffect( () => {
		// Set the timeout, but only if `autoStart` is true
		if ( autoStart ) {
			set()
		}

		// Clear/cancel the timeout
		return clear
	}, [ milliseconds ] )

	let returnValue: UseTimeoutFnReturn = [
		isTimeoutComplete,
		clear,
		set
	]
	returnValue.complete = isTimeoutComplete
	returnValue.set = set
	returnValue.clear = clear

	return returnValue as UseTimeoutFnReturn
}
