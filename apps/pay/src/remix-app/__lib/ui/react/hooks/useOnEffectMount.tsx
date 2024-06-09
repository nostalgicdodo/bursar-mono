
/**
 |
 | useOnEffectMount
 | This hook returns one value (offMountValue) during the first render of a component,
 | 	and another value (onMountValue) after the component has been mounted.
 |
 | Similar to useOnLayoutEffectMount, but uses useEffect instead of useLayoutEffect.
 | 	This is useful in certain instances where you want to animated an element
 | 		from a start state to an end state.
 |
 |
 */

import { useState, useEffect } from "react"

export default function useOnEffectMount ( onMountValue = true, offMountValue = false ) {
	const [ value, setValue ] = useState( offMountValue )

	useEffect( function () {
		setValue( onMountValue )
	} )

	return value
}
