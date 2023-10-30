
import * as React from "react"
import { createPortal } from "react-dom"

export default function usePortal () {
	const [ ref, setRef ] = React.useState<HTMLElement | null>( null )

	return {
		ref: setRef,
		Portal: ( props ) => <Portal { ...props } ref={ ref } />,
	}
}

const Portal = React.forwardRef( function Portal ( { children = null }, ref ) {
	return ref ? createPortal( <>{ children }</>, ref ) : null
} )
