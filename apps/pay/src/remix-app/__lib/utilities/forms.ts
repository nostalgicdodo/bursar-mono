
import type { ChangeEvent, FocusEvent } from "react"

type SupportedFormElements = HTMLInputElement | HTMLTextAreaElement

type GetValueFromEventObjectArgs =
	| FocusEvent<SupportedFormElements>
	| ChangeEvent<SupportedFormElements>

export function getValueFromEventObject ( event: GetValueFromEventObjectArgs ) {
	return getValueFromDOMInput( event.target )
}

export function getValueFromDOMInput ( domInput: SupportedFormElements ) {
	switch ( domInput.type ) {
		case "hidden":
		case "text":
		case "radio":
		case "textarea":
		case "select-one":
		case "select-multiple":
		case "email":
		case "password":
		case "search":
		case "tel": {
			return domInput.value
		}
		case "checkbox": {
			return ( domInput as HTMLInputElement ).checked
		}
		default: {
			return null
		}
	}
}
