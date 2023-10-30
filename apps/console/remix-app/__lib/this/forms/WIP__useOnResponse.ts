
import * as React from "react"
import { useNavigate } from "@remix-run/react"

import { useMessagesContext } from "@/ui/react/context-providers/messages"
import displayMessageBasedOnHTTPResponse from "@/this/forms/display-message-based-on-http-response"





type UseOnResponseProps = {
	messageTopic: string;
	onOk: ({ addMessage, navigate }: {
		addMessage: ReturnType<typeof useMessagesContext>[ "addMessage" ],
		navigate: ReturnType<typeof useNavigate>
	}) => void;
	messages: {
		clientIssue: string | { heading: string, copy: string };
		notFoundIssue: string | { heading: string, copy: string };
		serverIssue: string | { heading: string, copy: string };
	}
}

export default function useOnResponse ( { messageTopic, messages, onOk }: UseOnResponseProps ) {
	const { addMessage } = useMessagesContext()
	const navigate = useNavigate()

	return React.useCallback( function onResponse ( response: unknown ) {
		displayMessageBasedOnHTTPResponse( {
			response,
			addMessage,
			messages,
			topic: messageTopic
		} )

		if ( response?.ok === true ) {
			onOk( { addMessage, navigate } )
		}
	}, [ ] )
}
