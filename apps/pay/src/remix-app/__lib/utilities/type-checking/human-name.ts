
const humanFirstNameRegexNegation = /[^a-zA-Z']/
export function isAHumanFirstName ( value: string ) {
	value = value.trim()
	return ! humanFirstNameRegexNegation.test( value )
}
	export function isNotAHumanFirstName ( value: string ) {
		return ! isAHumanFirstName( value )
	}

const humanLastNameRegexNegation = /[^a-zA-Z'\s]/
const spacesRegex = /\s+/g
export function isAHumanLastName ( value: string ) {
	value = value.trim().replace( spacesRegex, " " )
	return ! humanLastNameRegexNegation.test( value )
}
	export function isNotAHumanLastName ( value: string ) {
		return ! isAHumanLastName( value )
	}


export function isAHumanName ( value: string ) {
	// const [ firstName, ...lastNameParts ] = value.trim().split( spacesRegex )
	// return isAHumanFirstName( firstName ) && isAHumanLastName( lastNameParts.join( " " ) )
	return isAHumanLastName( value )
		// ^ instead of validating the first name and last name separately,
		// 		just validate if the full name is a valid last name.
		// 		It is effectively the same thing.
}
	export function isNotAHumanName ( value: string ) {
		return ! isAHumanName( value )
	}
