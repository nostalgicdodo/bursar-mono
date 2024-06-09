
import type {
	ActionFunction,
	LoaderFunction,
} from "@remix-run/node"

import {
	redirect,
} from "@remix-run/node"





export const loader: LoaderFunction = ( { request, context } ) => {
	return redirect( "/dashboard" )
}

export const action: ActionFunction = ( { request, context } ) => {
	return null
}
