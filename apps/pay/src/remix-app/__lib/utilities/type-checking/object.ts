
const OBJECT_LOWERCASE = "object"
const OBJECT_TITLECASE = "Object"

export function isAnObject ( value: unknown ): value is Record<PropertyKey, unknown> {
	return (
		typeof value === OBJECT_LOWERCASE
		&& value !== null
		&& value.constructor.name === OBJECT_TITLECASE
	)
}
export function isNotAnObject ( value: unknown ) {
	return ! isAnObject( value )
}


export function isObjectEmpty ( value: unknown ) {
	return Object.keys( value ).length === 0
}
export function isObjectNotEmpty ( value: unknown ) {
	return ! isObjectEmpty( value )
}

export function isAnEmptyObject ( value: unknown ) {
	return isAnObject( value ) && isObjectEmpty( value )
}
export function isANonEmptyObject ( value: unknown ) {
	return isAnObject( value ) && isObjectNotEmpty( value )
}
