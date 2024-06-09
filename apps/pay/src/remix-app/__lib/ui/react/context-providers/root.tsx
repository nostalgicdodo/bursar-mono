
/*
 |
 | Global/Root Context
 |
 |
 */

import { useNavigation } from "@remix-run/react"
import * as React from "react"




type User = { }
const RootContext = React.createContext<any>( { } )
RootContext.displayName = "RootContext"

type RootProviderProps = {
	context: {
		environment: Record<string, unknown>;
		user: User | null;
	};
	children?: React.ReactNode;
}
function RootProvider ( { context: { environment, user }, children }: RootProviderProps ) {
	const contextValue = {
		environment,
		user,
	}

	return <RootContext.Provider value={ contextValue }>
		{ children }
	</RootContext.Provider>
}

function useRootContext () {
	return React.useContext( RootContext )
}

export { RootProvider, useRootContext }
