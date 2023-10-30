
import { isAnObject } from "@/utils/type-checking/object"
import { isAString } from "@/utils/type-checking/strings/identity"

/**-> re move! */
type _ErrorProps =
	| [ message?: string, data?: { } ]
	| [ messageOrData?: string | { } ]
	| { message?: string, data?: { } }

type ErrorProps = [
	propsOrMessage?: string | { message?: string, data?: Record<string, unknown> } | null,
	data?: Record<string, unknown>,
]

export default class AnError extends Error {
	constructor ( ...[ propsOrMessage, data ]: ErrorProps ) {
		if ( isAString( propsOrMessage ) ) {
			super( propsOrMessage )
			if ( isAnObject( data ) ) {
				this.data = data
			}
		}
		else if ( isAnObject( propsOrMessage ) ) {
			super( propsOrMessage.message )
			if ( isAnObject( propsOrMessage.data ) ) {
				this.data = propsOrMessage.data
			}
		}
		else {
			super()
			if ( isAnObject( data ) ) {
				this.data = data
			}
		}
	}
}

/**-> re move! */
// export class InvalidInputError extends AnError {}
// export class DataNotFoundError extends AnError {}
// export class ServerError extends AnError {}
