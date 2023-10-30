
import type { FormContext } from "@/ui/react/context-providers/form"

import { useMessagesContext } from "@/ui/react/context-providers/messages"
import { isANonEmptyObject, isObjectEmpty, isObjectNotEmpty } from "@/utils/type-checking/object"
import { getIssues } from "@/utils/validation/get-issues"
import { isAFunction } from "@/utils/type-checking/function"





type UseOnSubmitProps = {
	messageTopic: string;
	validations?: any;
	getValidateObject?: <T>( state: T ) => any;
	getPayload?: <T, U>( state: T, dataValidated: U ) => any;
	messages: {
		progress: string;
	}
}

export default function useOnSubmit ( { messageTopic, validations, getValidateObject, getPayload, messages }: UseOnSubmitProps ) {
	const { addMessage, removeByTopic } = useMessagesContext()

	return async function ( this: FormContext, event, state ) {
		// Validate data
		let dataToValidate = state
		if ( isANonEmptyObject( validations ) ) {
			dataToValidate = isAFunction( getValidateObject ) ? getValidateObject( state ) : state
			const { thereAreIssues, details } = await getIssues( dataToValidate, validations )
			// this.setIssues( details )
			this.setIssues( previousIssues => {
				if ( thereAreIssues ) {
					return details
				}
				if ( isObjectNotEmpty( previousIssues ) ) {
					return { }
				}
				return previousIssues
			} )
			if ( thereAreIssues ) {
				return
					// ^ don't submit the form
			}
		}

		// Dispatch payload over HTTP
		const payload = isAFunction( getPayload ) ? getPayload( state, dataToValidate ) : dataToValidate
		if ( this.method === "POST" ) {
			this.mutation.mutate( payload )
		}
		else if ( this.method === "GET" ) {
			this.query.fetch( payload )
		}

		// removeByTopic( messageTopic )
		addMessage( messages.progress, { topic: messageTopic, delayBy: 2.3, type: "loading" } )
	}
}
