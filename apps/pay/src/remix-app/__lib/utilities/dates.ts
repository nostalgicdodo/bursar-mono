
import { isADate } from "./type-checking/dates"





const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24

/**
 |
 | Returns the day of the year,
 | 	normalized to a leap year range (i.e. 1 to 366)
 |
 |
 */
export function getDayOfYear ( date: Date | number | string = new Date ) {
	date = isADate( date ) ? date : coerceToDate( date )

	const startOfTheYear = new Date( date.getFullYear(), 0, 1 )
		// startOfTheYear.setTime( startOfTheYear.getTime() - startOfTheYear.getTimezoneOffset() * 60 * 1000 )
		// ^ in this particular instance,
		// 	we do not have to adjust the start of the year to UTC
		// 	because the math is all relative anyways

	const differenceInMilliseconds = date.getTime() - startOfTheYear.getTime()
	let dayIndex = Math.floor( differenceInMilliseconds / ONE_DAY_IN_MILLISECONDS )

	if ( dayIndex > 60 && !isLeapYear( date ) ) {
		// ^ i.e. is not a leap year,
		// 	and is past the **1st of March**,
		// 	(or what would've been the 29th of February on a leap year)
		return dayIndex + 1
			// ^ add 1 to normalize for a leap year range (i.e. 1 to 366)
	}
	else {
		return dayIndex
	}
}

function isLeapYear ( date: Date | number | string = new Date ) {
	date = isADate( date ) ? cloneDate( date ) : coerceToDate( date )

	// Set the date to the 29th of February
	date.setMonth( 1 )	// February (months are zero-based)
	date.setDate( 29 )	// 29th

	return date.getDate() === 29
}


function coerceToDate ( date?: Date | number | string ) {
	// if ( isADate( date ) ) {
	// 	return date
	// }

	// Attempt to coerce a non-Date value into a Date
	if ( typeof date === "string" || typeof date === "number" ) {
		date = new Date( date )
		if ( isADate( date ) ) {
			return date
		}
	}

	// ^ if `null`, `undefined`, a blank string, invalid date, or something else
	return new Date
}

function cloneDate ( date: Date ) {
	return new Date( date.getTime() )
}
