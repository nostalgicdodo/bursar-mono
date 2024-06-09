
import { useRef } from "react"

export default function useHasBeenRenderedBefore () {
	const rendered = useRef( false )
	if ( rendered.current === false ) {
		rendered.current = true
		return false
	}
	return rendered.current
}
