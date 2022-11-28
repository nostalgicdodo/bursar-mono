
import * as React from "react"
import { Box } from "@twilio-paste/core/box"
import { ScreenReaderOnly } from "@twilio-paste/core/screen-reader-only"
import { Checkbox } from "@twilio-paste/core/checkbox"

export function CheckboxCell ( {
	onClick,
	id,
	indeterminate,
	checked,
	label
} ) {
	const checkboxRef = React.createRef();

	const handleClick = React.useCallback(() => {
		if ( checkboxRef.current == null)
			return;
		return onClick( !checkboxRef.current.checked )
	}, [ onClick, checkboxRef ] );
	const handleKeyDown = React.useCallback( event => {
		if ( checkboxRef.current == null )
			return;
		if ( event.keyCode === 32 || event.keyCode === 13 ) {
			return onClick( !checkboxRef.current.checked );
		}
	}, [ onClick, checkboxRef ] );

	return <Box
		position="absolute"
		top="0"
		left="0"
		right="0"
		bottom="0"
		display="flex"
		justifyContent="center"
		alignItems="center"
		onClick={ handleClick }
		cursor="pointer"
	>
		<Box marginLeft="space20">
			<Checkbox
				id={ id }
				checked={ checked }
				onKeyDown={ handleKeyDown }
				ref={ checkboxRef }
				indeterminate={ indeterminate }
			>
				<ScreenReaderOnly>{ label }</ScreenReaderOnly>
			</Checkbox>
		</Box>
	</Box>
}
