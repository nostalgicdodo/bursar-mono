
import { forwardRef } from "react"
import { useUID } from "@twilio-paste/uid-library";
import { IconWrapper } from "@twilio-paste/icons/cjs/helpers/IconWrapper"

export { MoreIcon } from "@twilio-paste/icons/cjs/MoreIcon"
export { CalendarIcon } from "@twilio-paste/icons/cjs/CalendarIcon"
export { FilterIcon } from "@twilio-paste/icons/cjs/FilterIcon"
export { SearchIcon } from "@twilio-paste/icons/cjs/SearchIcon"
export { ExportIcon } from "@twilio-paste/icons/cjs/ExportIcon"





const HamburgerIcon = forwardRef(
	( { as, display, element = "ICON", size, color, title, decorative }, ref ) => {
		const titleId = `HamburgerIcon-${ useUID() }`;

		if ( ! decorative && title == null ) {
			throw new Error('[HamburgerIcon]: Missing a title for non-decorative icon.');
		}

		return <IconWrapper as={as} display={display} element={element} size={size} color={color} ref={ref}>
			<svg role="img" aria-hidden={decorative} width="100%" height="100%" viewBox="0 0 20 20" aria-labelledby={titleId}>
				{ title ? <title id={titleId}>{title}</title> : null }
				<rect y="2" width="100%" height="2" rx="2"></rect>
				<rect y="9" width="100%" height="2" rx="2"></rect>
				<rect y="16" width="100%" height="2" rx="2"></rect>
			</svg>
		</IconWrapper>
	}
)
HamburgerIcon.displayName = "HamburgerIcon"
export { HamburgerIcon }
