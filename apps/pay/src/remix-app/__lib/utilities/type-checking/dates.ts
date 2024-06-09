
import { isAFiniteNumber } from "./number/identity"

export function isADate ( v: unknown ): v is Date {
	return (
		v instanceof Date
		&& isAFiniteNumber( v.getTime() )
	)
}

export function isAfterToday ( value: number ) {
	return value > Date.now()
}

export function isAfterAYearFromToday ( value: number ) {
	let yearFromToday = new Date
	yearFromToday.setFullYear( yearFromToday.getFullYear() + 1 )

	return value > yearFromToday.getTime()
}

const January1st1910 = -1893456000000
export function isOnOrAfter1910 ( value: number ) {
	return value >= January1st1910
}
	export function isBefore1910 ( value: number ) {
		return ! isOnOrAfter1910( value )
	}
