
import { useState, useEffect } from "react"

import type { ViewportSizes } from "@/ui/viewport-sizes"

import viewportSizes from "@/ui/viewport-sizes"
import useLayoutEffect from "./useLayoutEffect"



type ComparisonOperators = "<" | ">="
type ViewportSizeSpecifiers = `${ ComparisonOperators } ${ ViewportSizes }`
const comparisonToQuery = {
	"<": "max-width",
	">=": "min-width",
}

export default function useViewportQuery ( sizeSpecifier: ViewportSizeSpecifiers ) {
	const [ comparisonOperator, viewportSize ] = sizeSpecifier.split( " " )
	const comparison = comparisonToQuery[ comparisonOperator ]
	const mediaQueryString = `( ${ comparison }: ${ viewportSizes[ viewportSize ] }px )`
	const mediaQuery = typeof window !== "undefined" ? matchMedia( mediaQueryString ) : false

	const [ matches, setMatches ] = useState( mediaQuery && mediaQuery.matches )

	useEffect( function () {
	// useLayoutEffect( function () {
		if ( ! mediaQuery ) {
			return
		}

		const handler = ( event: MediaQueryListEvent ) => {
			/**
			 * Using `e.matches` is more performant than checking properties
			 * like `window.innerWidth` which are prone to causing expensive
			 * style recalcs/layout operations.
			 *
			 * @see https://gist.github.com/paulirish/5d52fb081b3570c81e3a
			 */
			setMatches( event.matches ? true : false )
		}

		// If the browser supports the `addEventListener` API, the
		// following line will be truthy so we use it. If not, it will be
		// falsy and we use the deprecated `addListener` API.
		if ( mediaQuery.addEventListener ) {
			mediaQuery.addEventListener( "change", handler )
		}
		else {
			mediaQuery.addListener( handler )
		}

		// Clean up event listener after this effect is no longer needed.
		return function () {
			if ( mediaQuery.removeEventListener ) {
				mediaQuery.removeEventListener( "change", handler )
			}
			else {
				mediaQuery.removeListener( handler )
			}
			// Don't change when the mediaQuery reference changes
			// as we only use that on the first render.
		}
	}, [ sizeSpecifier ] )

	return matches
}
