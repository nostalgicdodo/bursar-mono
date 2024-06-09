
/**
 |
 | Password Validation
 |
 |
 */

import { createValidator } from "@/utilities/validation/create-validator"
import { isEmpty } from "@/utilities/type-checking/meta"
import { isNotAnEmailAddress } from "@/utilities/type-checking/email-address"
import { isNotAString } from "@/utilities/type-checking/strings/identity"
import { doesNotHaveSpecialCharacters } from "@/utilities/type-checking/other"
import { doesNotHaveMixedCase } from "@/utilities/type-checking/strings/casing"
import { isShorterThan } from "@/utilities/type-checking/strings/length"






export const passwordValidator = [
	createValidator( "EMPTY", isEmpty ),
	createValidator( "INVALID", isNotAString ),
	createValidator( "INVALID", doesNotHaveSpecialCharacters ),
	createValidator( "INVALID", doesNotHaveMixedCase ),
	createValidator( "INVALID", isShorterThan( 10 ) ),
]
