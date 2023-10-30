
const lowercaseRegex = /[a-z]/
const uppercaseRegex = /[A-Z]/
export function hasMixedCase ( value: string ) {
	value = value.trim()
	return lowercaseRegex.test( value ) && uppercaseRegex.test( value )
}
	export function doesNotHaveMixedCase ( value: string ) {
		return ! hasMixedCase( value )
	}
