
import theme from "@ui/design-system/theme"

import { Heading as TwilioHeading } from "@twilio-paste/core/heading"
import { Button as TwilioButton } from "@twilio-paste/core/button"
import { useToaster as useTwilioToaster } from "@twilio-paste/core/toast"

export function Heading ( { children, ...props } ) {
	return <TwilioHeading { ...props }>
		<div style={{ fontFamily: theme.fonts.fontHeadingText }}>{ children }</div>
	</TwilioHeading>
}

/*
 |
 | Button
 |
 | Overrides:
 | 1. Ensures that the background color stays the same on hover
 |
 |
 */
export function Button ( { children, ...props } ) {
	let style = { }
	let classNames = [ "tp-button" ]

	let variant = props.variant || "primary"

	if ( variant === "link" ) {
		return <TwilioButton { ...props }>
			{ children }
		</TwilioButton>
	}
	variant = variant[ 0 ].toUpperCase() + variant.slice( 1 )
	if ( theme.backgroundColors[ "colorBackground" + variant ] ) {
		style[ "--backgroundColorOnHover" ] = theme.backgroundColors[ "colorBackground" + variant ].toString()
		classNames.push( "bg-override" )
	}

	return <div className={ classNames.join( " " ) } style={style}>
		<TwilioButton { ...props }>
			{
				props.fullWidth
				? <div style={{ padding: "0.3125rem 0" }}>{ children }</div>
				: children
			}
		</TwilioButton>
	</div>
}


/*
 |
 | useToaster
 |
 | Prevent empty messages from being passed in
 |
 |
 */
export function useToaster () {
	const toaster = useTwilioToaster()
	const pushFn = toaster.push
	toaster.push = function push ( { id, variant, message, dismissAfter } ) {
		if ( typeof message !== "string" )
			return;
		if ( ! message.trim() )
			return;
		return pushFn( { id, variant, message, dismissAfter } )
	}
	return toaster
}
