
export function waitFor ( seconds: number = 1 ) {
	return new Promise( function ( resolve ) {
		setTimeout( resolve, seconds * 1000 )
	} )
}
export const forADurationOf = waitFor
