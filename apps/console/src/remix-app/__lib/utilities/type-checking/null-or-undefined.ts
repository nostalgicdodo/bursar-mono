
const nullValue = null
const undefinedValue = void 0

export function isNullOrUndefined ( value: unknown ): value is null | undefined {
	return value === nullValue || value === undefinedValue
}
export function isNotNullOrUndefined<T> ( value: T ): value is NonNullable<T> {
	return ! isNullOrUndefined( value )
}
