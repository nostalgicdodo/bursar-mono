
import { placesThatCanReceiveDeliveries, regionCodeToCountryName } from "@/this/types/regions-and-locations/regions"





export function isValidDeliveryReceivingCountryOrRegion ( value ) {
	return ( value in regionCodeToCountryName )
}
	export function isInvalidDeliveryReceivingCountryOrRegion ( value ) {
		return ! ( value in regionCodeToCountryName )
	}

export function isValidDeliveryReceivingState ( regionOrCountryCode, value ) {
	return placesThatCanReceiveDeliveries[ regionOrCountryCode  ].find( ({ isoCode }) => isoCode === value )
}
	export function isInvalidDeliveryReceivingState ( regionOrCountryCode, value ) {
		return ! isValidDeliveryReceivingState( regionOrCountryCode, value )
	}

const postalCodeRegexes = {
	US: /^\d{3,5}(\-\d{4})?$/,
		// ^ 3 to 5 digits, optionally followed by a hyphen and 4 more digits$
		// https://en.wikipedia.org/wiki/ZIP_Code
	IN: /^[1-9]\d{5}$/,
		// ^ 6 digits where the first digit cannot be a 0
		// https://en.wikipedia.org/wiki/Postal_Index_Number
}
export function isValidPostalCode ( regionOrCountryCode, value ) {
	return postalCodeRegexes[ regionOrCountryCode ].test( value )
}
	export function isInvalidPostalCode ( regionOrCountryCode, value ) {
		return ! isValidPostalCode( regionOrCountryCode, value )
	}
