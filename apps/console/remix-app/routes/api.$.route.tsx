
/**
 |
 | Proxy to the underlying /api routes managed by Express
 |
 |
 */

import type {
	ActionFunction,
	LoaderFunction,
} from "@remix-run/node"





export const loader: LoaderFunction = ( { request, context } ) => {
	const responseCode = context.response.code
	return new Response( JSON.stringify( {
		...context.response.body,
		ok: ( !responseCode || ( responseCode >= 200 && responseCode < 300 ) )
	} ), {
		status: responseCode ?? 200,
		headers: {
			"Content-Type": "application/json",
		}
	} )
}

export const action: ActionFunction = ( { request, context } ) => {
	const responseCode = context.response.code
	return new Response( JSON.stringify( {
		...context.response.body,
		ok: ( !responseCode || ( responseCode >= 200 && responseCode < 300 ) )
	} ), {
		status: responseCode ?? 200,
		headers: {
			"Content-Type": "application/json",
		}
	} )
}
