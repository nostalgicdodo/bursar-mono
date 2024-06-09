
import splice from "./splice"

export default function removeFromList ( list, fn ) {
	const index = list.findIndex( fn )
	if ( index === -1 ) {
		return list
	}
	return splice( list, index )
}
