
import { isEmpty } from "@/utils/type-checking/meta"

import { createValidator } from "@/utils/validation/create-validator"





export default {
	searchQuery: [
		createValidator( "EMPTY", isEmpty ),
	],
}
