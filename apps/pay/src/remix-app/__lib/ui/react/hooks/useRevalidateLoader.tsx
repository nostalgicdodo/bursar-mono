
/**
 |
 | useRevalidateLoader
 |
 | Issues:
 | The promise fails to resolve if the component is un-mounted.
 | 	It does run the resolver function.
 | 	However, the resolver function is the stub version, not the actual one.
 | 	Hence to solve this, this hook's return value needs to be passed from a parent component.
 |
 |
 */

import { useCallback, useEffect, useRef } from "react"
import { useRevalidator } from "@remix-run/react"

import throttle from "@/utilities/functions/throttle"
import usePreviousValue from "./usePreviousState"


/*
 |
 | This function is shared by **all the instances** of the `useRevalidateLoader` hook
 |
 |
 */
const functionThatCallsAGivenFunction = throttle( function ( fn ) {
	return fn()
} )

export default function useRevalidateLoader ( throttleInterval = 5 ) {
	const revalidator = useRevalidator()
	const revalidatorRef = useRef<typeof revalidator>()
		// ^ Since the `revalidator` object keeps changing,
		// 		we capture a live (real-time) reference to it
		// 		for use in the `revalidate` function below
		// 	Adding `revalidator` to the dependency array for `revalidate` does not work,
		// 		nor does doing away with the useCallback hook altogether.
	if ( revalidatorRef.current !== revalidator ) {
		revalidatorRef.current = revalidator
	}
	const previousRevalidatorState = usePreviousValue( revalidator.state )
	let revalidate__resolve = useRef( stubPromiseResolveFunction )

	const revalidate = useCallback( function () {
		return new Promise( ( resolve, reject ) => {
			revalidate__resolve.current = resolve
				// ^ capture a reference to the resolve function,
				// 		but do not call it here.

			revalidatorRef.current.revalidate()
		} )
	}, [ ] )

	useEffect( function () {
		const currentRevalidatorState = revalidator.state
		if ( previousRevalidatorState === "loading" && currentRevalidatorState === "idle" ) {
			revalidate__resolve.current( true )
		}
	}, [ revalidator, previousRevalidatorState ] )

	return () => functionThatCallsAGivenFunction.call( { interval: throttleInterval }, revalidate )
}




/**
 |
 | Helpers
 |
 |
 */
function stubPromiseResolveFunction ( value: unknown ) {
	// This is meant to be empty
}
