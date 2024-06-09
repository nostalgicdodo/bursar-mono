
/**
 |
 | Fine-grained Store Context
 |
 |
 */

import noOp from "@/utilities/functions/no-op"
import { getProperty, setProperty, deleteProperty, deepKeys } from "dot-prop"
import * as React from "react"

import { selectFromObject } from "@/utilities/objects"
import { isEmpty } from "@/utilities/type-checking/meta"
import { isAnObject } from "@/utilities/type-checking/object"
import { isNonBlankString } from "@/utilities/type-checking/strings/identity"
import { isAnArray } from "@/utilities/type-checking/array"





const ARRAY_PROPERTY_REGEX = /\[\d+\]$/
	// ^ propertyName[0]; implies that `propertyName` is an array field

type StoreDataType<T extends Record<string, unknown>> = {
	get: () => T;
	set: ( keyOrPartial: string | Partial<T>, value?: any ) => void;
	unset: ( key: string ) => void;
	subscribe: ( callback: () => void ) => () => void;
	reset: () => void;
}

export default function createFineGrainedStoreContext<Store extends Record<string, unknown>>( initialState: Store = { } ) {
	// if ( isNotAnObject( initialState ) ) {
	// 	initialState = { }
	// }
	let reset = noOp
		// ^ function to reset the entire context state

	function useStoreData (): StoreDataType<Store> {
		const store = React.useRef( null )
		if ( store.current === null ) {
			store.current = JSON.parse( JSON.stringify( initialState ) )
		}
			// ^ ensures that the _entire_ initial state is cloned **deeply**

		React.useMemo( function () {
			store.current[ Symbol.for( "" ) ] = false
		}, [ ] )

		const get = React.useCallback( () => store.current, [ ] )

		const subscribers = React.useRef( new Set<() => void>() )

		const set = React.useCallback( ( keyOrPartial: string | Partial<Store>, value?: any ) => {
			// store.current = { ...store.current, ...value }
				// ^ REMOVE THIS (if everything is working)
			let newPartialState
			if ( isNonBlankString( keyOrPartial ) ) {
				newPartialState = { [ keyOrPartial ]: value }
			}
			else if ( isAnObject( keyOrPartial ) ) {
				newPartialState = keyOrPartial
			}
			else {
				return
			}

			// const newState = { ...store.current }
			for ( let key in newPartialState ) {
				setProperty(
					store.current,
					key,
					typeof newPartialState[ key ] === "function" ?
						newPartialState[ key ]( getProperty( store.current, key ), store.current ) :
						newPartialState[ key ]
				)
			}

			store.current[ Symbol.for( "" ) ] = ! store.current[ Symbol.for( "" ) ]
			subscribers.current.forEach( callback => callback() )
		}, [ ] )

		const unset = React.useCallback( ( key: string ) => {
			deleteProperty( store.current, key )
			store.current[ Symbol.for( "" ) ] = ! store.current[ Symbol.for( "" ) ]
			subscribers.current.forEach( callback => callback() )
		}, [ ] )

		const subscribe = React.useCallback( ( callback: () => void ) => {
			subscribers.current.add( callback )
			return () => subscribers.current.delete( callback )
		}, [ ] )

		reset = React.useCallback( () => {
			const symbolValueBackup = store.current[ Symbol.for( "" ) ]
			// store.current = { ...initialState }
				// ^ this does not work
			let encounteredArrayProperties = { }
			for ( const property of deepKeys( store.current ) ) {
				// Array properties need to be reset in their entirety,
				// 	^ and not granularly
				if ( encounteredArrayProperties[ property ] ) {
					continue
				}
				if ( ARRAY_PROPERTY_REGEX.test( property ) ) {
					const propertyName__withoutIndexComponent = property.replace( ARRAY_PROPERTY_REGEX, "" )
					encounteredArrayProperties[ propertyName__withoutIndexComponent ] = true
					setProperty( store.current, propertyName__withoutIndexComponent, getProperty( initialState, propertyName__withoutIndexComponent ) ?? [ ] )
				}
				else {
					setProperty( store.current, property, getProperty( initialState, property ) ?? null )
				}
			}
				// ^ unfortunately, only by manually iterating over every property and re-setting one by one, will it work

			store.current[ Symbol.for( "" ) ] = ! symbolValueBackup
			subscribers.current.forEach( callback => callback() )
		}, [ ] )

		return {
			get,
			set,
			unset,
			subscribe,
			reset,
		}
	}

	const FineGrainedContext = React.createContext<ReturnType<typeof useStoreData> | null>( null )

	function FineGrainedStoreProvider ( { children }: { children: React.ReactNode } ) {
		return (
			<FineGrainedContext.Provider value={ useStoreData() }>
				{ children }
			</FineGrainedContext.Provider>
		)
	}

	function useStoreContext<SelectorOutput>(
		selector?: string | string[] | ( ( store: Store ) => SelectorOutput )
	): [ SelectorOutput, ( keyOrPartial: string | Partial<Store>, value?: any ) => void, ( key: string ) => void, () => void ] {
		const store = React.useContext( FineGrainedContext )
		if ( ! store ) {
			throw new Error( "useStoreContext can only be used within a FineGrainedStoreProvider." )
		}

		// These commented lines are referenced a little below
		// const [ state, setState ] = React.useState( () => selector( initialState ) )
		// React.useEffect( function () {
		// 	const unsubscribe = store.subscribe( () => setState( store.get() ) )
		// 	return unsubscribe
		// }, [ ] )

		const getSnapshot = React.useCallback( function () {
			return isEmpty( selector ) ? store.get() : selectFromObject( store.get(), selector )
		}, [ isAnArray( selector ) ? selector.join( "|" ) : selector ] )

		const getSnapshotSerialized = React.useCallback( function () {
			if ( isEmpty( selector ) ) {
				return store.get()[ Symbol.for( "" ) ]
			}
			const snapshot = getSnapshot()
			return isAnObject( snapshot ) ? JSON.stringify( snapshot ) : snapshot
		}, [ isAnArray( selector ) ? selector.join( "|" ) : selector ] )
			// ^ the serialized version is primarily for
			// 	the useSyncExternalStore hook to determine
			// 	if the requested context sub-tree has been modified

		// This line is (I think) equivalent to the commented lines above
		const state = React.useSyncExternalStore(
			store.subscribe,
			getSnapshotSerialized,
			getSnapshotSerialized,
		)

		return [ getSnapshot(), store.set, store.unset, store.reset ]
	}

	function resetStoreContext () {
		reset()
	}

	return {
		FineGrainedStoreProvider,
		useStoreContext,
		resetStoreContext,
	}
}
