
import { isEmpty } from "@/utils/type-checking/meta"
import { isNotAString } from "@/utils/type-checking/strings/identity"
import { isShorterThan } from "@/utils/type-checking/strings/length"
import { doesNotHaveMixedCase } from "@/utils/type-checking/strings/casing"
import { doesNotHaveSpecialCharacters } from "@/utils/type-checking/other"
import { isNotAnEmailAddress } from "@/utils/type-checking/email-address"

import { createValidator } from "@/utils/validation/create-validator"





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
