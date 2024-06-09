
import * as React from "react"

import usePartialState from "./usePartialState"
import { isEmpty } from "@/utilities/type-checking/meta"
import { safeJSONParse } from "@/utilities/json"
import useOnSubsequentEffects from "./useOnSubsequentEffects"
import { runtimeEnv } from "@/utilities/env"





const ROOT_NAMESPACE = "this"
export default function useLocalStorage ( key, initial = { } ) {
	const fullKeyPath = ROOT_NAMESPACE + "/" + key
	const [ state, setState ] = usePartialState( initial, function ( initialArg ) {
		return getInitialState( fullKeyPath, initialArg )
	} )

	useSubscribedValue( fullKeyPath, setState )

	// Initialize the default value from the store
	React.useEffect( function () {
		const valueFromStore = safeJSONParse(
			window.localStorage.getItem( fullKeyPath )
		)
		if ( isEmpty( valueFromStore ) ) {
			return
		}
		setState( valueFromStore )
	}, [ ] )

	// Whenever the value updates, persist the value back to the store
	useOnSubsequentEffects( function () {
		window.localStorage.setItem( fullKeyPath, JSON.stringify( state ) )
	}, [ state ] )

	return [ state, setState ]
}



function getInitialState ( keyPath, initialArg ) {
	if ( runtimeEnv === "server" ) {
		return initialArg
	}
	const valueFromStore = safeJSONParse(
		window.localStorage.getItem( keyPath )
	)
	if ( isEmpty( valueFromStore ) ) {
		return initialArg
	}
	return valueFromStore
}

/*
 |
 | Given a key and a state setter,
 | 	subscribe and capture the changes
 | 	that originate from other tabs/windows
 |
 |
 */
function useSubscribedValue ( key, setState ) {
	React.useEffect( function () {
		function eventHandler ( event ) {
			const keyWhoseValueChanged = event.key
			if ( key !== keyWhoseValueChanged ) {
				return
			}
			let value
			try {
				value = JSON.parse( event.newValue )
			}
			catch ( e ) {
				return
			}
			setState( value )
		}

		window.addEventListener( "storage", eventHandler )
		return () => {
			window.removeEventListener( "storage", eventHandler )
		}
	}, [ key ] )
}
