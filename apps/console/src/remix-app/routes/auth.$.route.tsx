
/**
 |
 | Proxy to the underlying /auth routes managed by Express
 |
 |
 */

import type {
	ActionFunction,
	LoaderFunction,
} from "@remix-run/node"





export const loader: LoaderFunction = ( { request, context } ) => {
	return context
}

export const action: ActionFunction = ( { request, context } ) => {
	return new Response( JSON.stringify( context.response.body ), {
		status: context.response.code ?? 200,
		headers: {
			"Content-Type": "application/json",
		}
	} )
}
