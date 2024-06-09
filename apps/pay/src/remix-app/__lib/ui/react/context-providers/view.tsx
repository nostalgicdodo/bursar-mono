
/**
 |
 | View Context
 |
 |
 */

import type { ReactNode } from "react"

import { createContext, useContext } from "react"





const ViewDataContext = createContext<unknown>( null )
ViewDataContext.displayName = "ViewDataContext"


type ViewDataProviderProps<T> = {
	value: T;
	children?: ReactNode;
}
function ViewDataProvider<T> ( { value, children }: ViewDataProviderProps<T> ) {
	const contextValue = value

	return <ViewDataContext.Provider value={ contextValue }>
		{ children }
	</ViewDataContext.Provider>
}

function useViewData () {
	return useContext( ViewDataContext )
}

export { ViewDataProvider, useViewData }
