
const specialCharactersRegex = /[~!@#$%^&*\(\)_+\-=\[\]{}\/\\|<>\?]/
	// ^ the characters , . : ' and " are not considered  as special characters
export function hasSpecialCharacters ( value: string ) {
	value = value.trim()
	return specialCharactersRegex.test( value )
}
	export function doesNotHaveSpecialCharacters ( value: string ) {
		return ! hasSpecialCharacters( value )
	}
