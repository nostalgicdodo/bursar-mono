
/**
 |
 | HTTP Request and Response helpers
 |
 |
 */

import type {
	AppLoadContext,
} from "@remix-run/node"

import {
	json,
	redirect,
	createCookieSessionStorage,
} from "@remix-run/node"
// import invariant from "tiny-invariant"

import { emptyObject } from "@/utilities/literals"
import { isAnObject } from "@/utilities/type-checking/object"
import EntityNotCreatedError from "@/e/entity-not-created-error"
import ValidationError from "@/e/validation-error"
// import { getUserRecord__byInternalId } from "~/entities/user/read"
import { isAString, isNotAString, isStringBlank } from "@/utilities/type-checking/strings/identity"
import { safeRedirect } from "@/utilities/routing"
import EntityNotFoundError from "@/e/entity-not-found-error"
import { isNullOrUndefined } from "@/utilities/type-checking/null-or-undefined"
import { isAnArray } from "@/utilities/type-checking/array"
import { isANumber } from "@/utilities/type-checking/number"
import InvalidInputError from "@/e/invalid-input-error"
import UnauthorizedError from "@/e/unauthorized-error"





/**
 |
 | Constants
 |
 |
 */
const USER_SESSION_KEY = "userId"

/**
 |
 | Request helpers
 |
 |
 */
const typeCheckers = {
	"object": isAnObject,
	"array": isAnArray,
	"string": isAString,
	"number": isANumber,
}
export async function getJSONBody ( request: Request, expectedType?: "object" | "array" | "string" | "number" ) {
	try {
		const body = JSON.parse( await request.text() )
		if (
			isNullOrUndefined( expectedType )
			|| typeCheckers[ expectedType ]( body )
		) {
			return body
		}
		else {
			throw new InvalidInputError()
		}
	}
	catch ( e ) {
		return improperRequestResponse()
	}
}

// invariant( process.env.SESSION_SECRET, "Environment Vars: SESSION_SECRET is not set." )
// export const sessionStorage = createCookieSessionStorage( {
// 	cookie: {
// 		name: "__session",
// 		httpOnly: true,
// 		path: "/",
// 		sameSite: "lax",
// 		secrets: [ process.env.SESSION_SECRET ],
// 		secure: process.env.NODE_ENV === "production",
// 	},
// } )

// export async function getSession ( request: Request ) {
// 	return sessionStorage.getSession( request.headers.get( "Cookie" ) )
// }
// export async function getUserIdFromSession ( request: Request ): Promise<string | undefined> {
// 	const session = await getSession( request )
// 	const userId = session.get( USER_SESSION_KEY )
// 	return userId
// }
// export async function getUserIdFromSessionOrPromptLogin ( request: Request ): Promise<string | undefined> {
// 	const session = await getSession( request )
// 	const userId = session.get( USER_SESSION_KEY )
// 	if ( isNotAString( userId ) || isStringBlank( userId ) ) {
// 		throw await promptLoginResponse( request )
// 	}
// 	return userId
// }
export async function getUserFromSessionOrPromptLogin ( request: Request, context: AppLoadContext ) {
	// const userId = await getUserIdFromSession( request )
	// if ( isNotAString( userId ) || isStringBlank( userId ) ) {
	// 	throw await promptLoginResponse( request )
	// }

	// const user = await getUserRecord__byInternalId( userId )
	// if ( ! user ) {
	// 	throw await promptLoginResponse( request )
	// }

	const user = context.session?.user
	if ( ! user ) {
		throw await promptLoginResponse( request )
	}

	return user
}
// export async function getUserIdFromSessionOrIssue404 ( request: Request ): Promise<string | undefined> {
// 	const session = await getSession( request )
// 	const userId = session.get( USER_SESSION_KEY )
// 	if ( isNotAString( userId ) || isStringBlank( userId ) ) {
// 		throw new Error
// 	}
// 	return userId
// }








/**
 |
 | Response helpers
 |
 |
 */

export function getResponseFromError ( e ) {
	if ( e instanceof ValidationError ) {
		return unprocessableContentResponse( e.data )
	}
	else if ( e instanceof EntityNotFoundError ) {
		return resourceNotFoundResponse()
	}
	else if ( e instanceof EntityNotCreatedError ) {
		return serverErrorResponse()
	}
	else if ( e instanceof UnauthorizedError ) {
		return resourceNotFoundResponse()
	}
	else if ( e instanceof InvalidInputError ) {
		return improperRequestResponse()
	}
	else {
		return serverErrorResponse()
	}
}
export function successResponse ( data?: { } | null, options: { } = { } ) {
	return json( {
		ok: true,
		statusCode: 200,
		data: ( isAnObject( data ) || isAnArray( data ) ) ? data : emptyObject
	}, {
		status: 200,
		...options
	} )
}

export function resourceCreatedResponse ( data?: { } | null ) {
	return json( {
		ok: true,
		statusCode: 201,
		data: isAnObject( data ) ? data : emptyObject
	}, {
		status: 201
	} )
}

export async function redirectResponse ( to: string, fallbackTo?: string, options?: Record<PropertyKey, unknown> ) {
	return redirect( safeRedirect( to, fallbackTo ), options )
}

export function improperRequestResponse ( data?: { } | null ) {
	return json( {
		ok: false,
		statusCode: 400,
		data: isAnObject( data ) ? data : emptyObject
	}, {
		status: 400,
		headers: { "Cache-Control": "no-store" }
	} )
}

export function unauthenticatedResponse ( data?: { } | null ) {
	return json( {
		ok: false,
		statusCode: 401,
		data: isAnObject( data ) ? data : emptyObject
	}, {
		status: 401,
		headers: { "Cache-Control": "no-store" }
	} )
}

export function unauthorisedResponse ( data?: { } | null ) {
	return json( {
		ok: false,
		statusCode: 403,
		data: isAnObject( data ) ? data : emptyObject
	}, {
		status: 403,
		headers: { "Cache-Control": "no-store" }
	} )
}

export function resourceNotFoundResponse ( data?: { } | null ) {
	return json( {
		ok: false,
		statusCode: 404,
		data: isAnObject( data ) ? data : emptyObject
	}, {
		status: 404,
		headers: { "Cache-Control": "no-store" }
	} )
}

export function resourceExistsResponse ( data?: { } | null ) {
	return json( {
		ok: false,
		statusCode: 409,
		data: isAnObject( data ) ? data : emptyObject
	}, {
		status: 409,
		headers: { "Cache-Control": "no-store" }
	} )
}

export function unprocessableContentResponse ( data?: { } | null ) {
	return json( {
		ok: false,
		statusCode: 422,
		issues: isAnObject( data ) ? data : emptyObject,
		data: emptyObject
	}, {
		status: 422,
		headers: { "Cache-Control": "no-store" }
	} )
}

export function serverErrorResponse ( data?: { } | null ) {
	return json( {
		ok: false,
		statusCode: 500,
		data: isAnObject( data ) ? data : emptyObject
	}, {
		status: 500,
		headers: { "Cache-Control": "no-store" }
	} )
}

export function serviceUnavailableResponse ( data?: { } | null ) {
	return json( {
		ok: false,
		statusCode: 503,
		data: isAnObject( data ) ? data : emptyObject
	}, {
		status: 503,
		headers: { "Cache-Control": "no-store" }
	} )
}


export async function promptLoginResponse ( request: Request ) {
	// const session = await getSession( request )
	const redirectTo = new URL( request.url ).pathname
	const searchParams = new URLSearchParams( [ [ "redirectTo", redirectTo ] ] )
	return redirect( `/login?${ searchParams }`, {
		// headers: {
		// 	"Set-Cookie": await sessionStorage.destroySession( session ),
		// }
	} )
}

// export async function logoutResponse ( request: Request ) {
// 	const session = await getSession( request )
// 	return redirect( "/", {
// 		headers: {
// 			"Set-Cookie": await sessionStorage.destroySession( session ),
// 		},
// 	} )
// }





/**
 |
 | Other
 |
 |
 */
type CreateUserSessionArgs = {
	request: Request;
	userId: string;
	remember: boolean;
}
// export async function createUserSessionCookie ( { request, userId, remember }: CreateUserSessionArgs ) {
// 	const session = await getSession( request )
// 	session.set( USER_SESSION_KEY, userId )
// 	return {
// 		"Set-Cookie": await sessionStorage.commitSession( session, {
// 			maxAge: remember
// 					? 60 * 60 * 24 * 7	// 7 days
// 					: undefined,
// 		} ),
// 	}
// }
