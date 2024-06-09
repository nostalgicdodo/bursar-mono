
import { AddMessageContent, AddMessageOptions } from "@/ui/react/context-providers/messages";
import { isNullOrUndefined } from "@/utilities/type-checking/null-or-undefined";
import { isANonEmptyObject, isNotAnObject } from "@/utilities/type-checking/object";
import { isAString } from "@/utilities/type-checking/strings/identity";





type DisplayMessageBasedOnHTTPResponseArgs = {
	response: unknown;
	addMessage: ( content: AddMessageContent, options: AddMessageOptions ) => void;
	messages: {
		clientIssue: string | { heading: string, copy: string };
		notFoundIssue: string | { heading: string, copy: string };
		serverIssue: string | { heading: string, copy: string };
	};
	topic: string;
}

export default function displayMessageBasedOnHTTPResponse ( { response, addMessage, messages, topic }: DisplayMessageBasedOnHTTPResponseArgs ) {
	if ( isNullOrUndefined( response ) || isAString( response ) || isNotAnObject( response ) ) {
		return addMessage( messages.serverIssue, { topic, type: "error" } )
	}

	if ( !( "ok" in response ) ) {
		// ^ if there is not an "ok" field in the response
		return addMessage( messages.serverIssue, { topic, type: "error" } )
	}

	if ( !response.ok ) {
		if ( response.statusCode === 422 && isANonEmptyObject( response.issues ) ) {
			return addMessage( messages.clientIssue, { topic, type: "error" } )
		}
		else if ( response.statusCode === 404 ) {
			return addMessage( messages.notFoundIssue, { topic, type: "error" } )
		}
		else if ( response.statusCode >= 500 ) {
			return addMessage( messages.serverIssue, { topic, type: "error" } )
		}
	}

	// if (
	// 	isEmpty( response )	// if the response is empty
	// 	|| !( "ok" in response )	// if there isn't an "ok" field in the response
	// 	// || ( !response.ok && isNotEmpty( response.issues ) && isAnEmptyObject( response.issues ) )
	// 	|| ( !response.ok && isAnEmptyObject( response.issues ) )
	// 		// ^ if the response has an "issues" field, but its empty
	// ) {
	// 	// addMessage( "There seems to be an issue with the information you've provided. Kindly re-check and try again.", topic: messageTopic, type: "error" } )
	// 	addMessage( messages.clientIssue, { topic: messageTopic, type: "error" } )
	// 	return
	// }

	// if (
	// 	isEmpty( response )	// if the response is empty
	// 	|| !( "ok" in response )	// if there isn't an "ok" field in the response
	// 	|| ( !response.ok && response.statusCode >= 500 )
	// 		// ^ if the response's "statusCode" value is >= 500
	// ) {
	// 	// addMessage( `There was, { n issue in verifying your credentials. Please try again in some time.`, topic: messageTopic, type: "error" } )
	// 	addMessage( messages.serverIssue, { topic: messageTopic, type: "error" } )
	// 	return
	// }
}
