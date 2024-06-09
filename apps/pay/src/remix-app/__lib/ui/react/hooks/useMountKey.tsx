
import { useReducer } from "react"

import negate from "@/utilities/functions/negate"





export default function useMountKey () {
	return useReducer<( v: number ) => number>( function ( state ) {
		return ( state + 1 ) % 1000
	}, 1 )
}


// export function _useMountKey () {
// 	return useReducer<( v: boolean ) => boolean>( negate, false )
// }

// export function __useMountKey () {
// 	const [ key, setKey ] = React.useState( null )

// 	const resetKey = React.useCallback( () => setKey( v => !v ), [ ] )

// 	return [ key, resetKey ]
// }
