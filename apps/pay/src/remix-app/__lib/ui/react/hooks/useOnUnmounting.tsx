
/**
 |
 | useOnUnmounting
 | This hook returns one value (offMountValue) during the first render of a component,
 | 	and another value (onMountValue) after the component has been mounted.
 |
 |
 */

import { useRef } from "react"
import useLayoutEffect from "@/ui/react/hooks/useLayoutEffect"

export default function useOnUnmounting () {
	const isUnmounting = useRef( false )

	useLayoutEffect( function () {
		isUnmounting.current = false
		return () => {
			isUnmounting.current = true
		}
	}, [ ] )

	return isUnmounting
}
