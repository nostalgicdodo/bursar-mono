
export function waitFor ( seconds ) {
	seconds = (
		typeof seconds === "number"
		&& !Number.isNaN( seconds )
		&& seconds >= 0
	) ? seconds : 1
	const milliseconds = seconds * 1000
	let timeoutId	// this serves no purpose presently
	return new Promise( function ( resolve, reject ) {
		timeoutId = setTimeout( resolve, milliseconds )
		return timeoutId
	} )
}
