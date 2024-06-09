
const userHandleRegexNegation = /[^a-zA-Z0-9_]/
export function isAUserHandle ( value: string ) {
	value = value.trim()
	return ! userHandleRegexNegation.test( value )
}
	export function isNotAUserHandle ( value: string ) {
		return ! isAUserHandle( value )
	}
