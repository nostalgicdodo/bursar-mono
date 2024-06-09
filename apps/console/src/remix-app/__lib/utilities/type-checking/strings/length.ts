
export function isLongerThan ( numberOfCharacters: number ) {
	return function isLongerThan ( value: string ) {
		return value.trim().length > numberOfCharacters
	}
}

export function isLongerThanOrEqualTo ( numberOfCharacters: number ) {
	return function isLongerThanOrEqualTo ( value: string ) {
		return value.trim().length >= numberOfCharacters
	}
}

export function isShorterThan ( numberOfCharacters: number ) {
	return function isShorterThan ( value: string ) {
		return value.trim().length < numberOfCharacters
	}
}

export function isShorterThanOrEqualTo ( numberOfCharacters: number ) {
	return function isShorterThanOrEqualTo ( value: string ) {
		return value.trim().length <= numberOfCharacters
	}
}
