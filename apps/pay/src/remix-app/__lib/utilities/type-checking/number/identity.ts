
/**-> to doi! */
// Accounts for NaN, Infinity, -Infinity, but not for BigInt?
export function isAFiniteNumber ( value: unknown ): value is number {
	return Number.isFinite( value )

	// Previous implementation:
	// return (
	// 	typeof value === "number"
	// 	&& !Number.isNaN( value )
	// )
}
	export function isNotAFiniteNumber ( value: unknown ) {
		return (
			typeof value !== "number"
			|| Number.isNaN( value )
			|| !Number.isFinite( value )
		)
	}

export function isAnIntegerNumber ( value: unknown ): value is number {
	return Number.isSafeInteger( value )
	// return Math.floor( value ) === value
}
	export function isNotAnIntegerNumber ( value: number ) {
		return !Number.isSafeInteger( value )
	}

export function isANonNegativeIntegerNumber ( value: unknown ): value is number {
	return (
		Number.isSafeInteger( value )
		&& ( value as number ) >= 0
	)
}
	export function isNotANonNegativeIntegerNumber ( value: unknown ) {
		return (
			!Number.isSafeInteger( value )
			|| ( value as number ) < 0
		)
	}


export function isAPositiveIntegerNumber ( value: unknown ): value is number {
	return (
		Number.isSafeInteger( value )
		&& ( value as number ) > 0
	)
}
	export function isNotAPositiveIntegerNumber ( value: unknown ) {
		return (
			!Number.isSafeInteger( value )
			|| ( value as number ) < 1
		)
	}
