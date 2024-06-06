
/**
 |
 | useOnSubmit
 |
 | A higher-order event handler function that:
 | - provides message toast and navigation APIs for perusal
 | - ensures that the most recently focused input is persisted
 | 		to the form state
 | - run validations (if provided)
 | - facilitates dispatch of mutation (if provided)
 | - run an arbitrary handler (if provided)
 | - disabled and re-enables the form it is associated with
 |
 | There is a lot of boilerplate code surrounding
 | 	the above listed tasks that this function
 | 	abstracts away
 |
 |
 */

import * as React from "react"
import { useNavigate } from "@remix-run/react"

import type { UseHTTPMutation } from "@/ui/react/hooks/useHTTPMutation"

import { useMessagesContext } from "@/ui/react/context-providers/messages"
import preventDefault from "@/utils/functions/prevent-default"
import { getIssues } from "@/utils/validation/get-issues"
import { isAnObject, isObjectNotEmpty } from "@/utils/type-checking/object"
import { isAFunction, isNotAFunction } from "@/utils/type-checking/function"
import { FunctionType } from "@/utils/typescript-types/common-types"
import { waitFor } from "@/utils/clock/wait-for"





type UseOnSubmitProps = {
	formRef: any;
	messageTopic?: string;
	validations?: any;
	messages?: {
		whileSubmitting: string | { heading: string, copy: string };
	};
	mutation?: ReturnType<UseHTTPMutation>;
	handler?: FunctionType;
}

export default function useOnSubmit ( { messageTopic, validations, messages, formRef, mutation, handler }: UseOnSubmitProps ) {
	const { addMessage } = useMessagesContext()
	const navigate = useNavigate()

	/* _
	 | Validate data
	 |
	 */
	return React.useCallback( async function onSubmit ( event ) {
		preventDefault( event )

		/* _
		 | Disable the form
		 |
		 */
		formRef.current.setIsDisabled()

		/* -
		 | Persist the latest state
		 |
		 */
		// Blur any of form input elements so that the latest state can be persisted
		const currentlyActiveElement = document.activeElement
		if ( document.activeElement ) {
			document.activeElement?.blur()
		}
		await waitFor( 0.001 )
			// ^ so that the `blur` event handling can occur,
			// 	and the input's value will be persisted
			// 	to the form's state
		currentlyActiveElement?.focus()

		/* _
		 | Validate data
		 |
		 */
		if ( isAnObject( validations ) ) {
			const { thereAreIssues, details } = await getIssues( formRef.current.state, validations )
			formRef.current.setIssues( previousIssues => {
				// Return the current issues (if there are any)
				if ( thereAreIssues ) {
					return details
				}
				// Clear the previous issues (if there were any)
				if ( isObjectNotEmpty( previousIssues ) ) {
					return { }
				}
				return previousIssues
			} )
			if ( thereAreIssues ) {
				formRef.current.setIsEnabled()
				formRef.current.issueHandler( details )
				return
					// ^ don't submit the form
			}
		}

		/* _
		 | Dispatch mutation over HTTP
		 |
		 */
		if ( isAFunction( mutation?.mutate ) ) {
			const payload = formRef.current.state
			mutation.mutate( payload )

			/* _
			 | Feedback
			 |
			 */
			addMessage( messages.whileSubmitting, { topic: messageTopic, delayBy: 2.3, type: "loading" } )
		}


		/* _
		 | Arbitrary handler
		 |
		 */
		if ( isAFunction( handler ) ) {
			handler( formRef, addMessage, navigate )
			// If no mutation was provided,
			// 	then re-enable the form
			if ( isNotAFunction( mutation?.mutate ) ) {
				formRef.current.setIsEnabled()
				// ^ the form is typically re-enabled in the
				// 	handler provided to the corresponding
				// 	`useOnResponse` hook; hence, this statement
				// 	is not present outside of this `if` block
			}
		}
	}, [ ] )
}
