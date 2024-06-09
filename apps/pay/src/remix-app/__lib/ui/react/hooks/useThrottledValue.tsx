
/**
 |
 | useThrottledValue
 |
 |
 */

import { isAFunction, isNotAFunction } from "@/utilities/type-checking/function"
import { isNotNull } from "@/utilities/type-checking/null-or-undefined"
import { useState, useEffect, useRef, useCallback, forwardRef } from "react"

const ASYNC_FUNCTION_CLASSNAME = "AsyncFunction"

export default function useThrottledValue<T> ( value: T, interval: number, leading = false ) {
	const [ throttledValue, setThrottledValue ] = useState<T | undefined>( function () {
		return isAFunction( value ) ? void 0 : value
			// ^ if the value is a function, we don't want to run it
	} )
	const valueRef = useRef<T>( value )
	const timeoutId = useRef<ReturnType<typeof setTimeout> | null>( null )
	interval = interval * 1000
	const lastUpdatedAt = useRef<number>( null )
	if ( lastUpdatedAt.current === null ) {
		lastUpdatedAt.current = Date.now()
	}
	const fnLastExecutedAt = useRef<number | null>( null )
	let fnArgs: any[]

	const onTimeout = useCallback( function () {
		timeoutId.current = null

		if ( throttledValue === valueRef.current ) {
			lastUpdatedAt.current = Date.now()
			return
		}
		if ( isNotAFunction( valueRef.current ) ) {
			setThrottledValue( valueRef.current )
			lastUpdatedAt.current = Date.now()
			return
		}

		setThrottledValue( valueRef.current() )
		return _setTimeout( interval )
		// ^ TODO: async function
	}, [ ] )

	const _setTimeout = useCallback( function ( interval ) {
		const timePassedSinceLastUpdate = Date.now() - lastUpdatedAt.current
		if ( timePassedSinceLastUpdate >= interval ) {
			return onTimeout()
		}

		timeoutId.current = setTimeout( onTimeout, ( interval - timePassedSinceLastUpdate ) )
		return function () {
			clearTimeout( timeoutId.current )
		}
	}, [ ] )


	/*
	 | If the interval changes, clear and set a new timeout
	 |
	 */
	useEffect( function () {
		return _setTimeout( interval )
	}, [ interval ] )

	/*
	 | If the value changes, update the valueRef
	 |
	 */
	useEffect( function () {
		valueRef.current = value

		// If a timeout interval is already in progress, do nothing
		if ( isNotNull( timeoutId.current ) ) {
			return
		}

		// Else, set up a new timeout interval
		return _setTimeout( interval )
	}, [ value ] )

	return throttledValue
}
