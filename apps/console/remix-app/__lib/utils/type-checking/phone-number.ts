
import { phoneCodeToRegionCode } from "@/this/types/phone-types"
import { regionCodes } from "@/this/types/regions-and-locations/regions"
import { nonDigitRegex } from "@/utils/regular-expressions"

export function isValidPhoneRegionCode ( value ) {
	return ( value in phoneCodeToRegionCode )
}
	export function isInvalidPhoneRegionCode ( value ) {
		return ! isValidPhoneRegionCode( value )
	}

const phoneNumberInvalidCharactersRegex = /[^\d\-\(\)\+\s]/g
export function isValidPhoneNumberFormat ( v ) {
	return phoneNumberInvalidCharactersRegex.test( v ) === false
}
	export function isInvalidPhoneNumberFormat ( v ) {
		return ! isValidPhoneNumberFormat( v )
	}

export function isValidPhoneSubcriberNumber ( regionCode, subcriberNumber ) {
	regionCode = regionCode.replace( nonDigitRegex, "" )
	subcriberNumber = subcriberNumber.replace( nonDigitRegex, "" )
	if ( regionCodes.includes( phoneCodeToRegionCode[ regionCode ] ) ) {
		return subcriberNumber.length === 10
	}
}
	export function isInvalidPhoneSubcriberNumber ( regionCode, subcriberNumber ) {
		return ! isValidPhoneSubcriberNumber( regionCode, subcriberNumber )
	}
