
/**
 |
 | ARCHIVED: Not in use anymore
 |
 |
 */

import * as React from "react"

import useLayoutEffect from "@/ui/react/hooks/useLayoutEffect"

export default function useRegionDimensions () {
	const [ regions, getRegionDimensions ] = React.useReducer( regionDimensionsReducer, DEFAULT_REGION_VALUES )
	useLayoutEffect( function () {
		const documentBodyDOM = document.body
		const resizeObserver = new ResizeObserver( getRegionDimensions )
		resizeObserver.observe( documentBodyDOM )
		window.addEventListener( "resize", getRegionDimensions )

		// Run once to initalize
		getRegionDimensions()

		return function () {
			resizeObserver.unobserve( documentBodyDOM )
			window.removeEventListener( "resize", getRegionDimensions )
		}
	}, [ ] )
	return regions
}

function regionDimensionsReducer () {
	const stickyRegionTopDOM = document.getElementById( "sticky-region-top" )
	const stickyRegionTopHeight = stickyRegionTopDOM?.offsetHeight ?? 0
	const stickyRegionBottomDOM = document.getElementById( "sticky-region-bottom" )
	const stickyRegionBottomHeight = stickyRegionBottomDOM?.offsetHeight ?? 0

	return {
		top: {
			height: stickyRegionTopHeight
		},
		main: {
			height: window.innerHeight - stickyRegionTopHeight - stickyRegionBottomHeight
		},
	}
}

const DEFAULT_REGION_VALUES = {
	top: {
		height: 0
	},
	main: {
		height: 0
	},
}
