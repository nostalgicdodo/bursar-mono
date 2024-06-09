
/**
 |
 | useComponentDimensions
 |
 | Draw inspiration from:
 | https://github.com/thomasthiebaud/react-use-size
 | https://usehooks-ts.com/react-hook/use-element-size
 | https://github.com/pmndrs/react-use-measure
 | https://github.com/streamich/react-use
 |
 |
 */

import * as React from "react"




type UseDOMNodeWidthReturnType<T> = [
	refCallback: React.RefCallback<T>,
	width?: number
]

export default function useDOMNodeWidth<T extends Element> (): UseDOMNodeWidthReturnType<T> {
	const [ width, setWidth ] = React.useState<number>()
	const observer = React.useRef( null )

	const [ refCallback,  ] = React.useState( function () {
		return function ( node ) {
			// Disconnect the observer
			if ( observer.current ) {
				observer.current.disconnect()
				observer.current = null
			}

			// Return early if the ref callback
			//  is not operating on a DOM node
			if (
				!node
				|| ( node.nodeType !== Node.ELEMENT_NODE )
			) {
				return
			}

			// Observe the node
			observer.current = new ResizeObserver( function ( [ entry ] ) {
				if ( !entry || !entry.borderBoxSize ) {
					return
				}
				setWidth( entry.borderBoxSize[ 0 ].inlineSize )
			} )
			observer.current.observe( node )
		}
	} )

	return [ refCallback, width ]
}
