
import { createValidator } from "./create-validator"
import { isBlankString } from "../type-checking/strings/identity"
import { isInvalidPhoneNumberFormat, isInvalidPhoneRegionCode, isInvalidPhoneSubcriberNumber } from "../type-checking/phone-number"





export const phoneNumberValidator = [
	createValidator( "EMPTY", function ( { regionCode, subscriberNumber } ) {
		return (
			isBlankString( regionCode ?? "" )
			|| isBlankString( subscriberNumber ?? "" )
		)
	} ),
	createValidator( "INVALID", function ( { regionCode, subscriberNumber } ) {
		return (
			isInvalidPhoneRegionCode( regionCode )
			|| isInvalidPhoneNumberFormat( subscriberNumber )
			|| isInvalidPhoneSubcriberNumber( ( regionCode ?? "" ), ( subscriberNumber ?? "" ) )
		)
	} ),
]
