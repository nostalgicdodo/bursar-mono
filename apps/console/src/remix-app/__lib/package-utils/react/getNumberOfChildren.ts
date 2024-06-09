
import * as React from "react"

import { isEmpty } from "@/utilities/type-checking/meta"


export function getNumberOfChildren ( children, component ) {
	if ( isEmpty( component ) ) {
		return React.Children.count( children )
	}

	return React.Children
		.map( children, child => child.type )
		?.filter( e => e === component )
		.length
}
