
/*
 |
 | User Context
 |
 |
 */

import { useTransition as useNavigation } from "@remix-run/react"
import * as React from "react"

const UserContext = React.createContext( null )
UserContext.displayName = "UserContext"

function UserProvider ( { children, user } ) {
	user = user || { }

	const contextValue = user

	return <UserContext.Provider value={contextValue}>
		{ children }
	</UserContext.Provider>
}

function useUserContext () {
	const context = React.useContext( UserContext )
	if ( context === void 0 )
		throw new Error( "No UserProvider context was found." )
	return context
}

export { UserProvider, useUserContext }
