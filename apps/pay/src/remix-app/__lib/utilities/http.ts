
import { getProperty, deepKeys } from "dot-prop"

import { isNullish } from "@/utilities/type-checking/null-or-undefined"
import { isAnObject } from "./type-checking/object"

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
		url = mergeURLAndQueryParams( url, searchParams )
	}
	return request( url, {
		...defaultOptions,
		...options,
		method: "GET"
	} )
}

export function post ( url, payload, options = { } ) {
	if ( options.q ) {
		const searchParams = getQueryString( options.q )
		delete options.q
		url = mergeURLAndQueryParams( url, searchParams )
	}

	let { headers: _headers, ...remainingOptions } = options
	_headers = isAnObject( _headers ) ? _headers : { }

	const headers = new Headers()
	headers.append( "Content-Type", "application/json" )
	for ( let k in _headers ) {
		headers.append( k, _headers[ k ] )
	}

	return request( url, {
		...defaultOptions,
		...remainingOptions,
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
			urlObject.searchParams.set( key, isNullish( value ) ? "" : value )
		}
		else {
			for ( let el of value ) {
				urlObject.searchParams.append( key, isNullish( el ) ? "" : el )
			}
		}
	}
	return urlObject.searchParams.toString()
}

/*
 |
 | Merge a URL (which may itself have query parameters),
 | 	and a string of query parameters.
 |
 | `url` -> a relative/absolute URL that can include query parameters
 | `queryParamsString` -> key-value pairs formatted as a query parameter string
 |
 */
function mergeURLAndQueryParams ( url, queryParamsString ) {
	const urlObject = new URL(
		/^https?:\/\//.test( url )
			? url
			: `https://example.com${ url.startsWith( "/" ) ? "" : "/" }${ url }`
	)

	let mergedURL
	if ( /^https?:\/\//.test( url ) ) {
		mergedURL = urlObject.origin + urlObject.pathname
	}
	else {
		mergedURL = urlObject.pathname
	}
	mergedURL += "?" + urlObject.searchParams.toString() + "&" + queryParamsString

	return mergedURL
}
