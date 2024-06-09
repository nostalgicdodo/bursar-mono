
/**
 |
 | Email Address Validation
 |
 | Futher validations are in a separate file.
 |
 |
 */

import { createValidator } from "@/utilities/validation/create-validator"
import { isEmpty } from "@/utilities/type-checking/meta"
import { isNotAnEmailAddress } from "@/utilities/type-checking/email-address"






export const emailAddressValidator = [
	createValidator( "EMPTY", isEmpty ),
	createValidator( "INVALID", isNotAnEmailAddress ),
]
