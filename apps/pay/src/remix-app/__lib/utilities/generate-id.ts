
import { customAlphabet } from "nanoid/async"
import { isAnObject } from "./type-checking/object"
import { isABoolean } from "./type-checking/boolean"
import { isAString } from "./type-checking/strings/identity"

const DIGITS = "0123456789"
const UPPERCASE_ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const LOWERCASE_ALPHABETS = "abcdefghijklmnopqrstuvwxyz"

let generators = {
	ALPHANUMERIC: function () {
		const alphabet = [
			DIGITS,
			LOWERCASE_ALPHABETS,
			UPPERCASE_ALPHABETS,
		].join( "" )
		return {
			generate: customAlphabet( alphabet ),
			alphabet,
		}
	}(),

	NUMERIC: function () {
		const alphabet = [
			DIGITS,
		].join( "" )
		return {
			generate: customAlphabet( alphabet ),
			alphabet,
		}
	}(),

	NUMERIC_AND_UPPERCASE: function () {
		const alphabet = [
			DIGITS,
			UPPERCASE_ALPHABETS,
		].join( "" )
		return {
			generate: customAlphabet( alphabet ),
			alphabet,
		}
	}(),

	NUMERIC_AND_LOWERCASE: function () {
		const alphabet = [
			DIGITS,
			LOWERCASE_ALPHABETS,
		].join( "" )
		return {
			generate: customAlphabet( alphabet ),
			alphabet,
		}
	}(),
}





type CharacterSet = keyof typeof generators
export async function generateId (
	length: number,
	characterSet: CharacterSet = "ALPHANUMERIC",
	options: Partial<{ allowLeadingZero: boolean }> = { }
) {
	options = isAnObject( options ) ? options : { }
	options.allowLeadingZero = isABoolean( options.allowLeadingZero ) ? options.allowLeadingZero : true

	if ( !options.allowLeadingZero && generators[ characterSet ].alphabet.includes( "0" ) ) {
		return (
			await generateValueAtRandom( generators[ characterSet ], "0" )
			+ await generators[ characterSet ].generate( length - 1 )
		)
	}
	return await generators[ characterSet ].generate( length )
}



/*
 |
 | Helpers
 |
 |
 */

/*
 |
 | Generates a value from the given alphabet,
 | 	but excluding those specified
 |
 |
 */
async function generateValueAtRandom ( generator, exclude: string[] | string = [ ] ) {
	if ( isAString( exclude ) ) {
		exclude = [ exclude ]
	}
	let value

	do {
		value = await generator.generate( 1 )
	} while ( exclude.includes( value ) )

	return value
}
