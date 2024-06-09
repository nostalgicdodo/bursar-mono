
export default function pixelToViewportHeightUnits ( value ) {
	return ( ( value / window.innerHeight ) * 100 ) + "vh"
}
