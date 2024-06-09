
export function isAString ( value: unknown ): value is string {
	return typeof value === "string"
}
export function isNotAString<T extends unknown> ( value: T ): value is Exclude<T, string> {
	return ! isAString( value )
}


export function isStringEmpty ( value: string ): value is "" {
	return value === ""
}
export function isStringNotEmpty<T extends string> ( value: string ): value is Exclude<T, ""> {
	return ! isStringEmpty( value )
}


export function isStringBlank ( value: string ) {
	return value.trim() === ""
}
export function isStringNotBlank<T extends string> ( value: T ): value is Exclude<T, ""> {
	return ! isStringBlank( value )
}



/*
 |
 | Compound type checks
 |
 |
 */
export function isNonEmptyString<T extends string> ( value: unknown ): value is Exclude<T, ""> {
	return isAString( value ) && isStringNotEmpty( value )
}
export function isBlankString ( value: unknown ): value is string {
	return isAString( value ) && isStringBlank( value )
}
export function isNonBlankString<T extends string> ( value: unknown ): value is Exclude<T, ""> {
	return isAString( value ) && isStringNotBlank( value )
}
