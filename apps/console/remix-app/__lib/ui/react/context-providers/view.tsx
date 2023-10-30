
/**
 |
 | View Context
 |
 |
 */

 import * as React from "react"





 const ViewDataContext = React.createContext<any>( null )
 ViewDataContext.displayName = "ViewDataContext"

 type ViewDataProviderProps = {
	 value: any;
	 children?: React.ReactNode;
 }
 function ViewDataProvider ( { value, children }: ViewDataProviderProps ) {
	 const contextValue = value

	 return <ViewDataContext.Provider value={ contextValue }>
		 { children }
	 </ViewDataContext.Provider>
 }

 function useViewData () {
	 return React.useContext( ViewDataContext )
 }

 export { ViewDataProvider, useViewData }
