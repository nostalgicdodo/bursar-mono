
export function isAFunction ( value: unknown ): value is Function {
	return typeof value === "function"
}
export function isNotAFunction ( value: unknown ): value is Exclude<unknown, Function> {
	return ! isAFunction( value )
}
