
import { isStringNotANumber } from "@/utilities/type-checking/strings/number"
import { createValidator } from "./create-validator"

export default [
	createValidator( "INVALID", isStringNotANumber ),
	createValidator( "LONG", function ( v: number ) {
		// Does the number have more than two digits
		// 	after the decimal point?
		const parts = String( v ).split( "." )
		if ( parts[ 1 ] ) {
			return parts[ 1 ].length > 2
		}
		return false
	} ),
]
