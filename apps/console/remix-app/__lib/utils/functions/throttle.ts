
export default function throttle ( fn: () => {}, duration: number ) {
	let timeoutId
	duration = duration * 1000
	return function ( ...args ) {
		if ( timeoutId )
			return;
		timeoutId = setTimeout( function () {
			timeoutId = null
			return fn( ...args )
		}, duration )
		return fn( ...args )
	}
}
