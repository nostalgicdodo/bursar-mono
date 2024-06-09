
import * as React from "react"
import { singletonHook } from "react-singleton-hook"

import { isWebBrowser } from "@/utilities/env"
import useLayoutEffect from "./useLayoutEffect"
import useOnlyOnWebBrowser from "./useOnlyOnWebBrowser"
import noOp from "@/utilities/functions/no-op"



const INITIAL_DEFAULT_REGION_DIMENSIONS = {
	top: {
		height: 0
	},
	main: {
		height: 0
	},
	bottom: {
		height: 0
	}
}

const useRegionDimensions = singletonHook( isWebBrowser ? getRegionDimensions( getElementsToInspect() ) : INITIAL_DEFAULT_REGION_DIMENSIONS, useRegionDimensionsImpl )
export default useRegionDimensions

function useRegionDimensionsImpl () {
	const [ elementsToInspect, ] = useOnlyOnWebBrowser( React.useState, [ [ ], noOp ], getElementsToInspect )
	const [ regionDimensions, setRegionDimensions ] = useOnlyOnWebBrowser( React.useState, [ INITIAL_DEFAULT_REGION_DIMENSIONS, noOp ], () => getRegionDimensions( elementsToInspect ) )

	// useLayoutEffect( function () {
	React.useInsertionEffect( function () {
		const rootElement = document.documentElement
		const resizeObserver = new ResizeObserver( function () {
			setRegionDimensions( getRegionDimensions( elementsToInspect ) )
		} )
		resizeObserver.observe( rootElement )
		// Object.values( elementsToInspect ).forEach( e => resizeObserver.observe( e ) )
		// window.addEventListener( "resize", () => { }, { passive: true } )

		return function () {
			resizeObserver.unobserve( rootElement )
			// Object.values( elementsToInspect ).forEach( e => resizeObserver.unobserve( e ) )
			// window.removeEventListener( "resize", () => { }, { passive: true } )
		}
	}, [ ] )

	return regionDimensions
}



/*
 |
 | Helper
 |
 |
 */
function getRegionDimensions ( { topRegion, bottomRegion } ) {
	const stickyTopRegionHeight = topRegion.offsetHeight
	const stickyBottomRegionHeight = bottomRegion.offsetHeight

	return {
		top: {
			height: stickyTopRegionHeight
		},
		main: {
			height: window.innerHeight - stickyTopRegionHeight - stickyBottomRegionHeight
		},
		bottom: {
			height: stickyBottomRegionHeight
		}
	}
}

function getElementsToInspect () {
	return {
		topRegion: document.getElementById( "sticky-region-top" ),
		bottomRegion: document.getElementById( "sticky-region-bottom" ),
	}
}
