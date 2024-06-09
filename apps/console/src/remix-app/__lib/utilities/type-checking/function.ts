
export function isAFunction ( value: unknown ): value is Function {
	return typeof value === "function"
}
export function isNotAFunction ( value: unknown ) {
	return ! isAFunction( value )
}
