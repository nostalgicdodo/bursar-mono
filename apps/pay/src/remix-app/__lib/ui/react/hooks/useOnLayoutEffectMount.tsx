
/**
 |
 | useOnLayoutEffectMount
 | This hook returns one value (offMountValue) during the first render of a component,
 | 	and another value (onMountValue) after the component has been mounted.
 |
 | For scenarios where a value can only be determined from a DOM node.
 |
 |
 */

import { useState } from "react"
import useLayoutEffect from "@/ui/react/hooks/useLayoutEffect"

export default function useOnEffectMount ( onMountValue = true, offMountValue = false ) {
	const [ value, setValue ] = useState( offMountValue )

	useLayoutEffect( function () {
		setValue( onMountValue )
	} )

	return value
}
