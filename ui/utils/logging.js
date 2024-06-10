
export function log ( name, context, scope ) {
	if ( !scope )
		return;

	const headers = new Headers()
	headers.append( "Content-Type", "application/json" )

	name = name.toLowerCase()
	return Promise.resolve()
	// return window.fetch( `/api/v1/${ scope }/register_event`, {
	// 	method: "POST",
	// 	headers,
	// 	credentials: "include",
	// 	body: JSON.stringify( { type: name, context } ),
	// 	redirect: "follow"
	// } )
}
