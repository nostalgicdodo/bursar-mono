
export function useHTTP ( baseOptions ) {
	const [ responseBody, setResponseBody ] = React.useState( null )
	const [ issue, setIssue ] = React.useState( null )
	const [ requestState, setRequestState ] = React.useState( null )
	const [ inFlight, setInFlight ] = React.useState( false )
	const dispatchers = {
		setResponseBody,
		setIssue,
		setRequestState,
		setInFlight,
	}

	baseOptions = baseOptions || { }
	const defaultOptions = {
		cache: "no-cache"
	}
	const options = { ...defaultOptions, ...baseOptions }

	function get ( url, overrideOptions ) {
		const requestOptions = { ...options, ...overrideOptions, method: "GET" }
		request( url, requestOptions, dispatchers )
	}

	return {
		get,
		// put,
		// del,
		// post,
		requestState,
		inFlight,
		data: responseBody,
		issue
	}
}

function request ( url, options, dispatchers ) {
	React.useEffect( function () {
		const { setInFlight, setRequestState, setResponseBody, setIssue } = dispatchers
		const controller = new AbortController()
		let mounted = true

		fetch( url, { ...options, signal: controller.signal } )
			.then( function ( r ) {
				// setInFlight( false )
				if ( !mounted ) return;
				return r.json()
			} )
			.then( function ( r ) {
				if ( !mounted ) return;
				setRequestState( "complete" )
				setResponseBody( r )
			} )
			.catch( function ( e ) {
				// setInFlight( false )
				if ( !mounted ) return;
				setIssue( e )
			} )
			.finally( function () {
				// console.log( "Request no more in-flight." )
				setInFlight( false )
				setRequestState( "complete" )
			} )

		setInFlight( true )
		setRequestState( "in-flight" )

		return () => {
			// console.log( `request un-mounting: ${ url }` )
			// setInFlight( false )
			// setRequestState( "complete" )
			mounted = false
			controller.abort()
		}
	}, [ url ] )
}
