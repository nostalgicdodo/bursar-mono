
import preventDefault from "../functions/prevent-default"
import { isAFunction } from "../type-checking/function"

export default function proceedOnConfirmation ( event__or__function, message: string ) {
	message = message || "Are you sure?"

	if (
		event__or__function?.constructor?.name === "SyntheticBaseEvent"
		|| event__or__function instanceof Event
	) {
		if ( ! window.confirm( message ) ) {
			return preventDefault( event__or__function )
		}
	}
	else if ( isAFunction( event__or__function ) ) {
		if ( window.confirm( message ) ) {
			return event__or__function()
		}
	}
}
