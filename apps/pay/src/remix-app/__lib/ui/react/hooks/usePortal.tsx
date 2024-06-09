
import { useState, useCallback, forwardRef } from "react"
import { createPortal } from "react-dom"

export default function usePortal () {
	const [ ref, setRef ] = useState<HTMLElement | null>( null )
	const _Portal = useCallback( function ( props ) {
		return <Portal { ...props } ref={ ref } />
	}, [ ref ] )

	return {
		ref: setRef,
		Portal: _Portal,
		// Portal: ( props ) => <Portal { ...props } ref={ ref } />,
	}
}

const Portal = forwardRef( function Portal ( { children = null }, ref ) {
	return ref ? createPortal( <>{ children }</>, ref ) : null
} )
