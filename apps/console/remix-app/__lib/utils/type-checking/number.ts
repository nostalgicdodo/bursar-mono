
export function isANumber ( value: unknown ): value is number {
	return (
		typeof value === "number"
		&& !Number.isNaN( value )
	)
}
	export function isNotANumber ( value: unknown ) {
		return (
			typeof value !== "number"
			|| Number.isNaN( value )
		)
	}

export function isNumberAnInteger ( value: number ) {
	return Math.floor( value ) === value
}
	export function isNumberNotAnInteger ( value: number ) {
		return Math.floor( value ) !== value
	}

export function isNumberANonNegativeInteger ( value: number ) {
	return (
		Math.floor( value ) === value
		&& value >= 0
	)
}
	export function isNumberNotANonNegativeInteger ( value: number ) {
		return (
			Math.floor( value ) !== value
			|| value < 0
		)
	}
