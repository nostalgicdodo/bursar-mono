
/*
 |
 | Global Context
 |
 |
 */

import { useNavigation } from "@remix-run/react"
import * as React from "react"

import usePartialState from "~/components/react-hooks/usePartialState"
import useRegionDimensions from "~/components/react-hooks/useRegionDimensions"



const RootContext = React.createContext<any>( {
	availableMainContentHeight: "100vh",
} )
RootContext.displayName = "RootContext"

type RootProviderProps = {
	environment: Record<string, unknown>,
	children?: React.ReactNode;
}
function RootProvider ( { environment, children }: RootProviderProps ) {
	const [ state, setState ] = usePartialState()
	const { main, top } = useRegionDimensions()
	// const mainRegionHeight = main.height
	// const topRegionHeight = top.height
	// const [ minimumMainContentHeight, setMinimumMainContentHeight ] = React.useState( "auto" )
	const minimumMainContentHeight = React.useMemo( function () {
		if ( typeof window === "undefined" ) {
			return 0
		}
		const height = ( main.height / window.innerHeight ) * 100
		if ( height < 1 ) {
			return 0
		}
		return height + "vh"
	}, [ main.height ] )
	const topRegionHeight = React.useMemo( function () {
		if ( typeof window === "undefined" ) {
			return 0
		}
		const height = ( top.height / window.innerHeight ) * 100
		if ( height < 1 ) {
			return 0
		}
		return height + "vh"
	}, [ main.height ] )

	// React.useLayoutEffect( function () {
	// React.useEffect( function () {
	// 	const height = ( mainRegionHeight / window.innerHeight ) * 100
	// 	if ( height < 1 )
	// 		return;
	// 	setMinimumMainContentHeight( height + "vh" )
	// }, [ mainRegionHeight ] )


	const contextValue = {
		environment,
		minimumMainContentHeight,
		topRegionHeight,
	}

	return <RootContext.Provider value={ contextValue }>
		{ children }
	</RootContext.Provider>
}

function useRootContext () {
	return React.useContext( RootContext )
}

export { RootProvider, useRootContext }
