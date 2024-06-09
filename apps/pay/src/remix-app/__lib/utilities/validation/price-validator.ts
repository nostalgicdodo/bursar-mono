
import { isStringNotANumber } from "@/utilities/type-checking/strings/number"
import { createValidator } from "./create-validator"
import { isLongerThan } from "../type-checking/strings/length"

export default [
	createValidator( "INVALID", isStringNotANumber ),
	createValidator( "INVALID", function ( v: number ) {
		// Does the number have more than two digits
		// 	after the decimal point?
		const parts = String( v ).split( "." )
		return (
			parts.length === 2
			&& parts[ 1 ].length > 2
		)
	} ),
	createValidator( "LONG", function ( v: number ) {
		return isLongerThan( 6 )( v.toString().split( "." )[ 0 ] )
	} ),
]
