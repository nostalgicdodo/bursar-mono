
export function useHTTP ( baseOptions ) {
	const [ responseBody, setResponseBody ] = React.useState( null )
	const [ issue, setIssue ] = React.useState( null )
	const [ requestState, setRequestState ] = React.useState( null )
	const dispatchers = {
		setResponseBody,
		setIssue,
		setRequestState,
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
		data: responseBody,
		issue
	}
}

function request ( url, options, dispatchers ) {
	React.useEffect( function () {
		const { setRequestState, setResponseBody, setIssue } = dispatchers
		const controller = new AbortController()
		let mounted = true

		fetch( url, { ...options, signal: controller.signal } )
			.then( function ( r ) {
				if ( !mounted ) return;
				return r.json()
			} )
			.then( function ( r ) {
				if ( !mounted ) return;
				setRequestState( "complete" )
				setResponseBody( r )
			} )
			.catch( function ( e ) {
				if ( !mounted ) return;
				setIssue( e )
			} )
			.finally( function () {
				setRequestState( "complete" )
			} )

		setRequestState( "in-flight" )

		return () => {
			mounted = false
			controller.abort()
		}
	}, [ ] )
}
