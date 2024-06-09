
import { getProperty, deepKeys } from "dot-prop"

import { isNullOrUndefined } from "@/utilities/type-checking/null-or-undefined"

export default {
	get,
	post
}





const defaultOptions = {
	cache: "no-cache",
	credentials: "include",
}



export function get ( url, options = { } ) {
	if ( options.q ) {
		const searchParams = getQueryString( options.q )
		delete options.q
		const urlObject = new URL(
			/^https?:\/\//.test( url )
				? url
				: `https://example.com${ url.startsWith( "/" ) ? "" : "/" }${ url }`
		)

		if ( /^https?:\/\//.test( url ) ) {
			url = urlObject.origin + urlObject.pathname
		}
		else {
			url = urlObject.pathname
		}
		url += "?" + urlObject.searchParams.toString() + "&" + searchParams
	}
	return request( url, {
		...defaultOptions,
		...options,
		method: "GET"
	} )
}

export function post ( url, payload, options = { } ) {
	const headers = new Headers()
	headers.append( "Content-Type", "application/json" )
	return request( url, {
		...defaultOptions,
		...options,
		headers,
		method: "POST",
		body: JSON.stringify( payload ),
	} )
}





/**
 |
 | Helpers
 |
 |
 */
function request ( url, options = { } ) {
	const controller = new AbortController()

	const requestPromise = fetch( url, { ...options, signal: controller.signal } )
		.then( async function ( response ) {
			if ( response.status >= 400 ) {
				if ( response.headers.get( "content-type" ).toLowerCase().includes( "application/json" ) ) {
					throw await response.json()
				}
				throw await response.text()
			}
			else {
				if ( response.headers.get( "content-type" ).toLowerCase().includes( "application/json" ) ) {
					return response.json()
				}
				return response.text()
			}
		} )
	const abortRequest = () => controller.abort()

	return {
		promise: requestPromise,
		abort: abortRequest,
	}
}

export function getQueryString ( parameters ) {
	const urlObject = new URL( "https://example.com/" )
	for ( let key of deepKeys( parameters ) ) {
		const value = getProperty( parameters, key )
		if ( ! Array.isArray( value ) ) {
			urlObject.searchParams.set( key, isNullOrUndefined( value ) ? "" : value )
		}
		else {
			for ( let el of value ) {
				urlObject.searchParams.append( key, isNullOrUndefined( el ) ? "" : el )
			}
		}
	}
	return urlObject.searchParams.toString()
}
