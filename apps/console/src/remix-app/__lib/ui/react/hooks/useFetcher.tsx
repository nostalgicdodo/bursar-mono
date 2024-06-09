
/**
 |
 | Wrapper over Remix's `useFetcher`, i.e. the _fetcher-wrapper_
 |
 | This one simply includes an option to delay the response
 |
 |
 */
import * as React from "react"
import { useFetcher as _useFetcher } from "@remix-run/react"

import { isNotEmpty } from "@/utilities/type-checking/meta"
import { isANumber } from "@/utilities/type-checking/number"
import usePreviousValue from "@/ui/react/hooks/usePreviousState"



export default function useFetcher () {
	const fetcher = _useFetcher()
	const previousInternalFetcherState = usePreviousValue( fetcher.state )
	const [ isSubmitting, setIsSubmitting ] = React.useState<boolean>( false )
	const [ responseDelay, setResponseDelay ] = React.useState( 0 )
	const submissionTime = React.useRef<number | null>( null )
	const responseTime = React.useRef<number | null>( null )

	const defaultSubmitFunction = fetcher.submit
	const submit = React.useCallback( function ( ...args ) {
		const delayResponseBy = args[ 1 ].delayResponseBy
		if ( isANumber( delayResponseBy ) ) {
			setResponseDelay( delayResponseBy )
		}
		setIsSubmitting( true )
		defaultSubmitFunction.call( fetcher, ...args )
	}, [ ] )

	React.useEffect( function () {
		if ( fetcher.state === "submitting" ) {
			submissionTime.current = Date.now()
		}
	}, [ fetcher.state ] )

	React.useEffect( function () {
		if (
			fetcher.state !== "submitting"
			&& !responseDelay
		) {
			setIsSubmitting( false )
		}
	}, [ fetcher.state ] )

	React.useEffect( function () {
		if ( ! responseDelay ) {
			return
		}
		if ( fetcher.state === "submitting" ) {
			return
		}

		responseTime.current = parseFloat( ( ( Date.now() - submissionTime.current ) / 1000 ).toFixed( 3 ) )
		if ( responseDelay <= responseTime.current ) {
			return
		}

		const timeoutId = setTimeout( function () {
			// Reset various states to their default values
			setResponseDelay( 0 )
			setIsSubmitting( false )
		}, ( responseDelay - responseTime.current ) * 1000 )

		return () => {
			clearTimeout( timeoutId )
		}
	}, [
		previousInternalFetcherState === "submitting"
		|| fetcher.state === "loading"
		|| ( fetcher.state === "idle" && previousInternalFetcherState === "loading" )
	] )

	// React.useEffect( function () {
	// 	let timeoutId: number
	// 	if ( fetcher.state === "submitting" ) {
	// 		submissionTime.current = Date.now()
	// 	}
	// 	else if ( previousInternalFetcherState === "submitting" ) {
	// 		responseTime.current = parseFloat( ( ( Date.now() - submissionTime.current ) / 1000 ).toFixed( 3 ) )
	// 		if ( responseDelay && responseDelay > responseTime.current ) {
	// 			console.log( "IS delay; PROLONG submission phase for " + ( responseDelay - responseTime.current ) + " seconds." )
	// 			timeoutId = setTimeout( function () {
	// 				console.log( "IS delay; submission phase OVER" )
	// 				// Reset various states to their default values
	// 				submissionTime.current = null
	// 				setResponseDelay( 0 )
	// 				setIsSubmitting( false )

	// 				// If the underlying Remix fetcher is presently in the "idle" state,
	// 				// 	then re-create the native natural flow of state transitions
	// 				// 	i.e. the flow of states for a Remix fetcher: idle -> submitting -> loading -> idle
	// 				// 	so since we were in the "submitting" state (until now), we next transition to the "loading" state.
	// 				// 	Re-creating the flow is important so that all upstream consumers can safely expect the documented sequence of state transitions
	// 				// if ( fetcher.state === "idle" ) {
	// 					// setFetcherWrapperState( "loading" )
	// 				// }
	// 			}, ( responseDelay - responseTime.current ) * 1000 )
	// 		}
	// 		else {
	// 			console.log( "NO delay; submission phase OVER" )
	// 			submissionTime.current = null
	// 			setIsSubmitting( false )
	// 		}
	// 	}
	// 	return () => {
	// 		clearTimeout( timeoutId )
	// 	}
	// }, [ fetcher.state ] )

	// Logic for transitioning the fetcher-wrapper from one state over to the next
	// 	This exists solely to emulate the sequence of states of Remix's fetcher
	// React.useEffect( function () {
	// 	if ( ! fetcherWrapperState ) {
	// 		return
	// 	}

	// 	let nextState: string | null
	// 	if ( fetcherWrapperState === "loading" ) {
	// 		nextState = "idle"
	// 	}
	// 	else if ( fetcherWrapperState === "idle" ) {
	// 		nextState = null
	// 	}
	//	setFetcherWrapperState( nextState )
	// 		// ^ once the fetcher-wrapper's state gets to "loading", it transitions to "idle" right after
	// }, [ fetcherWrapperState ] )

	/*
	 | Logic for transitioning between the states of the _fetch-wrapper_
	 |
	 */
	const [ state, setState ] = React.useState( "idle" )
	React.useEffect( function () {
		if ( isSubmitting ) {
			return setState( "submitting" )
		}
		if ( previousInternalFetcherState === "loading" && fetcher.state === "idle" ) {
			return setState( "loading" )
		}
		setState( fetcher.state )
	}, [ previousInternalFetcherState, isSubmitting ] )
	// This side effect is for transitioning the state from "loading" to "idle"
	React.useEffect( function () {
		if ( state === "loading" && fetcher.state === "idle" ) {
			setState( "idle" )
		}
	}, [ state, fetcher.state ] )

	return {
		...selectiveClone( fetcher ),
		state,
		submit,
	}
}





/*
 |
 | Helpers
 |
 |
 */
function selectiveClone ( fetcher ) {
	let fetcherClone = { }
	for ( let key of [ "Form", "data", "formAction", "formData", "formEncType", "formMethod", "load", "state" ] ) {
		fetcherClone[ key ] = fetcher[ key ]
	}
	return fetcherClone
}
