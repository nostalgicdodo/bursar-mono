
/**
 |
 | useOnMount
 | This hook returns one value (offMountValue) during the first render of a component,
 | 	and another value (onMountValue) after the component has been mounted.
 |
 | For scenarios where a value can only be determined from a DOM node.
 |
 |
 */

import * as React from "react"
import useLayoutEffect from "@/ui/react/hooks/useLayoutEffect"

export default function useOnMount ( onMountValue, offMountValue ) {
	const [ value, setValue ] = React.useState( offMountValue )

	useLayoutEffect( function () {
		setValue( onMountValue )
	} )

	return value
}
