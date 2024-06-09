
import { isEmpty } from "@/utilities/type-checking/meta"
import { isNotAString } from "@/utilities/type-checking/strings/identity"
import { isShorterThan } from "@/utilities/type-checking/strings/length"
import { doesNotHaveMixedCase } from "@/utilities/type-checking/strings/casing"
import { doesNotHaveSpecialCharacters } from "@/utilities/type-checking/other"
import { isNotAnEmailAddress } from "@/utilities/type-checking/email-address"

import { createValidator } from "@/utilities/validation/create-validator"





export default {
	userId: [
		createValidator( "EMPTY", isEmpty ),
		// createValidator( "INVALID", isNotAnEmailAddress ),
	],
	password: [
		createValidator( "EMPTY", isEmpty ),
		// createValidator( "INVALID", isNotAString ),
		// createValidator( "INVALID", doesNotHaveSpecialCharacters ),
		// createValidator( "INVALID", doesNotHaveMixedCase ),
		// createValidator( "INVALID", isShorterThan( 10 ) ),
	],
}
