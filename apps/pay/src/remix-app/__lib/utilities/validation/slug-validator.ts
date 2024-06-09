
import { createValidator } from "./create-validator"





const INVALID_SLUG_REGEX_1 = /[^a-z\-\d]/
	// ^ any character except lowercase a to z, and hyphens
const INVALID_SLUG_REGEX_2 = /--/
	// ^ at least two consecutive hyphens

export default [
	createValidator( "INVALID", function ( v ) {
		return (
			INVALID_SLUG_REGEX_1.test( v )
			|| INVALID_SLUG_REGEX_2.test( v )
		)
	} ),
]
