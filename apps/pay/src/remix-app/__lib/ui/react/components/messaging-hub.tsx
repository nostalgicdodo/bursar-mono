
/**
 |
 | Message Hub
 |
 | This manages the display of messages that are received
 |
 |
 */

/**
 | High-level Logic:
 | 	1. A message that is on its way out, is never brought back in.
 | 	2. If the topic of a message being added matches any of the messages that are currently displayed,
 | 		2.1. then the content is simply swapped
 | 		2.2. the timer is reset if the message content is different
 | 		2.3. an indication is made to the user that the message has been updated if the content is different
 |	3. A message can be set to be shown instantly or only after a delay
 |	4. A message when added or updated only exposes the close button after some threshold time. This serves two purposes:
 | 		4.1. there is a small chance that the user would've at least glanced at the message
 | 		4.2. prevents a situation where a user accidentally closes a message when new content has just come in
 |
 */

import * as React from "react"
import { Toaster, toast } from "sonner"

import { useMessagesContext } from "@/ui/react/context-providers/messages"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
import CircularLoadingIndicator from "@/ui/react/components/loading-indictors/circular-loading-indicator"
import { isAString, isNonBlankString, isNotAString } from "@/utilities/type-checking/strings/identity"
import { isAnObject } from "@/utilities/type-checking/object"





export default function MessagingHub ( { className = "" } ) {
	React.useEffect( function () {
		toast( "", { duration: 1 } )
			// BUGFIX: Simply trigger a toast so that the internal toast counter moves to 1.
			// This is because when a toast with id of 0 is edited, a new toast is appended, instead of replacing the content of the existing one.
	}, [ ] )
	return <Toaster position="bottom-left" expand={ false } />
}


export function Message ( { children, type = "info", onRemove } ) {
	return <div className="relative sm:max-w-1125 md:max-w-none _sm:min-w-1125 md:min-w-1425 lg:min-w-1275 rounded-50 bg-white p-50 shadow-2">
		<div className="flex items-center gap-25">
			{ ( isAString( children ) || !React.isValidElement( children ) ) && <>
				{ type === "loading" && <CircularLoadingIndicator className="mr-25 flex w-100 text-neutral-5" /> }
				{ type === "success" && <CheckCircleIcon className="mr-25 w-100 text-green-2" viewBox="2 2 20 20" /> }
				{ type === "error" && <XCircleIcon className="mr-25 w-100 text-red-2" viewBox="2 2 20 20" /> }
				{ isAString( children ) && <p className="label md:p text-neutral-5" dangerouslySetInnerHTML={{ __html: children }} /> }
				{ isAnObject( children ) && <div className="space-y-min">
					{ isNonBlankString( children.heading ) && <h6 className="label md:p font-medium text-neutral-6" dangerouslySetInnerHTML={{ __html: children.heading }} /> }
					{ isNonBlankString( children.copy ) && <p className="small md:label text-neutral-5" dangerouslySetInnerHTML={{ __html: children.copy }} /> }
				</div> }
			</> }

			{/* Complete manual override */}
			{ React.isValidElement( children ) && <div>{ children }</div> }
		</div>
		<button className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4" onClick={ onRemove }>
			<XMarkIcon className="w-75 p-min bg-white text-neutral-5 rounded-50 shadow-1" />
		</button>
	</div>
}
