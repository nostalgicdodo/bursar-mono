
import getKeyCodeAndAlias from "@/utilities/functions/get-key-code-and-alias"

export function onEnter ( event, handler ) {
	const { keyAlias, keyCode } = getKeyCodeAndAlias( event )
	if ( keyCode !== 13 && keyAlias !== "enter" ) {
		return
	}
	handler( event )
}
