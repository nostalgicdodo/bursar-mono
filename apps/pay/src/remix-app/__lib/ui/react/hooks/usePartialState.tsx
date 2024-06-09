
import {
	getProperty,
	setProperty
} from "dot-prop"
import * as React from "react"

import identity from "@/utilities/functions/identity"
import { isNonBlankString } from "@/utilities/type-checking/strings/identity"
import { isAnObject } from "@/utilities/type-checking/object"
import useRerender from "./useRerender"

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
	const rerender = useRerender()
		// ^ when a sub-tree of the state is modified,
		// 		for some reason, the consumers of this hook
		// 		are not notified

	function setState ( keyOrPartial, value ) {
		// ^ value can be a function as well
		if ( isNonBlankString( keyOrPartial ) ) {
		// if ( typeof keyOrPartial === "string" && keyOrPartial.trim() ) {
			dispatch( { [ keyOrPartial ]: value } )
			rerender()
		}
		else if ( isAnObject( keyOrPartial ) ) {
			dispatch( keyOrPartial )
			rerender()
		}
	}
	return [ state, setState ]
}
