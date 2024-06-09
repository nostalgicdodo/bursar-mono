
const viewportSizes = {
	xs: 360,
	sm: 400,
	md: 640,
	lg: 1040,
	xl: 1480,
}

export const viewportSizesInPixels = Object.fromEntries( Object.entries( viewportSizes ).map( function ( e ) {
	e[ 1 ] = `${ e[ 1 ] }px`;
	return e
} ) )

export default viewportSizes
