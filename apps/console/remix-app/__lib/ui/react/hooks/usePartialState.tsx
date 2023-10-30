
import {
	getProperty,
	setProperty
} from "dot-prop"
import * as React from "react"

import identity from "@/utils/functions/identity"
import { isNonBlankString } from "@/utils/type-checking/strings/identity"
import { isAnObject } from "@/utils/type-checking/object"

function partialStateReducer ( currentState, newPartialState ) {
	const newState = { ...currentState }
	for ( let key in newPartialState ) {
		setProperty(
			newState,
			key,
			typeof newPartialState[ key ] === "function" ?
				newPartialState[ key ]( getProperty( currentState, key ), currentState ) :
				newPartialState[ key ]
		)
	}
	return newState
}

export default function usePartialState ( initialArg = { }, initializerFn = identity ) {
	const [ state, dispatch ] = React.useReducer( partialStateReducer, initialArg, initializerFn )
	function setState ( keyOrPartial, value ) {
		if ( isNonBlankString( keyOrPartial ) ) {
		// if ( typeof keyOrPartial === "string" && keyOrPartial.trim() ) {
			dispatch( { [ keyOrPartial ]: value } )
		}
		else if ( isAnObject( keyOrPartial ) ) {
			dispatch( keyOrPartial )
		}
	}
	return [ state, setState ]
}
