
import * as React from "react"

import negate from "@/utilities/functions/negate"





export default function useMountKey () {
	return React.useReducer<( v: boolean ) => boolean>( negate, false )
}

// export function _useMountKey () {
// 	const [ key, setKey ] = React.useState( null )

// 	const resetKey = React.useCallback( () => setKey( v => !v ), [ ] )

// 	return [ key, resetKey ]
// }
