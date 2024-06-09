
/**
 |
 | useRerender
 |
 | Returns a `rerender` function that can be invoked to trigger a component's render function.
 |
 |
 */

import { useReducer } from "react"





export default function useRerender () {
	const [ , rerender ] = useReducer( createNewEmptyObject, createNewEmptyObject )
		// ^ returning a new object from the reducer function
		// 		ensures that the value is always unique,
		// 		and therefore always distinct from the previous value

	return rerender
}

function createNewEmptyObject () {
	return { }
}
