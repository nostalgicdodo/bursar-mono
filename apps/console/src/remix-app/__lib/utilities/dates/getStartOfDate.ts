
export function getUTCStartOfDate ( date?: Date ) {
	date = getStartOfDate( date )

	// Account for local timezone
	date.setTime( date.getTime() + ( -1 * date.getTimezoneOffset() ) * 60 * 1000 )

	return date
}

export function getLocalStartOfDate ( date?: Date ) {
	return getStartOfDate( date )
}

function getStartOfDate ( date?: Date ) {
	if ( !( date instanceof Date ) ) {
		date = new Date
	}
	date.setHours( 0 )
	date.setMinutes( 0 )
	date.setSeconds( 0 )
	date.setMilliseconds( 0 )

	return date
}
