
import { useNavigate } from "@remix-run/react"

import { useMessagesContext } from "@/ui/react/context-providers/messages"
import { isEmpty, isNotEmpty } from "@/utilities/type-checking/meta"
import { isANonEmptyObject, isAnEmptyObject, isAnObject, isNotAnObject } from "@/utilities/type-checking/object"
import { isAnArray } from "@/utilities/type-checking/array"
import { isAString } from "@/utilities/type-checking/strings/identity"
import { isNullOrUndefined } from "@/utilities/type-checking/null-or-undefined"





type UseOnResponseProps = {
	messageTopic: string;
	onOk: ({ addMessage, navigate }: {
		addMessage: ReturnType<typeof useMessagesContext>[ "addMessage" ],
		navigate: ReturnType<typeof useNavigate>
	}) => void;
	onNotOk: ({ addMessage, navigate }: {
		addMessage: ReturnType<typeof useMessagesContext>[ "addMessage" ],
		navigate: ReturnType<typeof useNavigate>
	}) => void;
	messages: {
		clientIssue: string | { heading: string, copy: string };
		notFoundIssue?: string | { heading: string, copy: string };
		serverIssue: string | { heading: string, copy: string };
	}
}

export default function useOnResponse ( { messageTopic, onOk, onNotOk, messages }: UseOnResponseProps ) {
	const { addMessage, removeByTopic } = useMessagesContext()
	const navigate = useNavigate()

	return async function ( response ) {
		// removeByTopic( messageTopic )

		if ( isNullOrUndefined( response ) || isAString( response ) || isNotAnObject( response ) ) {
			return addMessage( messages.serverIssue, { topic: messageTopic, type: "error" } )
		}
		if ( !( "ok" in response ) ) {
			// ^ if there is not an "ok" field in the response
			return addMessage( messages.serverIssue, { topic: messageTopic, type: "error" } )
		}
		if ( !response.ok ) {
			if ( response.statusCode === 422 && isANonEmptyObject( response.issues ) ) {
				return addMessage( messages.clientIssue, { topic: messageTopic, type: "error" } )
			}
			else if ( response.statusCode === 404 ) {
				return addMessage( messages.notFoundIssue, { topic: messageTopic, type: "error" } )
			}
			else if ( response.statusCode >= 500 ) {
				return addMessage( messages.serverIssue, { topic: messageTopic, type: "error" } )
			}
		}

		if ( ! response.ok ) {
			onNotOk.call( this, { response, addMessage, navigate } )
		}
		else {
			onOk.call( this, { response, addMessage, navigate } )
			// addMessage( "Logging you in...", { topic: messageTopic, type: "success" } )
			// const redirectTo = ( new URL( location.href ) ).searchParams.get( "redirectTo" ) ?? "/store"
			// navigate( redirectTo, { replace: true } )
		}
	}
}
