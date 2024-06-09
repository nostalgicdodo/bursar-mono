
import { useMatches } from "@remix-run/react"

import Header from "@/ui/react/components/header"

export default function getHeader () {
	const matches = useMatches()

	for ( let i = matches.length - 1; i >= 0; i -= 1 ) {
		const showHeader = matches[ i ].handle?.layout?.header
		if ( typeof showHeader === "boolean" ) {
			return showHeader ? Header : null
		}
	}

	return Header
}
