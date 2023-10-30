
const emailRegex = /[^@]+@[^@]+/
export function isAnEmailAddress ( value: string ) {
	value = value.trim()
	return emailRegex.test( value )
}
	export function isNotAnEmailAddress ( value: string ) {
		return ! isAnEmailAddress( value )
	}
