
/**
 |
 | Handle Validation
 |
 |
 */

import { createValidator } from "@/utilities/validation/create-validator"
import { isStringEmpty } from "@/utilities/type-checking/strings/identity"
import { isShorterThan } from "@/utilities/type-checking/strings/length"
import { isNotAUserHandle } from "@/utilities/type-checking/user-handle"






export const handleValidator = [
	createValidator( "EMPTY", isStringEmpty ),
	createValidator( "SHORT", isShorterThan( 6 ) ),
	createValidator( "INVALID", isNotAUserHandle ),
]
