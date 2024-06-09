
export function isGreaterThan ( n: number ) {
	return function isGreaterThan ( value: number ) {
		return value > n
	}
}

export function isGreaterThanOrEqualTo ( n: number ) {
	return function isGreaterThanOrEqualTo ( value: number ) {
		return value >= n
	}
}

export function isLessThan ( n: number ) {
	return function isLessThan ( value: number ) {
		return value < n
	}
}

export function isLessThanOrEqualTo ( n: number ) {
	return function isLessThanOrEqualTo ( value: number ) {
		return value <= n
	}
}
