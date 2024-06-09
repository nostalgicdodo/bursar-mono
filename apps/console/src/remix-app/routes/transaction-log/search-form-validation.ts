
import { isEmpty } from "@/utilities/type-checking/meta"

import { createValidator } from "@/utilities/validation/create-validator"





export default {
	searchQuery: [
		createValidator( "EMPTY", isEmpty ),
	],
}
