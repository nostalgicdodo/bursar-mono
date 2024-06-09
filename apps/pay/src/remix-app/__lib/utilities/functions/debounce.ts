
export default function debounce ( fn: () => {}, duration: number ) {
	let timeoutId
	duration = duration * 1000
	return function ( ...args ) {
		if ( timeoutId ) {
			clearTimeout( timeoutId )
			timeoutId = null
		}
		timeoutId = setTimeout( function () {
			return fn( ...args )
		}, duration )
	}
}
