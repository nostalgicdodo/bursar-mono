
export function isAnArray ( value: unknown ): value is unknown[] {
	return Array.isArray( value )
}
export function isNotAnArray ( value: unknown ) {
	return ! Array.isArray( value )
}


export function isArrayEmpty ( value: unknown[] ) {
	return value.length === 0
}
export function isArrayNotEmpty ( value: unknown[] ) {
	return value.length > 0
}


export function isAnEmptyArray ( value: unknown ): value is unknown[] {
	return Array.isArray( value ) && value.length === 0
}
export function isANonEmptyArray ( value: unknown ) {
	return Array.isArray( value ) && value.length > 0
}
