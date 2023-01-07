
export default {
	get,
	post
}



export function get ( url, options ) {
	if ( options.q ) {
		const searchParams = getQueryString( options.q )
		delete options.q
		url += "?" + searchParams
	}
	return request( url, {
		...defaultOptions,
		...options,
		method: "GET"
	} )
}
export function post () {
	// const headers = new Headers()
	// headers.append( "Content-Type", "application/json" )
	// return window.fetch( url, {
	// 	headers,
	// 	body: JSON.stringify( { type: name, context } ),
	// 	redirect: "follow"
	// } )
}

function request ( url, options ) {
	const controller = new AbortController()

	const requestPromise = window.fetch( url, { ...options, signal: controller.signal } )
		.then( function ( r ) {
			return r.json()
		} )
		// .catch( function ( e ) {
		// } )
		// .finally( function () {
		// } )
	const abortRequest = () => controller.abort()

	return {
		promise: requestPromise,
		abort: abortRequest,
	}
}

function getQueryString ( parameters ) {
	const urlObject = new URL( "https://example.com/" )
	for ( let key in parameters ) {
		const value = parameters[ key ]
		if ( ! Array.isArray( value ) )
			urlObject.searchParams.set( key, valueOrEmptyString( value ) )
		else {
			for ( let el of value )
				urlObject.searchParams.append( key, valueOrEmptyString( el ) )
		}
	}
	return urlObject.searchParams.toString()
}

const defaultOptions = {
	cache: "no-cache",
	credentials: "include",
}

function valueOrEmptyString ( value ) {
	if ( [ null, void 0 ].includes( value ) )
		return ""
	else
		return value
}
